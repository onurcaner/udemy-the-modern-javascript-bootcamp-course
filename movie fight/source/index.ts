import { getMovieById, getMovieByTitle, Movie } from './omdbapi/getMovie';
import { searchMoviesByKeyword, SearchResult } from './omdbapi/searchMovies';
import { debounce } from './utils';

const onInputHandler = async (e: Event): Promise<SearchResult[]> => {
  console.log(e);
  if (!(e.target instanceof HTMLInputElement))
    throw new Error('Event target is not a HTMLInputElement');

  const keyword = e.target.value.trim();
  if (!keyword.length) return [];

  const searchResults = await searchMoviesByKeyword(keyword);
  console.log(searchResults);
  return searchResults;
};

const autoComplete = document.querySelector('.autocomplete');
if (!autoComplete) throw new Error();
autoComplete.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown is-active">
    <div class="dropdown-menu">
        <div class="dropdown-content results">
            <a href="#" class="dropdown-item"> Dropdown item </a>
            <a href="#" class="dropdown-item"> Dropdown item </a>
            <a href="#" class="dropdown-item"> Dropdown item </a>
            <a href="#" class="dropdown-item"> Dropdown item </a>
            <a href="#" class="dropdown-item"> Dropdown item </a>
        </div>
    </div>
  </div>
`;
