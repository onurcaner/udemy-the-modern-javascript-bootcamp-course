export type ApiParameter = 'apikey' | 'i' | 't' | 's';

export const get = async function <T>(
  baseUrl: string,
  parameters: [ApiParameter, string][],
  deserializer: (apiData: { [key: string]: any }) => T
): Promise<T> {
  try {
    const url =
      baseUrl +
      '/?' +
      parameters.map(([name, value]) => `${name}=${value}`).join('&');
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response is NOT OK: ${response.status}`);

    const apiData = await response.json();
    if (apiData.Response !== 'True')
      throw new Error(`API Data is NOT OK: ${apiData.Response}`);

    return deserializer(apiData);
  } catch (err) {
    throw err;
  }
};
