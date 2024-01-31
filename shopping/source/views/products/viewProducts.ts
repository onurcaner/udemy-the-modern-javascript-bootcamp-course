import { ProductAttributes } from '../../repositories/productsRepository';

import { pathCartAddId } from '../../routes/pagePaths';

const viewProduct = (product: ProductAttributes): string => {
  const { id, image, price, title } = product;
  return `
    <li class="column is-one-quarter">
      <div class="card product-card">
        <figure>
          <img src="data:image/png;base64,${image}"/>
        </figure>
        <div class="card-content">
          <h3 class="subtitle">${title}</h3>
          <h5>$${price}</h5>
        </div>
        <footer class="card-footer">
          <form 
            action="${pathCartAddId.replace(':id', id + '')}
            "method="POST"
          >
            <button class="button has-icon is-inverted">
              <i class="fa fa-cart-plus"></i> Add to cart
            </button>
          </form>
        </footer>
      </div>
    </li>
  `;
};

export const viewProducts = (products: ProductAttributes[]): string => {
  return `
    <section class="banner">
      <div class="container">
        <div class="columns is-centered">
          <img src="/images/banner.jpg" />
        </div>
      </div>
    </section>
      
    <section>
      <div class="container">
        <div class="columns">
          <div class="column "></div>
          <div class="column is-four-fifths">
            <div>
              <h2 class="title text-center">Featured Items</h2>
              <ul class="columns products">
                ${products.map(viewProduct).join('')}  
              </ul>
            </div>
          </div>
          <div class="column "></div>
        </div>
      </div>
    </section>
  `;
};
