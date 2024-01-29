import express from 'express';
import { validationResult } from 'express-validator';

import { accountFormValidationChains, UserForm } from './formValidators';

import { UserSession } from '../session';
import {
  pathAccount,
  pathAccountSignIn,
  pathAccountSignUp,
  pathAccountSignOut,
  pathAdminAccount,
} from '../pagePaths';

import {
  UserAttributes,
  usersRepository,
} from '../../repositories/UsersRepository';
import { viewFormToSignUpUser } from '../../views/forms/viewFormToSignUpUser';
import { viewFormToSignInUser } from '../../views/forms/viewFormToSignInUser';
import { viewNormalLayout } from '../../views/layouts/viewNormalLayout';
import { viewMessage } from '../../views/viewMessage';
import { viewUser } from '../../views/account/viewAccount';

const router = express.Router();
export const accountRouters = [router];

//
//
// account
router.get(pathAccount, (request, response): void => {
  const title = 'Account';
  const session = request.session as
    | (typeof request.session & UserSession)
    | null
    | undefined;

  if (!session) {
    const message = 'Cookies are disabled';
    response.send(viewNormalLayout({ title, content: viewMessage(message) }));
    return;
  }
  if (!session.user) {
    response.redirect(pathAccountSignIn);
    return;
  }
  if (session.user.isAdmin) {
    response.redirect(pathAdminAccount);
    return;
  }
  const content = viewUser(session.user);
  response.send(viewNormalLayout({ content, title }));
});

//
//
// sign up
router.get(pathAccountSignUp, (_request, response): void => {
  const title = 'Sign Up';
  const content = viewFormToSignUpUser();
  response.send(viewNormalLayout({ content, title }));
});

router.post(
  pathAccountSignUp,
  accountFormValidationChains.requireSignUpEmail(),
  accountFormValidationChains.requireSignUpPassword(),
  accountFormValidationChains.requireSignUpPassWordConfirmation(),

  (request, response, next): void => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const title = 'Sign Up';
      const content = viewFormToSignUpUser(errors);
      response.send(viewNormalLayout({ content, title }));
      return;
    }
    next();
  },

  (request, response): void => {
    const title = 'Sign Up';
    const session = request.session as
      | (typeof request.session & UserSession)
      | null
      | undefined;
    const { email, password, isAdmin } = request.body as
      | UserForm
      | UserAttributes;

    usersRepository
      .create({ email, password, isAdmin })
      .then((user) => {
        return usersRepository.saltPassword(user.id);
      })
      .then((user) => {
        if (session) session.user = user;
        if (user.isAdmin) response.redirect(pathAdminAccount);
        else response.redirect(pathAccount);
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(
            viewNormalLayout({ title, content: viewMessage(err.message) })
          );
      });
  }
);

//
//
// sign in
router.get(pathAccountSignIn, (_request, response): void => {
  const title = 'Sign In';
  const content = viewFormToSignInUser();
  response.send(viewNormalLayout({ content, title }));
});

router.post(
  pathAccountSignIn,
  accountFormValidationChains.requireSignInEmail(),
  accountFormValidationChains.requireSignInPassword(),

  (request, response, next): void => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const title = 'Sign In';
      const content = viewFormToSignInUser(errors);
      response.send(viewNormalLayout({ content, title }));
      return;
    }
    next();
  },

  (request, response): void => {
    const title = 'Sign In';
    const session = request.session as
      | (typeof request.session & UserSession)
      | null
      | undefined;

    const { email } = request.body as UserForm | UserAttributes;

    usersRepository
      .filter({ email })
      .then(([user]) => {
        if (session) session.user = user;
        if (user.isAdmin) response.redirect(pathAdminAccount);
        else response.redirect(pathAccount);
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(
            viewNormalLayout({ title, content: viewMessage(err.message) })
          );
      });
  }
);

//
//
// sign out
router.get(pathAccountSignOut, (request, response): void => {
  request.session = null;
  response.redirect(pathAccountSignIn);
});
