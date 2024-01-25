import express from 'express';
import { validationResult } from 'express-validator';
import { validationChains, UserForm } from './validators';
import { usersRepository } from '../../../repositories/UsersRepository';
import { viewFormToSignUpUser } from '../../../views/admin/viewFormToSignUpUser';
import { viewFormToSignInUser } from '../../../views/admin/viewFormToSignInUser';
import { viewLayout } from '../../../views/viewLayout';

const router = express.Router();
export const accountRouter = router;

//
//
//
// Account Page
router.get('/admin/account', (request, response): void => {
  const isSignedIn = request.session?.userId as number | null;
  const content = isSignedIn
    ? `
    <p>You are signed in with ID: ${request.session?.userId}</p>
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
  response.send(
    viewLayout({ content: viewFormToSignUpUser(), title: 'admin/sign-up' })
  );
});

router.post(
  '/admin/account/sign-up',
  validationChains.requireEmail,
  validationChains.requirePassword,
  validationChains.requirePassWordConfirmation,
  (request, response): void => {
    const errors = validationResult(request);
    console.log(errors);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createUser(request, response);
  }
);

// Sign In
router.get('/admin/account/sign-in', (request, response): void => {
  response.send(viewFormToSignInUser());
});

router.post('/admin/account/sign-in', (request, response): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  checkAndSignIn(request, response);
});

// Sign Out
router.get('/admin/account/sign-out', (request, response): void => {
  signOut(request, response);
});

//
const createUser = async (request, response: Response): Promise<void> => {
  try {
    const { email, password, isAdmin } = body as UserForm;
    const newUser = await usersRepository.create({
      email,
      password,
      isAdmin: Boolean(isAdmin),
    });
    await usersRepository.saltPassword(newUser.id);
    if (request.session) request.session.userId = newUser.id;
    response.send(viewLayout({ content: `Account created for ${email}` }));
  } catch (err) {
    if (err instanceof Error)
      response.send(viewLayout({ content: err.message }));
  }
};

const checkAndSignIn = async (
  request: Express.Request,
  response: Express.Response
): Promise<void> => {
  try {
    const { email, password } = request.body as Partial<UserForm>;

    if (!email || !password)
      throw new Error('ERROR: Some form fields are empty');

    const users = await usersRepository.filter({ email });
    if (!users.length)
      throw new Error(`ERROR: No account with provided e-mail: ${email}`);

    const [user] = users;
    if (!(await usersRepository.isValidPassword(user, password)))
      throw new Error(`ERROR: Invalid password`);

    if (request.session) request.session.userId = user.id;
    response.send(viewLayout({ content: 'Successfully signed in' }));
  } catch (err) {
    if (err instanceof Error)
      response.send(viewLayout({ content: err.message }));
  }
};

const signOut = (
  request: Express.Request,
  response: Express.Response
): void => {
  request.session = null;
  response.send(viewLayout({ content: 'You are signed out' }));
};
