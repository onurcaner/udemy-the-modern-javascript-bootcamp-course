import express from 'express';
import { validationResult } from 'express-validator';
import multer from 'multer';

import {
  ProductForm,
  ProductFormKeys,
  productValidationChains,
} from './validators';

import { pathAdminProducts, pathAdminProductsNew } from '../../pagePaths';
import { viewAdminLayout } from '../../../views/viewAdminLayout';
import { viewAdminResponse } from '../../../views/admin/viewAdminResponse';
import { viewFormToCreateProduct } from '../../../views/admin/viewFormToCreateProduct';
import { Request } from 'express-validator/src/base';
import {
  ProductAttributes,
  productsRepository,
} from '../../../repositories/ProductsRepository';

const router = express.Router();
export const productsRouter = router;
const upload = multer({ storage: multer.memoryStorage() });

//
//
//
// products
router.get(pathAdminProducts, (request, response): void => {
  const title = 'Admin Products';
  response.send(
    viewAdminLayout({ title, content: viewAdminResponse(request.path) })
  );
});

// create product
router.get(pathAdminProductsNew, (request, response): void => {
  const title = 'Create Product';
  const content = viewFormToCreateProduct();
  response.send(viewAdminLayout({ title, content }));
});

router.post(
  pathAdminProductsNew,
  upload.single(ProductFormKeys.image),
  (request, _response, next): void => {
    Object.assign(request.body, {
      [ProductFormKeys.image]: request.file?.buffer.toString('base64'),
    });
    next();
  },
  productValidationChains.requireCreateTitle(),
  productValidationChains.requireCreatePrice(),
  productValidationChains.requireCreateImage(),
  (request, response, next): void => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const title = 'Create Product';
      const content = viewFormToCreateProduct(errors);
      response.send(viewAdminLayout({ content, title }));
      return;
    }
    next();
  },
  (request, response): void => {
    console.log(request.file);
    console.log(request.body);
  }
);

//
//
//
// Helpers
const createProduct = async (
  request: Request & Express.Request
): Promise<ProductAttributes> => {
  const { title, price, image } = request.body as
    | ProductForm
    | ProductAttributes;
  const newProduct = await productsRepository.create({ title, price, image });
  return newProduct;
};
