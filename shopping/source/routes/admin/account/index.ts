import express, { RequestHandler } from 'express';

import { pathAdminAccount, pathAccountSignIn } from '../../pagePaths';
import { UserSession } from '../../session';

import { viewAdminLayout } from '../../../views/layouts/viewAdminLayout';
import { viewMessage } from '../../../views/viewMessage';
import { viewUser } from '../../../views/account/viewAccount';

const router = express.Router();
export const adminAccountRouter = router;

//
//
// admin / account
router.get(pathAdminAccount, (request, response): void => {
  const title = 'Admin Account';
  const session = request.session as
    | (typeof request.session & UserSession)
    | null
    | undefined;

  if (!session) {
    const message = 'Cookies are disabled';
    response.send(viewAdminLayout({ title, content: viewMessage(message) }));
    return;
  }
  if (!session.user) {
    response.redirect(pathAccountSignIn);
    return;
  }
  const content = viewUser(session.user);
  response.send(viewAdminLayout({ content, title }));
});

//
//
// Helpers
export const isRequestFromAdmin: RequestHandler = (request, response, next) => {
  const session = request.session as
    | (typeof request.session & UserSession)
    | null
    | undefined;

  if (!session) {
    const errorMessage = 'Cookies are disabled';
    response.send(
      viewAdminLayout({
        title: errorMessage,
        content: viewMessage(errorMessage),
      })
    );
    return;
  }

  if (!session.user) {
    response.redirect(pathAccountSignIn);
    return;
  }

  if (!session.user.isAdmin) {
    const errorMessage = 'Signed in account is not an admin';
    response.send(
      viewAdminLayout({
        title: errorMessage,
        content: viewMessage(errorMessage),
      })
    );
    return;
  }

  next();
};
