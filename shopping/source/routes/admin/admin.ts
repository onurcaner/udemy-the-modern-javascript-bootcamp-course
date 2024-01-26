import express from 'express';

import { accountRouter, Session } from './account/account';
import { productsRouter } from './products/products';

import { viewAdminLayout } from '../../views/viewAdminLayout';
import { viewAdmin } from '../../views/admin/viewAdmin';
import { pathAdmin } from '../pagePaths';

const router = express.Router();
export const adminRouters = [accountRouter, productsRouter, router];

router.get(pathAdmin, (request, response): void => {
  const session = request.session as
    | (typeof request.session & Session)
    | null
    | undefined;
  const content = viewAdmin(session?.user);
  const title = 'Admin Panel';
  response.send(viewAdminLayout({ content, title }));
});
