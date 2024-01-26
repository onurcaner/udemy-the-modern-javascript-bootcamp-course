import { UserFormKeys } from '../../routes/admin/account/validators';
import { Result, ValidationError } from 'express-validator';
import { getFormError, createInputFieldHtml } from './helpers';

export const viewFormToSignInUser = (
  errors?: Result<ValidationError>
): string => {
  return `
    <form method="POST">
      ${createInputFieldHtml({
        label: 'E-mail',
        error: getFormError(errors, UserFormKeys.email),
        name: UserFormKeys.email,
        placeholder: 'john@gmail.com',
      })}
      
      ${createInputFieldHtml({
        label: 'Password',
        error: getFormError(errors, UserFormKeys.password),
        name: UserFormKeys.password,
        placeholder: '********',
      })}
      <button>Sign In</button>
    </form>
  `;
};
