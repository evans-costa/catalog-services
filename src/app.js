import 'express-async-errors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import logger from './logger';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import catalogRoutes from './routes/catalog.routes';
import { AppError } from './errors/AppError';
import { ValidationError } from 'joi';

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/catalog', catalogRoutes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    logger.error(err);
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    logger.error(err);
    return res.status(400).json({
      message: err.message,
    });
  }

  logger.error(err);
  return res.status(500).json({
    message: 'Internal server error',
  });
});

const port = 3000;

app.listen(port, () => {
  logger.info(`Server listen on port ${port}`);
});

export default app;
