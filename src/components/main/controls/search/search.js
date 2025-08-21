import {useRef, useState} from 'react';
import './search.css';

function Search({view, rokuApps, rokuSearchMode, changeViewParent, searchYoutubeParent, searchRokuModeParent, changeRokuSearchModeParent, changeControlParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const [searchText, setSearchText] = useState('');
  const [modeVisibility, setModeVisibility] = useState(false);
  const inputRef = useRef(null);
  let placeholder = '';
  const appSelected = rokuApps.find(app => app.state === 'selected');
  if (view.selected === 'roku' && appSelected) {
    if (appSelected.id === 'home') {
      placeholder = 'Buscar en Youtube';
    } else {
      if (rokuSearchMode) {
        placeholder = `Buscar en ${appSelected.label} TV`;
      } else {
        placeholder = `Buscar en ${appSelected.label}`;
      }
    }
  }
  if (view.selected === 'cable') {
    placeholder = 'Buscar Canal';
  }

  const searchQuery = () => {
    if (searchText) {
      if (view.selected === 'roku') {
        if (rokuSearchMode) {
          searchRokuModeParent('Enter');
        } else {
          if (view.roku.apps.selected === 'youtube' && view.roku.apps.youtube.mode === '') {
            const newView = structuredClone(view);
            newView.roku.apps.youtube.mode = 'search';
            newView.roku.apps.youtube.channel = '';
            newView.roku.apps.selected = 'youtube';
            newView.devices.device = '';
            changeViewParent(newView);
            searchYoutubeParent(searchText);
          }
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
      const home = rokuApps.find(app => app.id === 'home').state;
      if (!home) {
        setSearchText('');
        if (rokuSearchMode) {
          setModeVisibility(false);
          changeRokuSearchMode(false);
        } else {
          setModeVisibility(true);
          const youtubeSelected = rokuApps.find(app => app.id === 'youtube').state;
          if (youtubeSelected) {
            const device = 'rokuSala';
            // changeControlParent({
            //   roku: [{device, key: 'keypress', value: 'Up'}],
            // });
          }
          inputRef.current.focus();
          changeRokuSearchMode(true);
        }
        // setTimeout(() => {
        //   setModeVisibility(false);
        // }, 3000);
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

  const onKeyDown = (e) => {
    if (rokuSearchMode) {
      if (e.key === "Backspace") {
        searchRokuModeParent("Backspace");
      } else if (e.key === "Enter") {
        searchRokuModeParent("Enter");
      } else if (e.key === " ") {
        searchRokuModeParent("Lit_%20");
      } else if (e.key.length === 1) {
        searchRokuModeParent(`Lit_${encodeURIComponent(e.key)}`);
      }
    }
  }

  const onChange = (e) => {
    const newValue = e.target.value;
    const oldValue = searchText;
    if (rokuSearchMode) {
      if (newValue.length > oldValue.length) {
        // Characters were added
        const addedText = newValue.slice(oldValue.length);
        for (const char of addedText) {
          if (char === ' ') {
            // searchRokuModeParent('Lit_%20');
          } else {
            // searchRokuModeParent(`Lit_${encodeURIComponent(char)}`);
          }
        }
      } else if (newValue.length < oldValue.length) {
        // Characters were deleted
        const numDeleted = oldValue.length - newValue.length;
        for (let i = 0; i < numDeleted; i++) {
          // searchRokuModeParent('Backspace');
        }
      }
    }
    setSearchText(e.target.value);
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
            onChange={(e) => onChange(e)}
            onKeyDown={onKeyDown}>
          </input>
        </form>
        <div className="controls-search-button-wrapper">
          <button className={`controls-search-button ${rokuSearchMode ? 'controls-search-button--search-mode' : ''}`}
            onTouchStart={(e) => onTouchStart(e)}
            onTouchEnd={(e) => onTouchEnd(e)}>
            Buscar
          </button>
        </div>
      </div>
      {/* <div className={`controls-search-mode ${modeVisibility ? 'controls-search-mode--visible' : ''}`}>
        <span>{rokuSearchMode ? 'Modo busqueda en Roku activo' : ''}</span>
      </div> */}
    </div>
  )
}

export default Search;
