import { CategoryService } from '../services/CategoryService';

export class CategoryController {
  async create(req, res) {
    const categoryService = new CategoryService();
    const newCategory = await categoryService.add(req.body);
    return res.status(201).json(newCategory);
  }

  async getAll(req, res) {
    const categoryService = new CategoryService();
    const getAllCategories = await categoryService.findAllByOwnerId(req.params);
    return res.status(200).json(getAllCategories);
  }

  async update(req, res) {
    const categoryService = new CategoryService();
    const updateCategory = await categoryService.update(req.body, req.params.id);
    return res.status(200).json(updateCategory);
  }

  async delete(req, res) {
    const categoryService = new CategoryService();
    const deleteCategory = await categoryService.delete(req.params.id);
    return res.status(204).json(deleteCategory);
  }
}
