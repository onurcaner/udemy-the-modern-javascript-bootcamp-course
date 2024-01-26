import { body, CustomValidator } from 'express-validator';
import {
  UserAttributes,
  usersRepository,
} from '../../../repositories/UsersRepository';

export interface UserForm {
  email: string;
  password: string;
  passwordConfirmation: string;
  isAdmin: boolean;
}

export enum UserFormKeys {
  email = 'email',
  password = 'password',
  passwordConfirmation = 'passwordConfirmation',
  isAdmin = 'isAdmin',
}

//
//
// Custom validators
const getFirstUser = async (email: string): Promise<UserAttributes | null> => {
  const users = await usersRepository.filter({ email });
  if (users.length) return users[0];
  else return null;
};

const checkEmailAvailability: CustomValidator = async (
  email: string
): Promise<void> => {
  if (await getFirstUser(email)) throw new Error('Email is in use');
};

const checkIfEmailIsRegistered: CustomValidator = async (
  email: string
): Promise<void> => {
  if (!(await getFirstUser(email))) throw new Error('Email is not registered');
};

const checkIfPasswordsAreEqual: CustomValidator = (
  _value,
  { req }
): boolean => {
  if (!req.body) throw new Error('Something went wrong');
  const { password, passwordConfirmation } = req.body as UserForm;
  if (password !== passwordConfirmation)
    throw new Error('Passwords are not the same');
  return true;
};

const checkIfPasswordIsCorrect: CustomValidator = async (
  _value,
  { req }
): Promise<void> => {
  if (!req.body) throw new Error('Something went wrong');
  const { email, password } = req.body as UserForm;
  const user = await getFirstUser(email);
  if (!user) throw new Error('Incorrect password');
  if (await usersRepository.isValidPassword(user, password)) return;
  else throw new Error('Incorrect password');
};

export const accountValidationChains = {
  requireSignUpEmail: () =>
    body(UserFormKeys.email)
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Invalid e-mail')
      .custom(checkEmailAvailability),

  requireSignUpPassword: () =>
    body(UserFormKeys.password)
      .trim()
      .isLength({ min: 4, max: 16 })
      .withMessage('Password should be between 4-16 characters long'),

  requireSignUpPassWordConfirmation: () =>
    body(UserFormKeys.passwordConfirmation)
      .trim()
      .isLength({ min: 4, max: 16 })
      .withMessage(
        'Password Confirmation should be between 4-16 characters long'
      )
      .custom(checkIfPasswordsAreEqual),

  requireSignInEmail: () =>
    body(UserFormKeys.email)
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Invalid e-mail')
      .custom(checkIfEmailIsRegistered),

  requireSignInPassword: () =>
    body(UserFormKeys.password).trim().custom(checkIfPasswordIsCorrect),
};
