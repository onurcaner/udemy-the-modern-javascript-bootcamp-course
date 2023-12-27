import { get, ApiParameter } from './utils';
import { BASE_URL } from './constants';
import { API_KEY } from './api-key';

export interface Movie {
  id: string;
  title: string;
  plot: string;
  posterUrl: string;
  boxOffice: number;
  rating: number;
}

export const deserializeMovie = (apiData: { [key: string]: any }): Movie => {
  return {
    id: apiData.imdbID,
    title: apiData.Title,
    plot: apiData.Plot,
    posterUrl: apiData.Poster,
    boxOffice: +(apiData.BoxOffice as string).slice(1).replaceAll(',', ''),
    rating: +apiData.imdbRating,
  };
};

export const getMovieById = async (movieId: string): Promise<Movie> => {
  try {
    const parameters: [ApiParameter, string][] = [
      ['apikey', API_KEY],
      ['i', movieId],
    ];
    return get(BASE_URL, parameters, deserializeMovie);
  } catch (err) {
    throw err;
  }
};

export const getMovieByTitle = async (movieTitle: string): Promise<Movie> => {
  try {
    const parameters: [ApiParameter, string][] = [
      ['apikey', API_KEY],
      ['t', movieTitle],
    ];
    return get(BASE_URL, parameters, deserializeMovie);
  } catch (err) {
    throw err;
  }
};
