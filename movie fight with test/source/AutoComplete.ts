import { debounce } from './utils';

export class AutoComplete<T> {
  private elements: {
    root: HTMLElement;
    input: HTMLInputElement;
    dropdownRoot: HTMLElement;
    dropdownResults: HTMLElement;
  };
  constructor(
    rootElement: HTMLElement,
    inputLabel: string,
    private fetchByKeyword: (keyword: string) => Promise<T[]>,
    private createTemplateForResult: (item: T) => string,
    private onClickResult: (item: T) => void,
    private getInputValueFromItem: (item: T) => string
  ) {
    rootElement.innerHTML = `
      <label><b>${inputLabel}</b></label>
      <input class="input" />
      <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
      </div>
    `;
    const inputElement = rootElement.querySelector<HTMLInputElement>('input');
    const dropdownRootElement =
      rootElement.querySelector<HTMLElement>('.dropdown');
    const dropdownResultsElement =
      rootElement.querySelector<HTMLElement>('.results');
    if (!inputElement || !dropdownRootElement || !dropdownResultsElement)
      throw new Error('Something went wrong');
    this.elements = {
      root: rootElement,
      input: inputElement,
      dropdownRoot: dropdownRootElement,
      dropdownResults: dropdownResultsElement,
    };

    this.elements.input.addEventListener('input', (e) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      debounce(this.onInputHandler.bind(this, e))();
    });
    document.addEventListener(
      'click',
      this.onClickOutsideOfDropdown.bind(this)
    );
  }

  private async onInputHandler(e: Event): Promise<void> {
    try {
      if (!(e.target instanceof HTMLInputElement))
        throw new Error('Event target is not a HTMLInputElement');

      const keyword = e.target.value.trim();
      if (!keyword.length) {
        this.hideDropdown();
        return;
      }

      const fetchResults = await this.fetchByKeyword(keyword);
      this.renderResults(fetchResults);
    } catch (err) {
      if (!(err instanceof Error)) return;
      this.renderError(err.message);
    } finally {
      this.showDropdown();
    }
  }

  private renderResult(result: T): void {
    const containerElement = document.createElement('div');
    containerElement.innerHTML = `
      <a href="#" class="dropdown-item">
        ${this.createTemplateForResult(result)}
      </a>
    `;
    const anchorElement =
      containerElement.querySelector<HTMLAnchorElement>('a');
    if (!anchorElement) throw new Error('Something went wrong');

    anchorElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.elements.input.value = this.getInputValueFromItem(result);
      this.onClickResult(result);
      setTimeout(this.hideDropdown.bind(this));
    });
    this.elements.dropdownResults.insertAdjacentElement(
      'beforeend',
      anchorElement
    );
  }

  private renderResults(results: T[]): void {
    this.clearResults();
    results.forEach(this.renderResult.bind(this));
  }

  private renderError(message: string): void {
    this.clearResults();
    this.elements.dropdownResults.innerHTML = `
      <p class="dropdown-item">${message}</p>
    `;
  }

  private clearResults(): void {
    this.elements.dropdownResults.innerHTML = '';
  }

  private showDropdown(): void {
    if (this.elements.input.value)
      this.elements.dropdownRoot.classList.add('is-active');
  }

  private hideDropdown(): void {
    this.elements.dropdownRoot.classList.remove('is-active');
  }

  private onClickOutsideOfDropdown(e: MouseEvent): void {
    if (!e.target) return;
    if (!(e.target instanceof Element)) return;

    if (this.elements.root.contains(e.target)) this.showDropdown();
    else this.hideDropdown();
  }
}
