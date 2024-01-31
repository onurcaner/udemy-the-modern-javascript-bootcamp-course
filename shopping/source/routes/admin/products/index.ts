import express from 'express';
import { validationResult } from 'express-validator';

import {
  ProductForm,
  ProductFormKeys,
  productValidationChains,
} from './validators';
import { injectUploadedImageToBody } from './helpers';

import { isRequestFromAdmin } from '../account/helpers';

import {
  pathAdminProducts,
  pathAdminProductsIdEdit,
  pathAdminProductsIdDelete,
  pathAdminProductsNew,
} from '../../pagePaths';

import { viewAdminLayout } from '../../../views/layouts/viewAdminLayout';
import { viewFormToCreateProduct } from '../../../views/forms/viewFormToCreateProduct';
import { viewFormToEditProduct } from '../../../views/forms/viewFormToEditProduct';
import {
  ProductAttributes,
  productsRepository,
} from '../../../repositories/productsRepository';
import { viewAdminProducts } from '../../../views/admin/viewAdminProducts';

const router = express.Router();
export const adminProductsRouter = router;

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
  (_request, response): void => {
    const title = 'Create Product';
    const content = viewFormToCreateProduct();
    response.send(viewAdminLayout({ title, content }));
  }
);

router.post(
  pathAdminProductsNew,
  isRequestFromAdmin,
  ...injectUploadedImageToBody(ProductFormKeys.image),
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
    const { image, price, title } = request.body as
      | ProductAttributes
      | ProductForm;
    productsRepository
      .create({ image, price, title })
      .then(() => {
        response.redirect(pathAdminProducts);
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(
            viewAdminLayout({ title: 'Create Product', content: err.message })
          );
      });
  }
);

//
//
// products / :id / edit
router.get(
  pathAdminProductsIdEdit,
  isRequestFromAdmin,

  (request, response): void => {
    const title = 'Edit Product';
    const id = +request.params.id;
    productsRepository
      .getById(id)
      .then((product) => {
        if (!product) throw new Error('Product can not be found');
        const content = viewFormToEditProduct(product);
        response.send(viewAdminLayout({ title, content }));
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(viewAdminLayout({ title, content: err.message }));
      });
  }
);

router.post(
  pathAdminProductsIdEdit,
  isRequestFromAdmin,
  ...injectUploadedImageToBody(ProductFormKeys.image),

  (request, response): void => {
    const pageTitle = 'Edit Product';
    const id = +request.params.id;
    const { image, price, title } = request.body as
      | ProductAttributes
      | ProductForm;

    productsRepository
      .getById(id)
      .then((product) => {
        if (!product) throw new Error('Product can not be found');
        return productsRepository.update({
          id,
          ...(image && { image }),
          ...(price && { price }),
          ...(title && { title }),
        });
      })
      .then(() => {
        response.redirect(pathAdminProducts);
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(
            viewAdminLayout({ title: pageTitle, content: err.message })
          );
      });
  }
);

router.post(
  pathAdminProductsIdDelete,
  isRequestFromAdmin,
  (request, response): void => {
    productsRepository
      .delete(+request.params.id)
      .then(() => {
        response.redirect(pathAdminProducts);
      })
      .catch((_err) => {
        return;
      });
  }
);
