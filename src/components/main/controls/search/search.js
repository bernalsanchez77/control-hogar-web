import { useRef, useState, useEffect } from 'react';
import { store } from "../../../../store/store";
import ViewRouter from '../../../../global/view-router';
import './search.css';
const viewRouter = new ViewRouter();

function Search({ searchYoutubeParent, searchRokuModeParent }) {
  const rokuSearchModeSt = store(v => v.rokuSearchModeSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const viewSt = store(v => v.viewSt);
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const [searchText, setSearchText] = useState('');
  const [modeVisibility] = useState(false);
  const inputRef = useRef(null);
  let placeholder = '';

  if (viewSt.selected === 'roku') {
    //if (rokuAppsSt.find(app => app.state === 'selected')?.id === 'home') {
    //placeholder = 'Buscar en Roku';
    //} else {
    placeholder = 'Buscar en ' + rokuAppsSt.find(app => app.state === 'selected')?.label;
    //}
    if (viewSt.roku.apps.selected === 'youtube') {
      if (viewSt.roku.apps.youtube.mode) {
        if (viewSt.roku.apps.youtube.mode === 'channel') {
          placeholder = 'Buscar en Youtube';
        }
        if (viewSt.roku.apps.youtube.mode === 'search') {
          placeholder = 'Buscar en el telefono';
        }
      } else {
        placeholder = 'Buscar en el telefono';
      }
    }
  };

  if (viewSt.selected === 'cable') {
    placeholder = 'Buscar Canal';
  };

  const searchQuery = async () => {
    if (searchText) {
      if (viewSt.selected === 'roku') {
        if (rokuSearchModeSt === 'roku') {
          // searchRokuModeParent('Enter');
        }
        if (rokuSearchModeSt === 'app') {
          if (viewSt.roku.apps.selected === 'youtube' && (viewSt.roku.apps.youtube.mode === '' || viewSt.roku.apps.youtube.mode === 'search')) {
            const newView = structuredClone(viewSt);
            newView.roku.apps.youtube.mode = 'search';
            newView.roku.apps.youtube.channel = '';
            newView.roku.apps.selected = 'youtube';
            newView.devices.device = '';
            await viewRouter.changeView(newView);
            searchYoutubeParent(searchText);
          }
        }
      }
      if (viewSt.selected === 'cable') {
      }
      const active = document.activeElement;
      if (active && active.blur) {
        active.blur();
      }
    }
  };

  const onTouchStart = (e) => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 500);
  };

  const onTouchEnd = (e) => {
    e.preventDefault();
    clearTimeout(timeout3s.current);
    if (longClick.current) {
      // const home = rokuAppsSt.find(app => app.id === 'home').state;
      // if (!home) {
      //   setSearchText('');
      //   if (rokuSearchModeSt === 'roku') {
      //     inputRef.current.focus();
      //     setModeVisibility(true);
      //     utils.triggerVibrate();
      //     setRokuSearchModeSt('app');
      //   }
      //   if (rokuSearchModeSt === 'app') {
      //     setModeVisibility(true);
      //     const youtubeSelected = rokuAppsSt.find(app => app.id === 'youtube').state;
      //     if (youtubeSelected) {
      //       const device = 'rokuSala';
      //       // changeControlParent({
      //       //   roku: [{device, key: 'keypress', value: 'Up'}],
      //       // });
      //     }
      //     utils.triggerVibrate();
      //     setRokuSearchModeSt('app');
      //   }
      //   setTimeout(() => {
      //     setModeVisibility(false);
      //   }, 3000);
      // }
    } else {
      searchQuery();
    }
    longClick.current = false;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    searchQuery();
    inputRef.current.blur();
  };

  const onKeyDown = (e) => {
    if (rokuSearchModeSt === 'roku') {
      if (e.key === "Backspace") {
        searchRokuModeParent("Backspace");
      } else if (e.key === "Enter") {
        // searchRokuModeParent("Enter"); disabled cause creates problems en youtube and is not needed in other apps
      }
    }
  };

  const onChange = (e) => {
    const newValue = e.target.value;
    const oldValue = searchText;
    if (rokuSearchModeSt === 'roku') {
      if (newValue.length > oldValue.length) {
        // Characters were added
        const addedText = newValue.slice(oldValue.length);
        for (const char of addedText) {
          if (char === ' ') {
            searchRokuModeParent('Lit_%20');
          } else {
            searchRokuModeParent(`Lit_${encodeURIComponent(char)}`);
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
  };

  useEffect(() => {
    setSearchText('');
  }, [rokuSearchModeSt]);


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
            onTouchEnd={(e) => onTouchEnd(e)}>
            Buscar
          </button>
        </div>
      </div>
      <div className={`controls-search-mode ${modeVisibility ? 'controls-search-mode--visible' : ''}`}>
        <span>{rokuSearchModeSt === 'roku' ? 'Modo busqueda en Roku activo' : 'Modo busqueda en Roku inactivo'}</span>
      </div>
    </div>
  );
}

export default Search;
