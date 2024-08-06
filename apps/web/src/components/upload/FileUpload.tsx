'use client'
import { Dialog, DialogContent, DialogTitle } from '@repo/ui/dialog'
import type { UploadResult } from '@uppy/core'
import Uppy, { debugLogger } from '@uppy/core'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/file-input/dist/style.css'
import ImageEditor from '@uppy/image-editor'
import XHR from '@uppy/xhr-upload'
import React, { useEffect, useMemo, useState } from 'react'

import { Dashboard } from '@uppy/react'

import { type FileSchemaType } from '@/schema'
import { Button } from '@repo/ui/button'
import type { CarouselApi } from '@repo/ui/carousel'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@repo/ui/carousel'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/image-editor/dist/style.css'
import { ChevronLeftIcon, ChevronRightIcon, UploadIcon, XIcon } from 'lucide-react'

const FileUpload = ({
	maxFiles = 15,
	files = [],
	onChange,
	allowedFileTypes = ['image/*', 'video/*'],
}: {
	allowedFileTypes?: string[]
	maxFiles: number
	files: FileSchemaType[]
	onChange: (files: FileSchemaType[]) => any
}) => {
	const uppy = useMemo(
		() =>
			new Uppy({
				restrictions: {
					maxNumberOfFiles: maxFiles,
					minNumberOfFiles: 1,
					// images and videos
					allowedFileTypes,
				},
				logger: debugLogger,
			})
				.use(ImageEditor)
				.use(XHR, { endpoint: '/api/file/upload' }),
		[]
	)
	const onThumbnailGenerated = (file: any, preview: any) => {
		console.log('thumbnail generated', file, preview)
	}
	const onFileAdded = (res: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
		if (!res.successful) {
			console.error('Error uploading file', res)
			return
		}
		const newFiles = [
			...files,
			...res.successful.map((f: any) => ({
				fileName: f.response.body.fileName,
				contentType: f.response.body.contentType,
				id: f.response.body.hash,
				thumbnailId: f.response.body.thumbnailId,
			})),
		]
		// take the last ones if we have more than maxFiles
		if (newFiles.length > maxFiles) {
			newFiles.splice(0, newFiles.length - maxFiles)
		}
		onChange(newFiles)
	}
	useEffect(() => {
		uppy.on('complete', onFileAdded)
		uppy.on('thumbnail:generated', onThumbnailGenerated)
		return () => {
			uppy.off('complete', onFileAdded)
			uppy.off('thumbnail:generated', onThumbnailGenerated)
		}
	}, [uppy])
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = React.useState(0)
	const count = useMemo(() => files.length, [files])
	const removeFile = (index: number) => {
		const newFiles = [...files]
		newFiles.splice(index, 1)
		onChange(newFiles)
	}
	useEffect(() => {
		if (!api) {
			return
		}
		setCurrent(api.selectedScrollSnap() + 1)
		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1)
		})
	}, [api])
	const [showUppy, setShowUppy] = useState(false)
	return (
		<>
			{files.length > 0 ? (
				<div className="w-full max-w-2xl mx-auto py-12 px-4 md:px-6">
					<div className="relative group">
						<Carousel setApi={setApi} className="rounded-lg overflow-hidden relative">
							<CarouselContent>
								{files.map((file, idx) => (
									<CarouselItem key={idx}>
										<div className="relative aspect-video">
											{file.contentType.startsWith('image') ? (
												<img src={`/api/file/download/${file.id}`} width={800} height={450} alt="Carousel Image" className="object-cover w-full h-full" />
											) : (
												<video className="object-cover w-full h-full" controls>
													<source src={`/api/file/download/${file.id}`} />
												</video>
											)}
											<Button variant="ghost" type="button" onClick={() => removeFile(idx)} size="icon" className="absolute top-2 right-2 ">
												<XIcon className="w-4 h-4" />
												<span className="sr-only">Remove</span>
											</Button>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							{current > 1 && (
								<CarouselPrevious type="button" className="absolute left-2 top-1/2 -translate-y-1/2">
									<ChevronLeftIcon className="w-6 h-6" />
								</CarouselPrevious>
							)}
							{current < count && (
								<CarouselNext type="button" className="absolute right-2 top-1/2 -translate-y-1/2">
									<ChevronRightIcon className="w-6 h-6" />
								</CarouselNext>
							)}
						</Carousel>
						<div className="mt-6 flex justify-between items-center">
							<div className="text-sm  ">
								Slide {current} of {count}
							</div>
							<Button type="button" variant="outline" size="lg" onClick={() => setShowUppy(true)}>
								<UploadIcon className="w-5 h-5 mr-2" />
								Upload File
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="w-full mx-auto py-12">
					<Button type="button" variant="outline" size="lg" onClick={() => setShowUppy(true)}>
						<UploadIcon className="w-5 h-5 mr-2" />
						Upload File
					</Button>
				</div>
			)}
			<Dialog open={showUppy} onOpenChange={setShowUppy}>
				<DialogContent className="w-full max-w-4xl bg-gray-50">
					<DialogTitle>Upload Files</DialogTitle>
					{showUppy && (
						<div className="mx-auto">
							<Dashboard
								note={`You can upload up to ${maxFiles} files`}
								uppy={uppy}
								fileManagerSelectionType="files"
								singleFileFullScreen={true}
								proudlyDisplayPoweredByUppy={false}
								plugins={['ImageEditor']}
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}

export default FileUpload
