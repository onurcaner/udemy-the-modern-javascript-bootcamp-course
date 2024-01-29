import { viewLayout, Layout } from './viewLayout';

import { pathAccount } from '../../routes/pagePaths';

export const viewNormalLayout = ({ content, title }: Layout): string => {
  return viewLayout({
    title,
    body: `
      <body>
        <header>
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
                    <a href="${pathAccount}"><i class="fa fa-star"></i> Account</a>
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
