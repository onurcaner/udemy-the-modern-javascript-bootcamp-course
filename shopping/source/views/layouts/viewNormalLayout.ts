import { viewLayout, Layout } from './viewLayout';

import { pathAccount, pathCart, pathProducts } from '../../routes/pagePaths';

export const viewNormalLayout = ({ content, title }: Layout): string => {
  return viewLayout({
    title,
    body: `
      <body>
        <header>
          <nav class="navbar navbar-top">
            <div class="container navbar-container">
              <div>
                <ul class="social">
                  <li>
                    <a href=""><i class="fa fa-phone"></i>+1 555 987 6543</a>
                  </li>
                  <li>
                    <a href=""><i class="fa fa-envelope"></i> shop@myshop.com</a>
                  </li>
                </ul>
              </div>
              <div>
                <ul class="social">
                  <li><a href=""><i class="fab fa-facebook"></i></a></li>
                  <li><a href=""><i class="fab fa-twitter"></i></a></li>
                  <li><a href=""><i class="fab fa-linkedin"></i></a></li>
                  <li><a href=""><i class="fab fa-dribbble"></i></a></li>
                  <li><a href=""><i class="fab fa-google-plus"></i></a></li>
                </ul>
              </div>
            </div>
          </nav>
          <nav class="navbar navbar-bottom">
            <div class="container navbar-container">
              <div>
                <a href="/">
                  <h3 class="title">Shopping</h3>
                </a>
              </div>
              <div class="navbar-item">
                <div class="navbar-buttons">
                  <div class="navbar-item">
                    <a href="${pathProducts}"><i class="fa fa-store"></i> Products</a>
                  </div>
                  <div class="navbar-item">
                    <a href="${pathCart}"><i class="fa fa-shopping-cart"></i> Cart</a>
                  </div>
                  <div class="navbar-item">
                    <a href="${pathAccount}"><i class="fa fa-user"></i> Account</a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main class="container">
          ${content}
        </main>
      </body>
    `,
  });
};
