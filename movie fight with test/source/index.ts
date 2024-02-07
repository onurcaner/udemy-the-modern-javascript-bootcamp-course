import { getMovieById, Movie } from './omdbapi/getMovie';
import { searchMoviesByKeyword, SearchResult } from './omdbapi/searchMovies';
import { AutoComplete } from './AutoComplete';

//
//
//
/* App Elements */
const leftAutoComplete = document.querySelector<HTMLElement>(
  '.left-auto-complete'
);
const rightAutoComplete = document.querySelector<HTMLElement>(
  '.right-auto-complete'
);
const leftMovieDetails = document.querySelector<HTMLElement>(
  '.left-movie-details'
);
const rightMovieDetails = document.querySelector<HTMLElement>(
  '.right-movie-details'
);
const tutorial = document.querySelector<HTMLElement>('.tutorial');

if (
  !leftAutoComplete ||
  !rightAutoComplete ||
  !leftMovieDetails ||
  !rightMovieDetails ||
  !tutorial
)
  throw new Error('Error at selecting app elements');

//
//
//
/* App Data */
enum SelectedMovieReferenceKey {
  left = 'left',
  right = 'right',
}

interface SelectedMovie {
  left?: Movie;
  right?: Movie;
}

const selectedMovie: SelectedMovie = {};

//
//
//
/* App Functions */
const removeTutorial = (): void => {
  tutorial.classList.add('is-hidden');
};

const getTitleFromSearchResult = (item: SearchResult): string => item.title;

const createImgTemplate = (title: string, posterUrl: string): string => {
  return posterUrl === 'N/A' ? `` : `<img src="${posterUrl}" alt="${title}" />`;
};

const createTitleInnerTemplate = (title: string, year: number): string => {
  return `${title} ${isNaN(year) ? '' : `(${year})`}`;
};

const createTemplateForSearchResult = (searchResult: SearchResult): string => {
  const { posterUrl, title, year } = searchResult;
  return `
    ${createImgTemplate(title, posterUrl)}
    <span>${createTitleInnerTemplate(title, year)}</span>
  `;
};

const createTemplateForMovie = (movie: Movie): string => {
  const createTemplateForValuedArticle = (
    showName: string,
    showValue: number | string,
    dataValue: number
  ): string => {
    return `
      <article class="notification is-primary" data-value="${dataValue}">
        <p class="title">${showValue}</p>
        <p class="subtitle">${showName}</p>
      </article>
    `;
  };
  const {
    awards,
    boxOffice,
    genre,
    imdbRating,
    imdbVotes,
    metascore,
    plot,
    posterUrl,
    title,
    year,
  } = movie;
  return `
    <article class="notification media">
      <figure class="media-left">
        <p class="image">
          ${createImgTemplate(title, posterUrl)}
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h2>${createTitleInnerTemplate(title, year)}</h1>
          <h4>${genre}</h4>
          <p>${plot}</p>
        </div>
      </div>
    </article>
    ${createTemplateForValuedArticle(
      'Awards',
      awards,
      [...awards.matchAll(/[0-9]+/g)].reduce(
        (sum, current) => sum + +current,
        0
      )
    )}
    ${createTemplateForValuedArticle(
      'Box Office',
      `$${boxOffice.toLocaleString('en-US')}`,
      boxOffice
    )}
    ${createTemplateForValuedArticle('Metascore', metascore, metascore)}
    ${createTemplateForValuedArticle('IMDB Rating', imdbRating, imdbRating)}
    ${createTemplateForValuedArticle(
      'IMDB Votes',
      imdbVotes.toLocaleString('en-US'),
      imdbVotes
    )}
  `;
};

const onSelectSearchResult = async (
  elementToRender: HTMLElement,
  selectedMovieReferenceKey: keyof SelectedMovie,
  searchResult: SearchResult
): Promise<void> => {
  const movie = await getMovieById(searchResult.imdbId);
  selectedMovie[selectedMovieReferenceKey] = movie;
  elementToRender.innerHTML = createTemplateForMovie(movie);
  removeTutorial();
  if (selectedMovie.left && selectedMovie.right) compareMovies();
};

const compareMovies = (): void => {
  const leftMovieValueElements = [
    ...leftMovieDetails.querySelectorAll<HTMLElement>('*[data-value]'),
  ];
  const rightMovieValueElements = [
    ...rightMovieDetails.querySelectorAll<HTMLElement>('*[data-value]'),
  ];
  for (let i = 0; i < leftMovieValueElements.length; i++) {
    const leftValue = Number(leftMovieValueElements[i].dataset.value);
    const rightValue = Number(rightMovieValueElements[i].dataset.value);
    rightMovieValueElements[i].classList.remove('is-primary', 'is-warning');
    leftMovieValueElements[i].classList.remove('is-primary', 'is-warning');
    if (rightValue > leftValue) {
      rightMovieValueElements[i].classList.add('is-primary');
      leftMovieValueElements[i].classList.add('is-warning');
    }
    if (leftValue > rightValue) {
      leftMovieValueElements[i].classList.add('is-primary');
      rightMovieValueElements[i].classList.add('is-warning');
    }
    if (leftValue === rightValue) {
      leftMovieValueElements[i].classList.add('is-primary');
      rightMovieValueElements[i].classList.add('is-primary');
    }
  }
};

//
//
//
/* Initialization of AutoComplete */
new AutoComplete<SearchResult>(
  leftAutoComplete,
  'Search For a Movie',
  searchMoviesByKeyword,
  createTemplateForSearchResult,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onSelectSearchResult.bind(
    null,
    leftMovieDetails,
    SelectedMovieReferenceKey.left
  ),
  getTitleFromSearchResult
);
new AutoComplete<SearchResult>(
  rightAutoComplete,
  'Search For a Movie',
  searchMoviesByKeyword,
  createTemplateForSearchResult,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onSelectSearchResult.bind(
    null,
    rightMovieDetails,
    SelectedMovieReferenceKey.right
  ),
  getTitleFromSearchResult
);
