import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import type { ImageDao } from "../ImageDao";
const bucket = process.env.PROFILE_IMAGE_BUCKET;
const s3Client = new S3Client({ region: process.env.AWS_REGION });
export class S3ImageDao implements ImageDao {
  public async putImage(alias: string, imageBytes: number[], fileExtension: string): Promise<string> {
    if (!bucket) throw new Error("internal-server-error: PROFILE_IMAGE_BUCKET is not configured");
    const extension = fileExtension.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!extension) throw new Error("bad-request: A valid image extension is required");
    const key = `image/${encodeURIComponent(alias)}-${randomUUID()}.${extension}`;
    const contentTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
    };
    const contentType = contentTypes[extension];
    if (!contentType) throw new Error("bad-request: Unsupported profile image type");
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(imageBytes),
        ContentType: contentType,
      }));
      return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      throw new Error(`internal-server-error: S3 image upload failed: ${String(error)}`);
    }
  }
}
