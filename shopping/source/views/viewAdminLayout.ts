import { viewLayout, Layout } from './viewLayout';
import {
  pathAdmin,
  pathAdminAccount,
  pathAdminProducts,
} from '../routes/pagePaths';

export const viewAdminLayout = ({ content, title }: Layout): string => {
  return viewLayout({
    title,
    body: `
      <body class="admin">
        <header>
          <nav class="navbar navbar-bottom">
            <div class="container navbar-container">
              <div>
                <a href="${pathAdmin}">
                  <h3 class="title">Admin Panel</h3>
                </a>
              </div>
              <div class="navbar-item">
                <div class="navbar-buttons">
                  <div class="navbar-item">
                    <a href="${pathAdminAccount}"><i class="fa fa-star"></i> Account</a>
                  </div>
                  <div class="navbar-item">
                    <a href="${pathAdminProducts}"><i class="fa fa-star"></i> Products</a>
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
