import database from '../config/database';
import { AppError } from '../errors/AppError';

export class CategoryService {
  async add(categoryData) {
    const queryFindCategory = {
      text: `SELECT title, owner_id FROM categories WHERE title = $1 AND owner_id = $2;`,
      values: [categoryData.title, categoryData.owner_id],
    };

    const categoryAlreadyExists = await database.query(queryFindCategory);

    if (categoryAlreadyExists.rowCount > 0) {
      throw new AppError('Category already exists', 409);
    }

    const queryInsertCategory = {
      text: `INSERT INTO categories (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *;`,
      values: [categoryData.title, categoryData.description, categoryData.owner_id],
    };

    const resultCategoryCreated = await database.query(queryInsertCategory);
    const newCategory = resultCategoryCreated.rows[0];

    return newCategory;
  }

  async findAllByOwnerId({ ownerId }) {
    const queryFindAll = {
      text: `SELECT * FROM categories WHERE owner_id = $1;`,
      values: [ownerId],
    };

    const result = await database.query(queryFindAll);

    if (!result) {
      throw new AppError('Invalid category id.');
    }

    if (result.rowCount === 0) {
      throw new AppError('Category does not exists for this owner.', 404);
    }

    return result.rows;
  }

  async findOneById(categoryId, ownerId) {
    const queryFindOneById = {
      text: `SELECT * FROM categories WHERE id = $1 AND owner_id = $2;`,
      values: [categoryId, ownerId],
    };

    const result = await database.query(queryFindOneById);

    if (!result) {
      throw new AppError('Invalid category id.');
    }

    if (result.rowCount === 0) {
      throw new AppError('Category does not exists for this owner.', 404);
    }

    return result.rows[0];
  }

  async findOneByTitle(title, ownerId) {
    const queryFindByTitle = {
      text: `SELECT * FROM categories WHERE title = $1 AND owner_id = $2;`,
      values: [title, ownerId],
    };

    const result = await database.query(queryFindByTitle);

    return result.rows[0];
  }

  async update(categoryData, categoryId) {
    const categoryExists = await this.findOneById(categoryId, categoryData.owner_id);

    if (categoryData.title) {
      const categoryAlreadyExists = await this.findOneByTitle(categoryData.title, categoryData.owner_id);

      if (categoryAlreadyExists) {
        throw new AppError('Category already exists', 409);
      }
    }

    const queryUpdateById = {
      text: `UPDATE categories SET title = $1, description = $2, owner_id = $3 WHERE id = $4;`,
      values: [
        categoryData.title ?? categoryExists.title,
        categoryData.description ?? categoryExists.description,
        categoryData.owner_id ?? categoryExists.owner_id,
        categoryId,
      ],
    };

    const result = await database.query(queryUpdateById);

    if (result.rowCount === 0) {
      throw new AppError('Cannot update category, verify the data and try again.');
    }

    return result.rows[0];
  }

  async delete(categoryId) {
    const queryCategoryExists = {
      text: `SELECT * FROM categories WHERE id = $1;`,
      values: [categoryId],
    };

    const categoryExists = await database.query(queryCategoryExists);

    if (!categoryExists) {
      throw new AppError('Invalid category id.');
    }

    if (categoryExists.rowCount === 0) {
      throw new AppError('Category does not exists.', 404);
    }

    const queryDeleteCategory = {
      text: `DELETE FROM categories WHERE id = $1;`,
      values: [categoryId],
    };

    await database.query(queryDeleteCategory);
  }
}
