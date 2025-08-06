import {useRef, useState} from 'react';
import './search.css';

function Search({devicesState, view, changeViewParent, searchYoutubeParent}) {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);
  const placeholder = devicesState.hdmiSala.state === 'roku' ? 'Buscar en Youtube' : 'Buscar Canal';

  const searchQuery = () => {
    if (searchText) {
      if (devicesState.hdmiSala.state === 'roku') {
        const newView = {...view};
        newView.apps.youtube.mode = 'search';
        newView.apps.youtube.channel = '';
        newView.apps.selected = 'youtube';
        changeViewParent(newView);
        searchYoutubeParent(searchText);
      }
      if (devicesState.hdmiSala.state === 'cable') {

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
