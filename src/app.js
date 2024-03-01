import 'express-async-errors';
import express from 'express';
import pinoHttp from 'pino-http';
import logger from './logger';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import catalogRoutes from './routes/catalog.routes';
import { sqsConsumer } from './libs/consumer';
import { AppError } from './errors/AppError';
import { ValidationError } from 'joi';
import { NoSuchKey } from '@aws-sdk/client-s3';

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/catalog', catalogRoutes);

app.use((err, req, res, next) => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof NoSuchKey) {
    return res.status(404).json({
      message: 'Catalog not found',
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server listen on port ${PORT}`);
  sqsConsumer();
});

export default app;
