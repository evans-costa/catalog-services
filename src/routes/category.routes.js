import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { ensureSchemaIsValid } from '../middleware/ensureSchemaIsValid';
import { createCategorySchema, updateCategorySchema } from '../schemas/categoriesSchema';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/:ownerId', (req, res) => categoryController.getAll(req, res));

categoryRoutes.post('/', ensureSchemaIsValid(createCategorySchema), (req, res) => categoryController.create(req, res));

categoryRoutes.put('/:id', ensureSchemaIsValid(updateCategorySchema), (req, res) =>
  categoryController.update(req, res)
);

categoryRoutes.delete('/:id', (req, res) => categoryController.delete(req, res));

export default categoryRoutes;
