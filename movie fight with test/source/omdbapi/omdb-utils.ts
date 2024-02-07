/* export type ApiParameter = 'apikey' | 'i' | 't' | 's'; */
export enum ApiParameter {
  apiKey = 'apikey',
  id = 'i',
  title = 't',
  search = 's',
}

export const get = async <T>(
  baseUrl: string,
  parameters: [ApiParameter, string][],
  deserializer: (apiData: Record<string, unknown>) => T
): Promise<T> => {
  const url =
    baseUrl +
    '/?' +
    parameters.map(([name, value]) => `${name}=${value}`).join('&');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Response is NOT OK: ${response.status}`);

  const apiData = (await response.json()) as Record<string, unknown>;
  if (apiData.Response !== 'True') throw new Error(apiData.Error as string);

  return deserializer(apiData);
};
