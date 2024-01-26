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
router.get(pathAdminAccountSignUp, (request, response): void => {
  const title = 'Sign Up';
  const content = viewFormToSignUpUser();
  response.send(viewAdminLayout({ content, title }));
});

router.post(
  pathAdminAccountSignUp,
  accountValidationChains.requireSignUpEmail(),
  accountValidationChains.requireSignUpPassword(),
  accountValidationChains.requireSignUpPassWordConfirmation(),
  /* TODO */
  (request, response): void => {
    const title = 'Sign Up';
    const errors = validationResult(request);
    const session = request.session as
      | (typeof request.session & Session)
      | null
      | undefined;

    if (!errors.isEmpty()) {
      const content = viewFormToSignUpUser(errors);
      response.send(viewAdminLayout({ content, title }));
      return;
    }

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
  (request, response): void => {
    const title = 'Sign In';
    const errors = validationResult(request);
    const session = request.session as
      | (typeof request.session & Session)
      | null
      | undefined;

    if (!errors.isEmpty()) {
      const content = viewFormToSignInUser(errors);
      response.send(viewAdminLayout({ content, title }));
      return;
    }

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
  const { email, password, isAdmin } = request.body as UserForm;
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
  const { email } = request.body as Partial<UserForm>;
  const [user] = await usersRepository.filter({ email });
  return user;
};
