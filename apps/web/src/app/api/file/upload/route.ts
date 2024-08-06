import { getMinio, getMinioConfig } from '@/lib/minio';
import fs from "fs";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import { fileSync } from 'tmp';

function readerToReadableStream(reader: ReadableStream<Uint8Array>) {
	const r = reader.getReader();
	const readerStream = new Readable({
		read(size) {
			r.read().then(({ done, value }) => {
				if (done) {
					this.push(null);
					return;
				}
				this.push(value);
			})
		},
	});
	return readerStream;

}
function calculateHash(r: Readable) {
	return new Promise<string>((resolve, reject) => {
		const hash = crypto.createHash('sha256')
		hash.setEncoding('hex')
		r.on('end', function () {
			hash.end()
			resolve(hash.read())
		})
		r.on('error', (err) => {
			reject(err)
		})
		r.pipe(hash)
	})
}
export async function POST(req: Request) {
	let cleanup: (() => void) | null = null;
	try {
		const minioClient = await getMinio();
		const config = await getMinioConfig();
		const formData = await req.formData();
		const file = formData.get("file") as File;
		console.log("Uploading file", file.name, file.size, file.type);
		const tmpName = fileSync()
		cleanup = tmpName.removeCallback;
		const mainStream = readerToReadableStream(file.stream());
		const writeStream = fs.createWriteStream(tmpName.name);
		await new Promise((resolve, reject) => {
			writeStream.on('finish', resolve);
			writeStream.on('error', reject);
			mainStream.pipe(writeStream);
		})
		const isImage = file.type.startsWith("image/");
		const hash = await calculateHash(fs.createReadStream(tmpName.name));
		const chunks = hash.match(/.{8}/g)
		if (!chunks) {
			throw new Error("Invalid hash");
		}
		const objectName = chunks.join('/')
		await minioClient.fPutObject(config.minioBucketName, objectName, tmpName.name, {
			'contentType': file.type,
			'size': file.size,
			'name': file.name,
			'hash': hash,
		});

		return NextResponse.json({
			fileName: file.name,
			contentType: file.type,
			status: "success",
			id: hash,
			hash,
			objectName,
		});
	} catch (e: any) {
		return NextResponse.json({ status: "fail", error: e.message });
	} finally {
		if (cleanup) {
			cleanup();
		}
	}
}
