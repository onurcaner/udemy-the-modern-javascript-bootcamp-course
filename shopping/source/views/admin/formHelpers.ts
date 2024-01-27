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

interface CreateInputFieldHtmlProperties {
  label: string;
  name: string;
  error: FieldValidationError | null;
}

interface CreateInputUploadHtmlProperties
  extends CreateInputFieldHtmlProperties {
  placeholder?: string;
  value?: string;
  type?: string;
}

export const createInputTextHtml = ({
  label,
  name,
  value = '',
  placeholder = '',
  type = 'text',
  error = null,
}: CreateInputUploadHtmlProperties): string => {
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

export const createInputUploadHtml = ({
  label,
  name,
  error = null,
}: CreateInputFieldHtmlProperties): string => {
  return `
    <div class="field">
      <label class="label">${label}</label>
      <div class="file">
        <input class="file-cta" type="file" name="${name}">
      </div>
      ${error ? `<p class="help is-danger">${error.msg}</p>` : ''}
    </div>
  `;
};
