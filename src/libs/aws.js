import { PublishCommand, SNS } from '@aws-sdk/client-sns';
import 'dotenv/config';

export class AWSSNS {
  #sns;

  constructor() {
    this.#sns = new SNS({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
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
