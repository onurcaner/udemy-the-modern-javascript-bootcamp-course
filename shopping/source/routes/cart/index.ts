import express from 'express';

import { getCartFromSession } from './helpers';

import { pathCart, pathCartAddId, pathCartRemoveId } from '../pagePaths';
import { Session, handleNoSession } from '../session';

import { productsRepository } from '../../repositories/productsRepository';
import { CartItem, cartsRepository } from '../../repositories/cartsRepository';
import { viewNormalLayout } from '../../views/layouts/viewNormalLayout';
import { viewCart } from '../../views/cart/viewCart';

const router = express.Router();
export const cartRouters = [router];

//
//
// cart
router.get(pathCart, (request, response): void => {
  const session = request.session as
    | (typeof request.session & Session)
    | null
    | undefined;

  if (!session) {
    handleNoSession(response);
    return;
  }

  getCartFromSession(session)
    .then((cart) => {
      session.cart = cart;
      return Promise.all(
        cart.items.map(async (item): Promise<CartItem | undefined> => {
          const product = await productsRepository.getById(item.id);
          if (!product) return undefined;
          else return { ...item, ...product };
        })
      );
    })
    .then((items) => {
      return items.filter((item): item is CartItem => Boolean(item));
    })
    .then((items) => {
      const title = 'Cart';
      const content = viewCart(items);
      response.send(viewNormalLayout({ title, content }));
    })
    .catch((_err) => {
      return;
    });
});

//
//
// cart / add
router.post(pathCartAddId, (request, response): void => {
  const id = +request.params.id;
  const session = request.session as
    | (typeof request.session & Session)
    | null
    | undefined;

  if (!session) {
    handleNoSession(response);
    return;
  }

  getCartFromSession(session)
    .then((cart) => {
      const index = cart.items.findIndex((item) => item.id === id);
      if (index === -1) cart.items.push({ id, amount: 1 });
      else cart.items[index].amount += 1;
      return cart;
    })
    .then((cart) => {
      session.cart = cart;
      return cartsRepository.update(cart);
    })
    .then(() => {
      response.redirect(pathCart);
    })
    .catch((_err) => {
      return;
    });
});

//
//
// cart / remove
router.post(pathCartRemoveId, (request, response): void => {
  const id = +request.params.id;
  const session = request.session as
    | (typeof request.session & Session)
    | null
    | undefined;

  if (!session) {
    handleNoSession(response);
    return;
  }

  getCartFromSession(session)
    .then((cart) => {
      const index = cart.items.findIndex((item) => item.id === id);
      if (index === -1) return cart;

      cart.items[index].amount -= 1;
      if (cart.items[index].amount === 0) cart.items.splice(index, 1);

      return cart;
    })
    .then((cart) => {
      session.cart = cart;
      return cartsRepository.update(cart);
    })
    .then(() => {
      response.redirect(pathCart);
    })
    .catch((_err) => {
      return;
    });
});
