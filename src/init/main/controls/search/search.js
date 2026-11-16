import { useSearch } from './useSearch';
import './search.css';

function Search() {
  const {
    rokuSearchModeSt,
    searchText,
    inputRef,
    placeholder,
    onSubmit,
    onChange,
    onKeyDown,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = useSearch();

  return (
    <div className='controls-search'>
      <div className='controls-search-row'>
        <form
          className="controls-search-input-wrapper"
          onSubmit={(e) => onSubmit(e)}>
          <input
            ref={inputRef}
            className={`controls-search-input ${rokuSearchModeSt === 'default' ? 'controls-search-button--no-mode' : ''}`}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => onChange(e)}
            onKeyDown={onKeyDown}>
          </input>
        </form>
        <div className="controls-search-button-wrapper">
          <button className={`controls-search-button ${rokuSearchModeSt === 'default' ? 'controls-search-button--no-mode' : ''}`}
            onTouchStart={(e) => onTouchStart(e)}
            onTouchMove={(e) => onTouchMove(e)}
            onTouchEnd={(e) => onTouchEnd(e)}>
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
