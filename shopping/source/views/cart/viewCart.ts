import { CartItem } from '../../repositories/cartsRepository';
import { pathCartAddId } from '../../routes/pagePaths';
import { pathCartRemoveId } from '../../routes/pagePaths';

const renderItem = (item: CartItem): string => {
  const { amount, id, price, title } = item;
  return `
    <div class="cart-item message">
      <h3 class="subtitle">${title}</h3>
      <div class="cart-right">
        <div>
          $${price}  X  ${amount} = 
        </div>
        <div class="price is-size-4">
          $${price * amount}
        </div>
        <div class="add">
          <form 
            method="POST"
            action="${pathCartAddId.replace(':id', id + '')}"
          >
            <button class="button is-success">                  
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
            </button>
          </form>
        </div>
        <div>&nbsp;</div>
        <div class="remove">
          <form 
            method="POST"
            action="${pathCartRemoveId.replace(':id', id + '')}"
          >
            <button class="button is-danger">                  
              <span class="icon is-small">
                <i class="fas fa-minus"></i>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
};

export const viewCart = (items: CartItem[]): string => {
  const total = items
    .map((item): number => item.amount * item.price)
    .reduce((sum, current): number => sum + current, 0);
  return `
    <div id="cart" class="container">
      <div class="columns">
        <div class="column"></div>
        <div class="column is-four-fifths">
          <h3 class="subtitle"><b>Shopping Cart</b></h3>
          <ul>
            ${items.map(renderItem).join('')}
          </ul>
          <div class="total message is-info">
            <div class="message-header">
              Total
            </div>
            <h1 class="title">$${total}</h1>
            <button class="button is-primary">Buy</button>
          </div>
        </div>
        <div class="column"></div>
      </div>
    </div>
  `;
};
