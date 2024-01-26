import { PRODUCTS_REPOSITORY_FILE_NAME } from '../config';
import { Repository, Attributes } from './Repository';

export interface ProductAttributes extends Attributes {
  name: string;
  price: number;
}

class ProductsRepository extends Repository<ProductAttributes> {}

export const productsRepository = new ProductsRepository(
  PRODUCTS_REPOSITORY_FILE_NAME
);
