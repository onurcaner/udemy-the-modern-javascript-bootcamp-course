import { ProductAttributes } from '../../repositories/ProductsRepository';
import {
  pathAdminProducts,
  pathAdminProductsNew,
} from '../../routes/pagePaths';

const viewAdminProduct = (product: ProductAttributes): string => {
  const { id, price, title } = product;
  return `
    <tr>
      <td>${title}</td>
      <td>${price}</td>
      <td>
        <a href="${pathAdminProducts}/${id}/edit">
          <button class="button is-link">
            Edit
          </button>
        </a>
      </td>
      <td>
        <button class="button is-danger">Delete</button>
      </td>
  </tr>
  `;
};

export const viewAdminProducts = (products: ProductAttributes[]): string => {
  return `
    <div class="control">
      <h1 class="subtitle">Products</h1>  
      <a href="${pathAdminProductsNew}" class="button is-primary">New Product</a>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(viewAdminProduct).join('')}
      </tbody>
    </table>
  `;
};
