import { ValidationError, Result } from 'express-validator';

import { ProductFormKeys } from '../../routes/admin/products/validators';

import { getFormError, createInputFieldHtml } from './formHelpers';

export const viewFormToCreateProduct = (
  errors?: Result<ValidationError>
): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <form method="POST">
            <h1 class="title">Create a new product</h1>
            ${createInputFieldHtml({
              label: 'Name',
              error: getFormError(errors, ProductFormKeys.name),
              name: ProductFormKeys.name,
              placeholder: 'Television',
            })}

            ${createInputFieldHtml({
              label: 'Price',
              error: getFormError(errors, ProductFormKeys.price),
              name: ProductFormKeys.price,
              placeholder: '799.99',
              type: 'number',
            })}

            <div class="field">
              <div class="file">
                <label class="file-label">
                  <input class="file-input" type="file" name="${
                    ProductFormKeys.image
                  }">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                      Choose an image
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <button class="button is-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  `;
};
