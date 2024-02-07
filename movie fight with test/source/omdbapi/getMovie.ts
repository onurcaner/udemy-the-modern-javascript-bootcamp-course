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
  genre: string;
  awards: string;
  metascore: number;
  imdbRating: number;
  imdbVotes: number;
}

export const deserializeMovie = (apiData: Record<string, unknown>): Movie => {
  return {
    imdbId: apiData.imdbID as string,
    title: apiData.Title as string,
    year: +(apiData.Year as string),
    plot: apiData.Plot as string,
    posterUrl: apiData.Poster as string,
    boxOffice: +(apiData.BoxOffice as string).slice(1).replaceAll(',', ''),
    genre: apiData.Genre as string,
    awards: apiData.Awards as string,
    metascore: +(apiData.Metascore as string),
    imdbRating: +(apiData.imdbRating as string),
    imdbVotes: +(apiData.imdbVotes as string).replaceAll(',', ''),
  };
};

export const getMovieById = async (movieId: string): Promise<Movie> => {
  const parameters: [ApiParameter, string][] = [
    [ApiParameter.apiKey, API_KEY],
    [ApiParameter.id, movieId],
  ];
  return get(BASE_URL, parameters, deserializeMovie);
};

export const getMovieByTitle = async (movieTitle: string): Promise<Movie> => {
  const parameters: [ApiParameter, string][] = [
    [ApiParameter.apiKey, API_KEY],
    [ApiParameter.title, movieTitle],
  ];
  return get(BASE_URL, parameters, deserializeMovie);
};
