import { CatalogService } from '../services/CatalogService';

export async function catalogController(req, res) {
  const catalogService = new CatalogService();
  const getJSONCatalog = await catalogService.getCatalogFromS3(req.params.ownerId);
  return res.status(200).json(getJSONCatalog);
}
