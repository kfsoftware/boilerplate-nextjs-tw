import { Client as MinioClient } from 'minio';
export async function getMinioConfig() {
	const config = {
		minioAccessKey: process.env.MINIO_ACCESS_KEY as string,
		minioSecretKey: process.env.MINIO_SECRET_KEY as string,
		minioEndPoint: process.env.MINIO_ENDPOINT as string,
		minioPort: parseInt(process.env.MINIO_PORT as string),
		minioUseSSL: process.env.MINIO_USE_SSL === 'true',
		minioRegion: process.env.MINIO_REGION as string,
		minioBucketName: process.env.MINIO_BUCKET_NAME as string,
	};
	return config
	
}
export async function getMinio() {
	const config = await getMinioConfig()

	const minioClient = new MinioClient({
		accessKey: config.minioAccessKey as string,
		secretKey: config.minioSecretKey as string,
		endPoint: config.minioEndPoint as string,
		port: config.minioPort as number,
		useSSL: config.minioUseSSL as boolean,
		region: config.minioRegion as string,
	});
	return minioClient
}