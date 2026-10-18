import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as crypto from 'node:crypto';
import * as path from 'node:path';

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly folder: string;

  constructor() {
    const accountId = process.env.CF_R2_ACCOUNT_ID ?? '';
    const accessKeyId = process.env.CF_R2_ACCESS_KEY_ID ?? '';
    const secretAccessKey = process.env.CF_R2_SECRET_ACCESS_KEY ?? '';
    this.bucket = process.env.CF_R2_BUCKET ?? 'kobbys-intertech';
    this.publicUrl = (process.env.CF_R2_PUBLIC_URL ?? '').replace(/\/$/, '');
    this.folder = (process.env.CF_R2_FOLDER ?? 'photo gallery').replace(/^\/+|\/+$/g, '');

    this.client = new S3Client({
      region: 'auto',
      endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
      credentials:
        accessKeyId && secretAccessKey
          ? { accessKeyId, secretAccessKey }
          : undefined,
    });
  }

  /**
   * Upload a buffer to R2.
   * Returns { key, url } where `url` is the full public CDN URL.
   */
  async upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<{ key: string; url: string }> {
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const prefix = this.folder ? `${this.folder}/` : '';
    const key = `${prefix}photo_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    const url = `${this.publicUrl}/${encodeURI(key)}`;
    this.logger.log(`Uploaded ${key} → ${url}`);
    return { key, url };
  }

  /**
   * Delete an object from R2 by its key.
   * Never throws — a missing object is treated as already deleted.
   */
  async delete(key: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      this.logger.log(`Deleted R2 object: ${key}`);
    } catch (err) {
      this.logger.warn(`Failed to delete R2 object ${key}: ${String(err)}`);
    }
  }
}
