import { get, ApiParameter } from './omdb-utils';
import { BASE_URL } from './constants';
import { API_KEY } from './api-key';

export interface SearchResult {
  imdbId: string;
  title: string;
  year: number;
  posterUrl: string;
}

interface ApiSearchResult extends Record<string, unknown> {
  totalResults: string;
  Search: Record<string, unknown>[];
}

const deserializeSearchResult = (
  result: Record<string, unknown>
): SearchResult => {
  return {
    imdbId: result.imdbID as string,
    title: result.Title as string,
    year: +(result.Year as string),
    posterUrl: result.Poster as string,
  };
};

export const deserializeSearchResults = (
  apiData: Record<string, unknown>
): SearchResult[] => {
  const apiSearchResult = apiData as ApiSearchResult;
  if (!+apiSearchResult.totalResults) return [];
  return apiSearchResult.Search.map(deserializeSearchResult);
};

export const searchMoviesByKeyword = async (
  keyword: string
): Promise<SearchResult[]> => {
  const parameters: [ApiParameter, string][] = [
    [ApiParameter.apiKey, API_KEY],
    [ApiParameter.search, keyword],
  ];
  return get(BASE_URL, parameters, deserializeSearchResults);
};
