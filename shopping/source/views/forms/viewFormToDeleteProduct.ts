import { ProductAttributes } from '../../repositories/productsRepository';
import { pathAdminProductsIdDelete } from '../../routes/pagePaths';

export const viewFormToDeleteProduct = ({ id }: ProductAttributes): string => {
  return `
    <form 
      method="POST"
      action="${pathAdminProductsIdDelete.replace(':id', id + '')}"
    >
      <button class="button is-danger">Delete</button>
    </form>
  `;
};
