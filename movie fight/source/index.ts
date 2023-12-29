import { getMovieById, getMovieByTitle, Movie } from './omdbapi/getMovie';
import { searchMoviesByKeyword, SearchResult } from './omdbapi/searchMovies';
import { AutoComplete } from './AutoComplete';

const leftAutoComplete = document.querySelector(
  '.left-auto-complete'
) as HTMLElement | null;
const rightAutoComplete = document.querySelector(
  '.right-auto-complete'
) as HTMLElement | null;
const leftMovieDetails = document.querySelector(
  '.left-movie-details'
) as HTMLElement | null;
const rightMovieDetails = document.querySelector(
  '.right-movie-details'
) as HTMLElement | null;
const tutorial = document.querySelector('.tutorial') as HTMLElement | null;

if (
  !leftAutoComplete ||
  !rightAutoComplete ||
  !leftMovieDetails ||
  !rightMovieDetails ||
  !tutorial
)
  throw new Error('Error at initializing the app');

const removeTutorial = (): void => {
  tutorial.classList.add('is-hidden');
};

const createTemplateForSearchResult = (searchResult: SearchResult): string => {
  const { posterUrl, title, year } = searchResult;
  return `
    ${posterUrl === 'N/A' ? `` : `<img src="${posterUrl}" alt="${title}" />`}
    <span>${title} ${isNaN(year) ? '' : `(${year})`}</span>
  `;
};

const movieTemplate = (movie: Movie): string => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movie.posterUrl}" alt="${movie.title}" />
        </p>
      </figure>
      <div class="media">
        <div class="media-content">
          <h1>${movie.title} (${movie.year})</h1>
          <h4>${movie.genre}</h4>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movie.awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">$${movie.boxOffice.toLocaleString('en-US')}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movie.metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movie.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movie.imdbVotes.toLocaleString('en-US')}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

const onSelect = async (
  elementToRender: HTMLElement,
  searchResult: SearchResult
): Promise<any> => {
  try {
    const movie = await getMovieById(searchResult.imdbId);
    elementToRender.innerHTML = movieTemplate(movie);
    removeTutorial();
  } catch (err) {}
};

new AutoComplete<SearchResult>(
  leftAutoComplete,
  'Search For a Movie',
  searchMoviesByKeyword,
  createTemplateForSearchResult,
  onSelect.bind(null, leftMovieDetails),
  (item: SearchResult): string => item.title
);
new AutoComplete<SearchResult>(
  rightAutoComplete,
  'Search For a Movie',
  searchMoviesByKeyword,
  createTemplateForSearchResult,
  onSelect.bind(null, rightMovieDetails),
  (item: SearchResult): string => item.title
);
