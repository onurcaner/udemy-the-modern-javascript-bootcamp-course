import { UserFormKeys } from '../../routes/admin/account/validators';
import {
  FieldValidationError,
  Result,
  ValidationError,
} from 'express-validator';

export const getFormError = (
  errors: Result<ValidationError> | undefined,
  userFormKey: UserFormKeys
): FieldValidationError | null => {
  if (!errors) return null;
  const error = errors.mapped()[userFormKey] as ValidationError | undefined;
  if (!error) return null;
  if (error.type === 'field') return error;
  throw new Error();
};

interface CreateFormFieldHtmlProperties {
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  type?: string;
  error: FieldValidationError | null;
}

export const createInputFieldHtml = ({
  label,
  name,
  value = '',
  placeholder = '',
  type = 'text',
  error = null,
}: CreateFormFieldHtmlProperties): string => {
  /* value="${value ?? error?.value ?? ''}" */
  return `
    <div>
      <label>${label}</label>
      <input
        name="${name}"
        value="${value}"
        placeholder="${placeholder}"
        type="${type}"
      />
      ${error ? `<span>${error.msg}</span>` : ''}
    </div>
  `;
};
