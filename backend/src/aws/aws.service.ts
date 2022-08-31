import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class AwsService {

  public async uploadFile(file: any): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname + ".jpg",
      Body: file.buffer,
      ContentType: "image/jpg"
    }

    const data = await s3
        .upload(params)
        .promise()
        .then(data => {
          return data.Location;
        });

    return data;
  }

}