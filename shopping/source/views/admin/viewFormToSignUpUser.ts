import { Result, ValidationError } from 'express-validator';

import { UserFormKeys } from '../../routes/admin/account/validators';
import { getFormError, createInputTextHtml } from './formHelpers';

import {
  pathAdminAccountSignIn,
  pathAdminAccountSignUp,
} from '../../routes/pagePaths';

export const viewFormToSignUpUser = (
  errors?: Result<ValidationError>
): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <form method="POST" action="${pathAdminAccountSignUp}">
            <h1 class="title">Sign Up</h1>
            ${createInputTextHtml({
              label: 'E-mail',
              error: getFormError(errors, UserFormKeys.email),
              name: UserFormKeys.email,
              placeholder: 'john@gmail.com',
            })}

            ${createInputTextHtml({
              label: 'Password',
              error: getFormError(errors, UserFormKeys.password),
              name: UserFormKeys.password,
              placeholder: '********',
            })}

            ${createInputTextHtml({
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
