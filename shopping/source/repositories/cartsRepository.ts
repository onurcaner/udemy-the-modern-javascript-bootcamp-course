import { Repository, Attributes } from './Repository';
import { ProductAttributes } from './productsRepository';

import { CARTS_REPOSITORY_FILE_NAME } from '../config';

export interface CartAttributes extends Attributes {
  items: { id: number; amount: number }[];
}

export interface CartItem extends ProductAttributes {
  amount: number;
}

class CartsRepository extends Repository<CartAttributes> {}

export const cartsRepository = new CartsRepository(CARTS_REPOSITORY_FILE_NAME);
