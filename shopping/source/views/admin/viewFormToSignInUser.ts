import { UserFormKeys } from '../../routes/admin/account/account';

export const viewFormToSignInUser = (): string => {
  return `
    <form method="POST">
      <div>
        <label>E-mail</label>
        <input name="${UserFormKeys.email}" placeholder="john@gmail.com" />
      </div>
      <div>
        <label>Password</label>
        <input name="${UserFormKeys.password}" placeholder="*****" />
      </div>
      <button>Sign In</button>
    </form>
  `;
};
