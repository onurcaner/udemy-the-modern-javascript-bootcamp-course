import { Result, ValidationError } from 'express-validator';

import { getFormError, createInputTextHtml } from './formHelpers';

import { UserFormKeys } from '../../routes/account/formValidators';

import { pathAccountSignIn, pathAccountSignUp } from '../../routes/pagePaths';

export const viewFormToSignUpUser = (
  errors?: Result<ValidationError>
): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <form method="POST" action="${pathAccountSignUp}">
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

            <button class="button is-primary">Sign Up</button>
          </form>
          <a href="${pathAccountSignIn}">Have an account? Sign In</a>
        </div>
      </div>
    </div>
  `;
};
