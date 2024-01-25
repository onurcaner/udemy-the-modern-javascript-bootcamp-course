import { body, CustomValidator } from 'express-validator';
/* import { UserForm, UserFormKeys } from './account'; */
import { usersRepository } from '../../../repositories/UsersRepository';

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
const checkIfEmailIsUsedBefore: CustomValidator = async (
  email: string
): Promise<void> => {
  if ((await usersRepository.filter({ email })).length)
    throw new Error('Email is in use');
};

const checkIfPasswordsAreEqual: CustomValidator = (
  _value,
  { req }
): boolean => {
  if (!req.body) throw new Error('Something went wrong');
  const attr = req.body as UserForm;
  const password = attr[UserFormKeys.password];
  const passwordConfirmation = attr[UserFormKeys.passwordConfirmation];

  if (password !== passwordConfirmation)
    throw new Error('Passwords are not the same');
  return true;
};

export const validationChains = {
  requireEmail: body(UserFormKeys.email)
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid e-mail')
    .custom(checkIfEmailIsUsedBefore),
  requirePassword: body(UserFormKeys.password)
    .trim()
    .isLength({ min: 4, max: 16 })
    .withMessage('Password should be between 4-16 characters long'),
  requirePassWordConfirmation: body(UserFormKeys.passwordConfirmation)
    .trim()
    .isLength({ min: 4, max: 16 })
    .withMessage('Password Confirmation should be between 4-16 characters long')
    .custom(checkIfPasswordsAreEqual),
};
