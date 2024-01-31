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

  async findAllByOwner({ owner_id }) {
    const queryFindAll = {
      text: `SELECT * FROM categories WHERE owner_id = $1;`,
      values: [owner_id],
    };

    const result = await database.query(queryFindAll);

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

    if (result.rowCount === 0) {
      throw new AppError('Category does not exists. Create a new category or verify the id.', 404);
    }

    return result.rows[0];
  }
}
