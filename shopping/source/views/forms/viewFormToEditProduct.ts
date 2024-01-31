import { ValidationError, Result } from 'express-validator';

import {
  getFormError,
  createInputTextHtml,
  createInputUploadHtml,
} from './formHelpers';

import { pathAdminProductsIdEdit } from '../../routes/pagePaths';
import { ProductFormKeys } from '../../routes/admin/products/validators';
import { ProductAttributes } from '../../repositories/productsRepository';

export const viewFormToEditProduct = (
  product: ProductAttributes,
  errors?: Result<ValidationError>
): string => {
  const { id, price, title } = product;
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <form
            method="POST"
            action="${pathAdminProductsIdEdit.replace(':id', id + '')}"
            enctype="multipart/form-data"
          >
            <h1 class="title">Edit Product: ${title}</h1>
            ${createInputTextHtml({
              label: 'Title',
              error: getFormError(errors, ProductFormKeys.title),
              name: ProductFormKeys.title,
              placeholder: title,
            })}

            ${createInputTextHtml({
              label: 'Price',
              error: getFormError(errors, ProductFormKeys.price),
              name: ProductFormKeys.price,
              placeholder: '799.99',
              type: price + '',
            })}

            ${createInputUploadHtml({
              label: 'Image',
              name: ProductFormKeys.image,
              error: getFormError(errors, ProductFormKeys.image),
            })}
            
            <button class="button is-primary">Edit</button>
          </form>
        </div>
      </div>
    </div>
  `;
};
