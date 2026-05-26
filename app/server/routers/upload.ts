import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { env } from "~/lib/env";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getR2Client() {
  if (!env.R2_ENDPOINT || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 not configured");
  }
  return new S3Client({
    region: "auto",
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export const uploadRouter = createTRPCRouter({
  getPresignedUrl: protectedProcedure
    .input(z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      fileSize: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const r2 = getR2Client();
      const key = `uploads/${ctx.userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${input.fileName.split(".").pop()}`;
      const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: input.contentType,
      });
      const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
      return { uploadUrl, key };
    }),

  deleteFile: protectedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const r2 = getR2Client();
      await r2.send(new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME!,
        Key: input.key,
      }));
      return { success: true };
    }),
});
