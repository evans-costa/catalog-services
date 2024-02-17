import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/:ownerId', (req, res) => categoryController.getAll(req, res));

categoryRoutes.post('/', (req, res) => categoryController.create(req, res));

categoryRoutes.put('/:id', (req, res) => categoryController.update(req, res));

categoryRoutes.delete('/:id', (req, res) => categoryController.delete(req, res));

export default categoryRoutes;
