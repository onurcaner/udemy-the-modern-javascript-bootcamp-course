import { ValidationError, Result } from 'express-validator';

import { ProductFormKeys } from '../../routes/admin/products/validators';

import {
  getFormError,
  createInputTextHtml,
  createInputUploadHtml,
} from './formHelpers';
import { pathAdminProductsNew } from '../../routes/pagePaths';

export const viewFormToCreateProduct = (
  errors?: Result<ValidationError>
): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <form
            method="POST"
            action="${pathAdminProductsNew}"
            enctype="multipart/form-data"
          >
            <h1 class="title">Create a new product</h1>
            ${createInputTextHtml({
              label: 'Title',
              error: getFormError(errors, ProductFormKeys.title),
              name: ProductFormKeys.title,
              placeholder: 'Television',
            })}

            ${createInputTextHtml({
              label: 'Price',
              error: getFormError(errors, ProductFormKeys.price),
              name: ProductFormKeys.price,
              placeholder: '799.99',
              type: 'number',
            })}

            ${createInputUploadHtml({
              label: 'Image',
              name: ProductFormKeys.image,
              error: getFormError(errors, ProductFormKeys.image),
            })}
            
            <button class="button is-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  `;
};
