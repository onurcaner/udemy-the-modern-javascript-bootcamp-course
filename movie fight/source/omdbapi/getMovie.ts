import { get, ApiParameter } from './omdb-utils';
import { BASE_URL } from './constants';
import { API_KEY } from './api-key';

export interface Movie {
  imdbId: string;
  title: string;
  year: number;
  plot: string;
  posterUrl: string;
  boxOffice: number;
  rating: number;
  genre: string;
  awards: string;
  metascore: number;
  imdbRating: number;
  imdbVotes: number;
}

export const deserializeMovie = (apiData: { [key: string]: any }): Movie => {
  return {
    imdbId: apiData.imdbID,
    title: apiData.Title,
    year: +apiData.Year,
    plot: apiData.Plot,
    posterUrl: apiData.Poster,
    boxOffice: +(apiData.BoxOffice as string).slice(1).replaceAll(',', ''),
    rating: +apiData.imdbRating,
    genre: apiData.Genre,
    awards: apiData.Awards,
    metascore: +apiData.Metascore,
    imdbRating: +apiData.imdbRating,
    imdbVotes: +(apiData.imdbVotes as string).replaceAll(',', ''),
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
