import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

const config = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client(config);
  constructor() {}

  async upload(originalname: string, file: Buffer) {
    const fileName = `${uuidv4()}-${originalname}`;
    const encodeFileName = encodeURIComponent(fileName);
    const bucketName = process.env.AWS_BUCKET_NAME;
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: file,
        }),
      );

      return {
        status: 'success',
        message: 'File uploaded successfully',
        data: {
          fileName: fileName,
          url: `https://${bucketName}.s3.amazonaws.com/${encodeFileName}`,
        },
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to upload file',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
