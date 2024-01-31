import database from '../config/database';
import { AppError } from '../errors/AppError';
import { CategoryService } from './CategoryService';

export class ProductService {
  async add(productData) {
    const queryFindOneProduct = {
      text: `SELECT title, owner_id FROM products WHERE title = $1 AND owner_id = $2`,
      values: [productData.title, productData.owner_id],
    };

    const productAlreadyExists = await database.query(queryFindOneProduct);

    if (productAlreadyExists.rowCount > 0) {
      throw new AppError('Product already exists.', 409);
    }

    const categoryService = new CategoryService();
    const categoryExists = await categoryService.findOneById(
      productData.category_id,
      productData.owner_id
    );

    const queryInsertProduct = {
      text: `
        INSERT INTO products (title, owner_id, description, category_id, price) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING title, owner_id, price, description;
      `,
      values: [
        productData.title,
        productData.owner_id,
        productData.description,
        productData.category_id,
        productData.price,
      ],
    };

    const resultProductCreated = await database.query(queryInsertProduct);
    const newProduct = resultProductCreated.rows[0];

    newProduct.category = categoryExists;

    return newProduct;
  }

  async findAllByOwner({ owner_id }) {
    const queryFindAll = {
      text: 'SELECT * FROM products WHERE owner_id = $1;',
      values: [owner_id],
    };

    const result = await database.query(queryFindAll);

    if (result.rowCount === 0) {
      throw new AppError('There is no products associated with this owner', 404);
    }

    return result.rows;
  }
}
