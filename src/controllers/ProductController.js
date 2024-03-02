import { ProductService } from '../services/ProductService';

export class ProductController {
  async create(req, res) {
    const productService = new ProductService();
    const newProduct = await productService.add(req.body);
    return res.status(201).json(newProduct);
  }

  async getAll(req, res) {
    const productService = new ProductService();
    const getAllProducts = await productService.findAllByOwner(req.params);
    return res.status(200).json(getAllProducts);
  }

  async update(req, res) {
    const productService = new ProductService();
    const updateProduct = await productService.update(req.body, req.params.id);
    return res.status(200).json(updateProduct);
  }

  async delete(req, res) {
    const productService = new ProductService();
    const deleteProduct = await productService.delete(req.params.id);
    return res.status(204).json(deleteProduct);
  }
}
