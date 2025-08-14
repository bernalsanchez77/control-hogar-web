import {useRef, useState} from 'react';
import './search.css';

function Search({view, changeViewParent, searchYoutubeParent}) {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);
  const placeholder = view.selected === 'roku' ? 'Buscar en Youtube' : 'Buscar Canal';

  const searchQuery = () => {
    if (searchText) {
      if (view.selected === 'roku') {
        const newView = structuredClone(view);
        newView.roku.apps.youtube.mode = 'search';
        newView.roku.apps.youtube.channel = '';
        newView.roku.apps.selected = 'youtube';
        newView.devices.device = '';
        changeViewParent(newView);
        searchYoutubeParent(searchText);
      }
      if (view.selected === 'cable') {

      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    searchQuery();
    inputRef.current.blur();
  }

  return (
    <div className='controls-search'>
      <div className='controls-search-row'>
        <form
          className="controls-search-input-wrapper"
          onSubmit={(e) => onSubmit(e)}>
          <input
            ref={inputRef}
            className="controls-search-input"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}>
          </input>
        </form>
        <div className="controls-search-button-wrapper">
          <button className="controls-search-button" onClick={searchQuery}>
            Buscar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Search;
