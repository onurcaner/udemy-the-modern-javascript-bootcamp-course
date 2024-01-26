import { UserFormKeys } from '../../routes/admin/account/validators';
import { Result, ValidationError } from 'express-validator';
import { getFormError, createInputFieldHtml } from './helpers';

export const viewFormToSignUpUser = (
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

      ${createInputFieldHtml({
        label: 'Confirm Password',
        error: getFormError(errors, UserFormKeys.passwordConfirmation),
        name: UserFormKeys.passwordConfirmation,
        placeholder: '********',
      })}

      <div>
        <label>Is Admin?</label>
        <input name="${UserFormKeys.isAdmin}" type="checkbox" />
      </div>
      <button>Sign Up</button>
    </form>
  `;
};
