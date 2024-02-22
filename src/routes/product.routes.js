import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ensureSchemaIsValid } from '../middleware/ensureSchemaIsValid';
import { createProductSchema, updateProductSchema } from '../schemas/productsSchema';

const productRoutes = Router();
const productController = new ProductController();

productRoutes.get('/:ownerId', (req, res) => productController.getAll(req, res));

productRoutes.post('/', ensureSchemaIsValid(createProductSchema), (req, res) => productController.create(req, res));

productRoutes.put('/:id', ensureSchemaIsValid(updateProductSchema), (req, res) => productController.update(req, res));

productRoutes.delete('/:id', (req, res) => productController.delete(req, res));

export default productRoutes;
