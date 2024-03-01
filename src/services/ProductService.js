import database from '../config/database';
import { AppError } from '../errors/AppError';
import { AWSSNS, AWSSNS } from '../libs/aws';
import { CategoryService } from './CategoryService';

export class ProductService {
  async findAllByOwner({ ownerId }) {
    const queryFindAll = {
      text: `
        SELECT 
          p.id AS id,
          p.title AS title,
          p.owner_id AS owner_id,
          p.description AS description,
          p.price AS price,
          jsonb_build_object(
            'id', c.id,
            'title', c.title,
            'description', c.description,
            'owner_id', c.owner_id
          ) AS category
        FROM
            products p
        LEFT JOIN
            categories c ON p.category_id = c.id
        WHERE
            p.owner_id = $1;`,
      values: [ownerId],
    };

    const result = await database.query(queryFindAll);

    if (result.rowCount === 0) {
      throw new AppError('There is no products associated with this owner', 404);
    }

    return result.rows;
  }

  async findOneById(productId, ownerId) {
    const queryFindOneProduct = {
      text: `SELECT * FROM products WHERE id = $1 AND owner_id = $2;`,
      values: [productId, ownerId],
    };

    const result = await database.query(queryFindOneProduct);

    return result.rows[0];
  }

  async findOneByTitle(title, ownerId) {
    const queryFindByTitle = {
      text: `SELECT * FROM products WHERE title = $1 AND owner_id = $2;`,
      values: [title, ownerId],
    };

    const result = await database.query(queryFindByTitle);

    return result.rows[0];
  }

  async findOneByCategory(categoryId, ownerId) {
    const queryFindProductByCategory = {
      text: `SELECT * FROM products WHERE owner_id = $1 AND category_id = $2;`,
      values: [ownerId, categoryId],
    };

    const result = await database.query(queryFindProductByCategory);

    return result.rows;
  }

  async add(productData) {
    const productAlreadyExists = await this.findOneByTitle(productData.title, productData.owner_id);

    if (productAlreadyExists) {
      throw new AppError('Product already exists.', 409);
    }

    const categoryService = new CategoryService();
    const categoryExists = await categoryService.findOneById(productData.category_id, productData.owner_id);

    if (!categoryExists) {
      throw new AppError('Category does not exists for this owner.', 404);
    }

    const queryInsertProduct = {
      text: `
        INSERT INTO products (title, owner_id, description, category_id, price) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
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

    const awsSNS = new AWSSNS();
    await awsSNS.publishToTopic({ owner: productData.owner_id });

    return newProduct;
  }

  async update(productData, productId) {
    const productExists = await this.findOneById(productId, productData.owner_id);

    if (!productExists) {
      throw new AppError('Product does not exists for this owner.', 404);
    }

    if (productData.category_id) {
      const categoryService = new CategoryService();
      const categoryExists = await categoryService.findOneById(productData.category_id, productData.owner_id);

      if (!categoryExists) {
        throw new AppError('Category does not exists for this owner.', 404);
      }
    }

    if (productData.title) {
      const productAlreadyExists = await this.findOneByTitle(productData.title, productData.owner_id);

      if (productAlreadyExists) {
        throw new AppError('Product already exists.', 409);
      }
    }

    const queryUpdateProduct = {
      text: `
        UPDATE 
          products 
        SET title = $1, owner_id = $2, description = $3, category_id = $4, price = $5 
        WHERE 
          id = $6;
        `,
      values: [
        productData.title ?? productExists.title,
        productData.owner_id ?? productExists.owner_id,
        productData.description ?? productExists.description,
        productData.category_id ?? productExists.category_id,
        productData.price ?? productExists.price,
        productId,
      ],
    };

    const result = await database.query(queryUpdateProduct);

    const awsSNS = new AWSSNS();
    await awsSNS.publishToTopic({ owner: productData.onwer_id });

    return result.rows[0];
  }

  async delete(productId) {
    const queryProductExist = {
      text: `SELECT * FROM products WHERE id = $1;`,
      values: [productId],
    };

    const productExist = await database.query(queryProductExist);
    const ownerId = productExist.rows[0].owner_id;

    if (productExist.rowCount === 0) {
      throw new AppError('Product does not exists.', 404);
    }

    const queryDeleteProduct = {
      text: `DELETE FROM products WHERE id = $1;`,
      values: [productId],
    };

    await database.query(queryDeleteProduct);

    const awsSNS = new AWSSNS();
    await awsSNS.publishToTopic({ owner: ownerId });
  }
}
