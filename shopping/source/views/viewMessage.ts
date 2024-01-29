export const viewMessage = (message: string): string => {
  return `
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-quarter">
          <p>${message}</p>
          <a href="..">Go Back</a>
        </div>
      </div>
    </div>
  `;
};
