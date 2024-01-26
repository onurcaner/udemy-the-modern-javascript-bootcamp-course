import express from 'express';

import { pathAdminProducts, pathAdminProductsNew } from '../../pagePaths';
import { viewAdminLayout } from '../../../views/viewAdminLayout';
import { viewAdminResponse } from '../../../views/admin/viewAdminResponse';
import { viewFormToCreateProduct } from '../../../views/admin/viewFormToCreateProduct';

const router = express.Router();
export const productsRouter = router;

// products
router.get(pathAdminProducts, (request, response): void => {
  const title = 'Admin Products';
  response.send(
    viewAdminLayout({ title, content: viewAdminResponse(request.path) })
  );
});

// new
router.get(pathAdminProductsNew, (request, response): void => {
  const title = 'Create Product';
  const content = viewFormToCreateProduct();
  response.send(viewAdminLayout({ title, content }));
});
