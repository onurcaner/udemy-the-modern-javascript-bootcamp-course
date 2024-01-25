interface Layout {
  content: string;
  title?: string;
}

export const viewLayout = ({ content, title }: Layout): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ${
        title
          ? `
          <title>${title}</title>
        `
          : ''
      }
    </head>
    <body>
      ${content}
    </body>
  </html>
  `;
};
