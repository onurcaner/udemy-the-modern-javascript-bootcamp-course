export interface Layout {
  title?: string;
  content?: string;
  body?: string;
}

export const viewLayout = ({ body, title }: Layout): string => {
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
          : 'Shopping'
      }
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"></link>
      <link href="/css/common.css" rel="stylesheet" type="text/css">
    </head>
    ${body}
  </html>
  `;
};
