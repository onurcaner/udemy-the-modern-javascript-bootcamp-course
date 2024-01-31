import { UserAttributes } from '../../repositories/usersRepository';
import { pathAdminProducts, pathAccountSignOut } from '../../routes/pagePaths';

export const viewUser = (user: UserAttributes): string => {
  const { isAdmin } = user;
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
            <p>You are signed in as ${isAdmin ? 'an admin' : 'an user'}</p>
            ${
              isAdmin
                ? `<div><a href="${pathAdminProducts}">Go to products</a><div/>`
                : ''
            }
            <div><a href="${pathAccountSignOut}">Sign Out</a></div>
        </div>
      </div>
    </div>
  `;
};
