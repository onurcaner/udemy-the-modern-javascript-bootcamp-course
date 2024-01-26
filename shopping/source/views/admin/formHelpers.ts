import {
  FieldValidationError,
  Result,
  ValidationError,
} from 'express-validator';

export const getFormError = (
  errors: Result<ValidationError> | undefined,
  formKey: string
): FieldValidationError | null => {
  if (!errors) return null;
  const error = errors.mapped()[formKey] as ValidationError | undefined;
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
    <div class="field">
      <label class="label">${label}</label>
      <input
        class="input"
        name="${name}"
        value="${value}"
        placeholder="${placeholder}"
        type="${type}"
      />
      ${error ? `<p class="help is-danger">${error.msg}</p>` : ''}
    </div>
  `;
};
