import { Router } from 'express';
import { catalogController } from '../controllers/CatalogController';

const catalogRoutes = Router();

catalogRoutes.get('/:ownerId', (req, res) => catalogController(req, res));

export default catalogRoutes;
