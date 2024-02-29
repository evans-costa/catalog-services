import { AWSS3 } from '../libs/aws';
import { CategoryService } from './CategoryService';
import { ProductService } from './ProductService';

export class CatalogService {
  async generateJSONCatalog(ownerId) {
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

  async uploadCatalogToS3(catalog) {
    const s3 = new AWSS3();

    await s3.uploadCatalogJSON(`catalog-${catalog.owner}.json`, catalog);
  }

  async getCatalogFromS3(owner) {
    const s3 = new AWSS3();
    const data = s3.getCatalogJSON(`catalog-${owner}.json`);
    return data;
  }

  async sendCatalogToS3(owner) {
    const catalogData = await this.generateJSONCatalog(owner);
    await this.uploadCatalogToS3(catalogData);
  }
}
