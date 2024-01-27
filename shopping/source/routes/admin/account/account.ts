import express from 'express';
import { Request } from 'express-validator/src/base';
import { validationResult } from 'express-validator';

import { accountValidationChains, UserForm } from './validators';

import {
  UserAttributes,
  usersRepository,
} from '../../../repositories/UsersRepository';

import { viewFormToSignUpUser } from '../../../views/admin/viewFormToSignUpUser';
import { viewFormToSignInUser } from '../../../views/admin/viewFormToSignInUser';
import { viewAdminLayout } from '../../../views/viewAdminLayout';
import { viewAdminResponse } from '../../../views/admin/viewAdminResponse';
import {
  pathAdminAccount,
  pathAdminAccountSignIn,
  pathAdminAccountSignOut,
  pathAdminAccountSignUp,
} from '../../pagePaths';
import { viewAdmin } from '../../../views/admin/viewAdmin';

const router = express.Router();
export const accountRouter = router;

export interface Session {
  user?: UserAttributes;
}

//
//
//
// Account Page
router.get(pathAdminAccount, (request, response): void => {
  const session = request.session as
    | (typeof request.session & Session)
    | null
    | undefined;
  const content = viewAdmin(session?.user);
  const title = 'Admin Account';
  response.send(viewAdminLayout({ content, title }));
});

// Sign Up
router.get(pathAdminAccountSignUp, (_request, response): void => {
  const title = 'Sign Up';
  const content = viewFormToSignUpUser();
  response.send(viewAdminLayout({ content, title }));
});

router.post(
  pathAdminAccountSignUp,
  accountValidationChains.requireSignUpEmail(),
  accountValidationChains.requireSignUpPassword(),
  accountValidationChains.requireSignUpPassWordConfirmation(),
  (request, response, next): void => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const title = 'Sign Up';
      const content = viewFormToSignUpUser(errors);
      response.send(viewAdminLayout({ content, title }));
      return;
    }
    next();
  },
  (request, response): void => {
    const title = 'Sign Up';
    const session = request.session as
      | (typeof request.session & Session)
      | null
      | undefined;
    createUser(request)
      .then((user) => {
        if (session) session.user = user;
        response.send(
          viewAdminLayout({
            title,
            content: viewAdminResponse(`Account created for ${user.email}`),
          })
        );
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(viewAdminLayout({ title, content: err.message }));
      });
  }
);

// Sign In
router.get(pathAdminAccountSignIn, (request, response): void => {
  const title = 'Sign In';
  const content = viewFormToSignInUser();
  response.send(viewAdminLayout({ content, title }));
});

router.post(
  pathAdminAccountSignIn,
  accountValidationChains.requireSignInEmail(),
  accountValidationChains.requireSignInPassword(),
  (request, response, next): void => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const title = 'Sign In';
      const content = viewFormToSignInUser(errors);
      response.send(viewAdminLayout({ content, title }));
      return;
    }
    next();
  },
  (request, response): void => {
    const title = 'Sign In';
    const session = request.session as
      | (typeof request.session & Session)
      | null
      | undefined;

    signIn(request)
      .then((user) => {
        if (session) session.user = user;
        response.send(
          viewAdminLayout({
            title,
            content: viewAdminResponse('Successfully signed in'),
          })
        );
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(
            viewAdminLayout({ title, content: viewAdminResponse(err.message) })
          );
      });
  }
);

// Sign Out
router.get(pathAdminAccountSignOut, (request, response): void => {
  const title = 'Sign Out';
  request.session = null;
  response.send(
    viewAdminLayout({ title, content: viewAdminResponse('You are signed out') })
  );
});

//
const createUser = async (
  request: Request & Express.Request
): Promise<UserAttributes> => {
  const { email, password, isAdmin } = request.body as
    | UserForm
    | UserAttributes;
  const newUser = await usersRepository.create({
    email,
    password,
    isAdmin: Boolean(isAdmin),
  });
  await usersRepository.saltPassword(newUser.id);
  return newUser;
};

const signIn = async (
  request: Request & Express.Request
): Promise<UserAttributes> => {
  const { email } = request.body as Partial<UserForm> | Partial<UserAttributes>;
  const [user] = await usersRepository.filter({ email });
  return user;
};
