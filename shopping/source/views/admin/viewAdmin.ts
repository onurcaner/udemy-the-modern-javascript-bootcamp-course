import { UserAttributes } from '../../repositories/UsersRepository';
import {
  pathAdminProducts,
  pathAdminAccountSignIn,
  pathAdminAccountSignOut,
  pathAdminAccountSignUp,
} from '../../routes/pagePaths';

export const viewAdmin = (user?: UserAttributes): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          ${
            user
              ? `
            <p>You are signed in as ${user.isAdmin ? 'an admin' : 'an user'}</p>
            ${
              user.isAdmin
                ? `<div><a href="${pathAdminProducts}">Go to products</a><div/>`
                : ''
            }
            <div><a href="${pathAdminAccountSignOut}">Sign Out</a></div>
          `
              : `
            <p>You are not signed in</p>
            <div><a href="${pathAdminAccountSignIn}">Have an account? Sign In</a></div>
            <div><a href="${pathAdminAccountSignUp}">Need an account? Sign Up</a></div>
          `
          }
        </div>
      </div>
    </div>
  `;
};
