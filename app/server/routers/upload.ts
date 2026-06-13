import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { env } from "~/lib/env";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client() {
  if (!env.R2_ENDPOINT || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    return null;
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
    .input(
      z.object({
        fileName: z.string(),
        contentType: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const s3 = getS3Client();
      if (!s3 || !env.R2_BUCKET_NAME) {
        throw new Error("R2 storage not configured");
      }

      const key = `uploads/${Date.now()}_${input.fileName}`;
      const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        ContentType: input.contentType,
        ContentLength: input.fileSize,
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

      return { uploadUrl, key };
    }),

  deleteFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const s3 = getS3Client();
      if (!s3 || !env.R2_BUCKET_NAME) {
        throw new Error("R2 storage not configured");
      }

      const command = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: input.key,
      });

      await s3.send(command);
      return { success: true };
    }),
});
