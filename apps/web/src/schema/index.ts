import { z } from "zod";

export const fileSchema = z.object({
	fileName: z.string(),
	contentType: z.string(),
	id: z.string(),
	thumbnailId: z.string().optional(),
})
export type FileSchemaType = z.infer<typeof fileSchema>;
