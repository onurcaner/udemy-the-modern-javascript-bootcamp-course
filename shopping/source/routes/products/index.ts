import express from 'express';
import { pathProducts } from '../pagePaths';

import { productsRepository } from '../../repositories/productsRepository';
import { viewNormalLayout } from '../../views/layouts/viewNormalLayout';
import { viewProducts } from '../../views/products/viewProducts';

const router = express.Router();
export const productsRouters = [router];

//
//
// products
router.get(pathProducts, (_request, response) => {
  const title = 'Products';
  productsRepository
    .getAll()
    .then((products) => {
      const content = viewProducts(products);
      response.send(viewNormalLayout({ title, content }));
    })
    .catch((_err) => {
      return;
    });
});
