import express from 'express';

import { adminAccountRouter } from './account';
import { adminProductsRouter } from './products';

import { pathAdmin, pathAccountSignIn } from '../pagePaths';
import { UserSession } from '../session';

import { viewAdminLayout } from '../../views/layouts/viewAdminLayout';
import { viewUser } from '../../views/account/viewAccount';

const router = express.Router();
export const adminRouters = [adminAccountRouter, adminProductsRouter, router];

//
//
// admin
router.get(pathAdmin, (request, response): void => {
  const title = 'Admin Panel';
  const session = request.session as
    | (typeof request.session & UserSession)
    | null
    | undefined;

  if (!session) {
    const content = 'Cookies are disabled';
    response.send(viewAdminLayout({ content, title }));
    return;
  }
  if (!session.user) {
    response.redirect(pathAccountSignIn);
    return;
  }
  const content = viewUser(session.user);
  response.send(viewAdminLayout({ content, title }));
});
