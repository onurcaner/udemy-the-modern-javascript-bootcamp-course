import { UserFormKeys } from '../../routes/admin/account/account';

export const viewFormToSignUpUser = (): string => {
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
      <div>
        <label>Confirm Password</label>
        <input name="${UserFormKeys.passwordConfirmation}" placeholder="*****" />
      </div>
      <div>
        <label>Is Admin?</label>
        <input name="${UserFormKeys.isAdmin}" type="checkbox" />
      </div>
      <button>Sign Up</button>
    </form>
  `;
};
