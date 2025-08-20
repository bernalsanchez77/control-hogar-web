import {useRef, useState} from 'react';
import './search.css';

function Search({view, changeViewParent, searchYoutubeParent, searchRokuModeParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);
  const rokuSearchMode = useRef(false);
  const placeholder = view.selected === 'roku' ? 'Buscar en Youtube' : 'Buscar Canal';

  const searchQuery = () => {
    if (searchText) {
      if (view.selected === 'roku') {
        if (rokuSearchMode.current) {
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

  const onTouchStart = (e) => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 500);
  }
  const onTouchEnd = (e) => {
    e.preventDefault();
    clearTimeout(timeout3s.current);
    if (longClick.current) {
      setSearchText('');
      if (rokuSearchMode.current) {
        rokuSearchMode.current = false;
        console.log('roku search inactive');
        alert('Modo busqueda en Roku desactivado');
      } else {
        inputRef.current.focus();
        rokuSearchMode.current = true;
        console.log('roku search active');
        alert('Modo busqueda en Roku activado');
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
    if (rokuSearchMode.current) {
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
    </div>
  )
}

export default Search;
