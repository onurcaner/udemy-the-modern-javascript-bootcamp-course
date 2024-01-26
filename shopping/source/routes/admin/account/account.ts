import express from 'express';
import { Request } from 'express-validator/src/base';
import { validationResult } from 'express-validator';

import { validationChains, UserForm } from './validators';

import {
  UserAttributes,
  usersRepository,
} from '../../../repositories/UsersRepository';

import { viewFormToSignUpUser } from '../../../views/admin/viewFormToSignUpUser';
import { viewFormToSignInUser } from '../../../views/admin/viewFormToSignInUser';
import { viewLayout } from '../../../views/viewLayout';

const router = express.Router();
export const accountRouter = router;

export interface Session {
  user?: UserAttributes;
}

//
//
//
// Account Page
router.get('/admin/account', (request, response): void => {
  const session = request.session as
    | (typeof request.session & Session)
    | null
    | undefined;
  const content = session?.user
    ? `
    <p>You are signed in with ID: ${session.user.id}</p>
    <a href="./account/sign-out">Sign Out</a>
  `
    : `
    <p>You are not signed in</p>
    <a href="./account/sign-in">Sign In</a>
    <a href="./account/sign-up">Sign Up</a>
  `;
  response.send(viewLayout({ content, title: 'admin/account' }));
});

// Sign Up
router.get('/admin/account/sign-up', (request, response): void => {
  const title = request.path;
  const content = viewFormToSignUpUser();
  response.send(viewLayout({ content, title }));
});

router.post(
  '/admin/account/sign-up',
  validationChains.requireSignUpEmail(),
  validationChains.requireSignUpPassword(),
  validationChains.requireSignUpPassWordConfirmation(),
  /* TODO */
  (request, response): void => {
    const title = request.path;
    const errors = validationResult(request);
    const session = request.session as
      | (typeof request.session & Session)
      | null
      | undefined;

    if (!errors.isEmpty()) {
      const content = viewFormToSignUpUser(errors);
      response.send(viewLayout({ content, title }));
      return;
    }

    createUser(request)
      .then((user) => {
        if (session) session.user = user;
        response.send(
          viewLayout({ title, content: `Account created for ${user.email}` })
        );
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(viewLayout({ title, content: err.message }));
      });
  }
);

// Sign In
router.get('/admin/account/sign-in', (request, response): void => {
  const title = request.path;
  const content = viewFormToSignInUser();
  response.send(viewLayout({ content, title }));
});

router.post(
  '/admin/account/sign-in',
  validationChains.requireSignInEmail(),
  validationChains.requireSignInPassword(),
  (request, response): void => {
    const title = request.path;
    const errors = validationResult(request);
    const session = request.session as
      | (typeof request.session & Session)
      | null
      | undefined;

    if (!errors.isEmpty()) {
      const content = viewFormToSignInUser(errors);
      response.send(viewLayout({ content, title }));
      return;
    }

    signIn(request)
      .then((user) => {
        if (session) session.user = user;
        response.send(viewLayout({ title, content: 'Successfully signed in' }));
      })
      .catch((err) => {
        if (err instanceof Error)
          response.send(viewLayout({ title, content: err.message }));
      });
  }
);

// Sign Out
router.get('/admin/account/sign-out', (request, response): void => {
  const title = request.path;
  request.session = null;
  response.send(viewLayout({ title, content: 'You are signed out' }));
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
