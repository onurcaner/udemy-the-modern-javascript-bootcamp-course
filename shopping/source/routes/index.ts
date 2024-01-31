import express from 'express';

import { pathProducts } from './pagePaths';
import { adminRouters } from './admin';
import { accountRouters } from './account';
import { productsRouters } from './products';
import { cartRouters } from './cart';

const router = express.Router();
export const routers = [
  ...adminRouters,
  ...accountRouters,
  ...productsRouters,
  ...cartRouters,
  router,
];

router.get('/', (_request, response) => {
  response.redirect(pathProducts);
});
