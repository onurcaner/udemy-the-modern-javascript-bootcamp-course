import Mocha from 'mocha';
import { expect } from 'chai';
import { AutoComplete } from '../source/AutoComplete';

Mocha.setup('bdd');
Mocha.run();

interface TestSearchResult {
  value: string;
}

const rootElement = document.querySelector<HTMLElement>('#target');
if (!rootElement) throw new Error('No target rootElement found');

const waitElementToAppear = (query: string): Promise<HTMLElement> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelector<HTMLElement>(query);
      if (!element) return;
      clearInterval(interval);
      clearTimeout(timeout);
      resolve(element);
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject(`The element(${query}) did not appeared before the timeout.`);
    }, 2000);
  });
};

describe('AutoComplete widget', () => {
  beforeEach(() => {
    rootElement.innerHTML = '';
    new AutoComplete<TestSearchResult>(
      rootElement,
      'AutoComplete Test',
      function fetchByKeyword(_keyword: string): Promise<TestSearchResult[]> {
        return Promise.resolve([{ value: 'Value1' }, { value: 'Value2' }]);
      },
      function createTemplateForResult(item): string {
        return `<div>${item.value}</div>`;
      },
      function onClickResult(_item: TestSearchResult): void {
        return;
      },
      function getInputValueFromItem(item: TestSearchResult): string {
        return item.value;
      }
    );
  });

  it('Initialization of the widget', () => {
    return;
  });

  it('Dropdown should be collapsed initially', () => {
    const dropdownElement = rootElement.querySelector<HTMLElement>('.dropdown');
    if (!dropdownElement) throw new Error('Can not find a .dropdown element');

    expect([...dropdownElement.classList]).not.to.include('is-active');
  });

  it('Search results should not appear before debounce delay', () => {
    const inputElement = rootElement.querySelector<HTMLInputElement>('input');
    if (!inputElement) throw new Error('Can not find an input element');
    inputElement.value = 'test';
    inputElement.dispatchEvent(new InputEvent('input'));

    const dropdownItemElement =
      rootElement.querySelector<HTMLElement>('.dropdown-item');
    expect(dropdownItemElement).to.be.a('null');
  });

  it('Search results should appear after input events(debounced)', async (): Promise<void> => {
    const inputElement = rootElement.querySelector<HTMLInputElement>('input');
    if (!inputElement) throw new Error('Can not find an input element');

    inputElement.value = 'test';
    inputElement.dispatchEvent(new InputEvent('input'));

    const _dropdownItemElement = await waitElementToAppear('.dropdown-item');
  });

  it('Number of search results should match with fake api call', async (): Promise<void> => {
    const inputElement = rootElement.querySelector<HTMLInputElement>('input');
    if (!inputElement) throw new Error('Can not find an input element');

    inputElement.value = 'test';
    inputElement.dispatchEvent(new InputEvent('input'));

    const _dropdownItemElement = await waitElementToAppear('.dropdown-item');
    const dropdownItemElements = document.querySelectorAll('.dropdown-item');
    expect(dropdownItemElements.length).to.equal(2);
  });
});
