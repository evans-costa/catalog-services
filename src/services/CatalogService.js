import { CategoryService } from './CategoryService';
import { ProductService } from './ProductService';

export class CatalogService {
  async generateJSONCatalog({ ownerId }) {
    const productService = new ProductService();
    const categoryService = new CategoryService();

    const categories = await categoryService.findAllByOwnerId({ ownerId });

    let catalog = {
      owner: ownerId,
      catalog: [],
    };

    for (let category of categories) {
      const getAllProductsByCategory = await productService.findOneByCategory(category.id, ownerId);

      if (getAllProductsByCategory.length > 0) {
        catalog.catalog.push({
          category_title: category.title,
          category_description: category.description,
          itens: getAllProductsByCategory.map((product) => ({
            title: product.title,
            description: product.description,
            price: product.price,
          })),
        });
      }
    }

    return catalog;
  }
}
