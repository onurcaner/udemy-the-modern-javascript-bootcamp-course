import { RequestHandler } from 'express';

import { pathAccountSignIn } from '../../pagePaths';
import { Session } from '../../session';

import { viewAdminLayout } from '../../../views/layouts/viewAdminLayout';
import { viewMessage } from '../../../views/viewMessage';

export const isRequestFromAdmin: RequestHandler = (request, response, next) => {
  const session = request.session as
    | (typeof request.session & Session)
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
