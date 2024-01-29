import { Result, ValidationError } from 'express-validator';

import { getFormError, createInputTextHtml } from './formHelpers';

import { pathAccountSignIn, pathAccountSignUp } from '../../routes/pagePaths';

import { UserFormKeys } from '../../routes/account/formValidators';

export const viewFormToSignInUser = (
  errors?: Result<ValidationError>
): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <form method="POST" action="${pathAccountSignIn}">
            <h1 class="title">Sign in</h1>
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
            <button class="button is-primary">Sign In</button>
          </form>
          <a href="${pathAccountSignUp}">Need an account? Sign Up</a>
        </div>
      </div>
    </div>
  `;
};
