import 'dotenv/config';
import { PublishCommand, SNS } from '@aws-sdk/client-sns';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { SQS } from '@aws-sdk/client-sqs';

const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

export class AWSSNS {
  #sns;

  constructor() {
    this.#sns = new SNS(config);
  }

  async publishToTopic(data) {
    const command = new PublishCommand({
      Message: JSON.stringify(data),
      TopicArn: process.env.AWS_TOPIC_ARN,
    });

    const response = await this.#sns.send(command);
    return response;
  }
}

export class AWSS3 {
  #s3;

  constructor() {
    this.#s3 = new S3(config);
  }

  async uploadCatalogJSON(catalogName, catalogContent) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: catalogName,
      Body: JSON.stringify(catalogContent),
    });

    try {
      const response = await this.#s3.send(command);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getCatalogJSON(catalogName) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: catalogName,
      ResponseContentType: 'application/json',
    });

    try {
      const response = await this.#s3.send(command);
      const stream = await response.Body.transformToString();
      return JSON.parse(stream);
    } catch (err) {
      throw err;
    }
  }
}

export class AWSSQS {
  sqs;

  constructor() {
    this.sqs = new SQS(config);
  }
}
