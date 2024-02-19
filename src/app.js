import 'express-async-errors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import logger from './logger';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import { AppError } from './errors/AppError';

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    logger.error(err);
    return res.status(err.statusCode).json({
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
