import { get, ApiParameter } from './utils';
import { BASE_URL } from './constants';
import { API_KEY } from './api-key';

export interface SearchResult {
  id: string;
  title: string;
  posterUrl: string;
}

const deserializeSearchResult = (result: {
  [key: string]: any;
}): SearchResult => {
  return {
    id: result.imdbID,
    title: result.Title,
    posterUrl: result.Poster,
  };
};

export const deserializeSearchResults = (apiData: {
  [key: string]: any;
}): SearchResult[] => {
  if (!+apiData.totalResults) return [];
  return apiData.Search.map(deserializeSearchResult);
};

export const searchMoviesByKeyword = async (
  keyword: string
): Promise<SearchResult[]> => {
  try {
    const parameters: [ApiParameter, string][] = [
      ['apikey', API_KEY],
      ['s', keyword],
    ];
    return get(BASE_URL, parameters, deserializeSearchResults);
  } catch (err) {
    throw err;
  }
};
