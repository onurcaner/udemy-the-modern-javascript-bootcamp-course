import express from 'express';
import { validationResult } from 'express-validator';
import multer from 'multer';

import {
  ProductForm,
  ProductFormKeys,
  productValidationChains,
} from './validators';

import {
  pathAdminProducts,
  pathAdminProductsId,
  pathAdminProductsNew,
} from '../../pagePaths';
import { viewAdminLayout } from '../../../views/layouts/viewAdminLayout';
import { viewMessage } from '../../../views/viewMessage';
import { viewFormToCreateProduct } from '../../../views/forms/viewFormToCreateProduct';
import { Request } from 'express-validator/src/base';
import {
  ProductAttributes,
  productsRepository,
} from '../../../repositories/ProductsRepository';
import { isRequestFromAdmin } from '../account';
import { viewAdminProducts } from '../../../views/products/viewAdminProducts';

const router = express.Router();
export const adminProductsRouter = router;
const upload = multer({ storage: multer.memoryStorage() });

//
//
// products
router.get(pathAdminProducts, isRequestFromAdmin, (request, response): void => {
  const title = 'Admin Products';
  productsRepository
    .getAll()
    .then((products): void => {
      response.send(
        viewAdminLayout({ title, content: viewAdminProducts(products) })
      );
    })
    .catch((err): void => {
      if (err instanceof Error)
        response.send(viewAdminLayout({ title, content: err.message }));
    });
});

//
//
// products / new
router.get(
  pathAdminProductsNew,
  isRequestFromAdmin,
  (request, response): void => {
    const title = 'Create Product';
    const content = viewFormToCreateProduct();
    response.send(viewAdminLayout({ title, content }));
  }
);

router.post(
  pathAdminProductsNew,
  isRequestFromAdmin,
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
    const title = 'Create Product';
    createProduct(request)
      .then((product: ProductAttributes) => {
        viewAdminLayout({
          title,
          content: viewMessage(`Product: ${product.title} is created`),
        });
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(viewAdminLayout({ title, content: err.message }));
      });
  }
);

//
//
// products / :id / edit
router.get(pathAdminProductsId, (request, response): void => {});

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
