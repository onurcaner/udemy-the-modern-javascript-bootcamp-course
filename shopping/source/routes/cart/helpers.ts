import { Session } from '../session';

import {
  CartAttributes,
  cartsRepository,
} from '../../repositories/cartsRepository';

export const getCartFromSession = async (
  session: Session
): Promise<CartAttributes> => {
  const cart =
    (session.cart && (await cartsRepository.getById(session.cart.id))) ??
    (await cartsRepository.create({ items: [] }));

  return cart;
};
