import {useRef, useState} from 'react';
import './search.css';

function Search({view, rokuApps, rokuSearchMode, changeViewParent, searchYoutubeParent, searchRokuModeParent, changeRokuSearchModeParent, changeControlParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const [searchText, setSearchText] = useState('');
  const [modeVisibility, setModeVisibility] = useState(false);
  const inputRef = useRef(null);
  const placeholder = view.selected === 'roku' ? 'Buscar en Youtube' : 'Buscar Canal';

  const searchQuery = () => {
    if (searchText) {
      if (view.selected === 'roku') {
        if (rokuSearchMode) {
          searchRokuModeParent(searchText);
        } else {
          const newView = structuredClone(view);
          newView.roku.apps.youtube.mode = 'search';
          newView.roku.apps.youtube.channel = '';
          newView.roku.apps.selected = 'youtube';
          newView.devices.device = '';
          changeViewParent(newView);
          searchYoutubeParent(searchText);
        }
      }
      if (view.selected === 'cable') {
      }
    }
  };

  const changeRokuSearchMode = (mode) => {
    changeRokuSearchModeParent(mode);
  }

  const onTouchStart = (e) => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 500);
  }
  const onTouchEnd = (e) => {
    e.preventDefault();
    clearTimeout(timeout3s.current);
    if (longClick.current) {
      if (view.roku.apps.selected) {
        setSearchText('');
        setModeVisibility(true);
        if (rokuSearchMode) {
          changeRokuSearchMode(false);
        } else {
          const youtubeSelected = rokuApps.find(app => app.id === 'youtube').selected;
          if (youtubeSelected) {
            const device = 'rokuSala';
            changeControlParent({
              roku: [{device, key: 'keypress', value: 'Up'}],
            });
            changeControlParent({
              roku: [{device, key: 'keypress', value: 'Select'}],
            });
          }
          inputRef.current.focus();
          changeRokuSearchMode(true);
        }
        setTimeout(() => {
          setModeVisibility(false);
        }, 3000);
      }
    } else {
      searchQuery();
    }
    longClick.current = false;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    searchQuery();
    inputRef.current.blur();
  }

  const onChange = (e) => {
    setSearchText(e.target.value);
    if (rokuSearchMode) {
      searchRokuModeParent(e.target.value[e.target.value.length - 1]);
    }
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
            onChange={(e) => onChange(e)}>
          </input>
        </form>
        <div className="controls-search-button-wrapper">
          <button className="controls-search-button"
            onTouchStart={(e) => onTouchStart(e)}
            onTouchEnd={(e) => onTouchEnd(e)}>
            Buscar
          </button>
        </div>
      </div>
      <div className={`controls-search-mode ${modeVisibility ? 'controls-search-mode--visible' : ''}`}>
        <span>{rokuSearchMode ? 'Modo busqueda en Roku activo' : 'Modo busqueda en Roku inactivo'}</span>
      </div>
    </div>
  )
}

export default Search;
