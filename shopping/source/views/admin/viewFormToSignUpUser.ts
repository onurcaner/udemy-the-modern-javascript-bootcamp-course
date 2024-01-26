import { Result, ValidationError } from 'express-validator';

import { UserFormKeys } from '../../routes/admin/account/validators';
import { getFormError, createInputFieldHtml } from './formHelpers';

import { pathAdminAccountSignIn } from '../../routes/pagePaths';

export const viewFormToSignUpUser = (
  errors?: Result<ValidationError>
): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <form method="POST">
            <h1 class="title">Sign Up</h1>
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

            <div class="field">
              <label class="checkbox">Is Admin?</label>
              <input 
                class="checkbox" 
                name="${UserFormKeys.isAdmin}" type="checkbox" />
            </div>
            <button class="button is-primary">Sign Up</button>
          </form>
          <a href="${pathAdminAccountSignIn}">Have an account? Sign In</a>
        </div>
      </div>
    </div>
  `;
};
