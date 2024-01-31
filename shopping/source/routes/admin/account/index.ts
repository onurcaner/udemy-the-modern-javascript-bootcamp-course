import express from 'express';

import { pathAdminAccount, pathAccountSignIn } from '../../pagePaths';
import { Session, handleNoSession } from '../../session';

import { viewAdminLayout } from '../../../views/layouts/viewAdminLayout';
import { viewUser } from '../../../views/account/viewAccount';

const router = express.Router();
export const adminAccountRouter = router;

//
//
// admin / account
router.get(pathAdminAccount, (request, response): void => {
  const title = 'Admin Account';
  const session = request.session as
    | (typeof request.session & Session)
    | null
    | undefined;

  if (!session) {
    handleNoSession(response);
    return;
  }
  if (!session.user) {
    response.redirect(pathAccountSignIn);
    return;
  }
  const content = viewUser(session.user);
  response.send(viewAdminLayout({ content, title }));
});
