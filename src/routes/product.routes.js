import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const productRoutes = Router();
const productController = new ProductController();

productRoutes.get('/:ownerId', (req, res) => productController.getAll(req, res));

productRoutes.post('/', (req, res) => productController.create(req, res));

productRoutes.put('/:id', (req, res) => productController.update(req, res));

export default productRoutes;
