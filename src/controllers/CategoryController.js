import { CategoryService } from '../services/CategoryService';

export class CategoryController {
  async create(req, res) {
    const categoryService = new CategoryService();
    const newCategory = await categoryService.add(req.body);
    return res.status(201).json(newCategory);
  }

  async getAll(req, res) {
    const categoryService = new CategoryService();
    const getAllCategories = await categoryService.findAllByOwner(req.body);
    return res.status(200).json(getAllCategories);
  }
}
