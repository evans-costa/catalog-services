import { AWSSQS } from './aws';
import { Consumer } from 'sqs-consumer';
import { CatalogService } from '../services/CatalogService';
import logger from '../logger';

export function sqsConsumer() {
  const awsSQS = new AWSSQS();

  const consumer = Consumer.create({
    queueUrl: process.env.AWS_SQS_QUEUE_URL,
    handleMessage: async (message) => {
      const catalogService = new CatalogService();

      const rawBody = JSON.parse(message.Body);
      const messageBody = JSON.parse(rawBody.Message);

      await catalogService.sendCatalogToS3(messageBody.owner);
    },
    sqs: awsSQS.sqs,
  });

  consumer.on('error', (err) => {
    logger.error(err);
  });

  consumer.on('processing_error', (err) => {
    logger.error(err);
  });

  consumer.start();
}
