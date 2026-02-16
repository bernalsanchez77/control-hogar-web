import { useRef, useState, useEffect } from 'react';
import { store } from "../../../../store/store";
import requests from '../../../../global/requests';
import viewRouter from '../../../../global/view-router';
import utils from '../../../../global/utils';
import { useTouch } from '../../../../hooks/useTouch';
import './search.css';

function Search() {
  const rokuSearchModeSt = store(v => v.rokuSearchModeSt);
  const viewSt = store(v => v.viewSt);
  const setYoutubeSearchVideosSt = store(v => v.setYoutubeSearchVideosSt);
  const [searchText, setSearchText] = useState('');
  const [modeVisibility] = useState(false);
  const selectionsSt = store(v => v.selectionsSt);
  const rokuAppsSelectedRokuId = selectionsSt.find(el => el.table === 'rokuApps')?.id;
  const rokuAppsSelectedLabel = store(v => v.rokuAppsSt.find(el => el.rokuId === rokuAppsSelectedRokuId)?.label);
  const inputRef = useRef(null);
  let placeholder = '';

  if (viewSt.selected === 'roku') {
    placeholder = rokuAppsSelectedLabel ? 'Buscar en ' + rokuAppsSelectedLabel : 'Buscar en Roku';
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
            const videos = await requests.searchYoutube(searchText);
            if (videos) {
              setYoutubeSearchVideosSt(videos);
            }
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

  const handleShortPress = () => {
    searchQuery();
  };

  const handleLongPress = () => {
  };

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(handleShortPress, handleLongPress);

  const onSubmit = (e) => {
    utils.triggerVibrate();
    e.preventDefault();
    searchQuery();
    inputRef.current.blur();
  };

  const onKeyDown = (e) => {
    if (rokuSearchModeSt === 'roku') {
      if (e.key === "Backspace") {
        requests.fetchRoku({ key: 'keypress', value: 'Backspace' });

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
            requests.fetchRoku({ key: 'keypress', value: 'Lit_%20' });
          } else {
            requests.fetchRoku({ key: 'keypress', value: `Lit_${encodeURIComponent(char)}` });
          }
        }
      } else if (newValue.length < oldValue.length) {
        // Characters were deleted
        const numDeleted = oldValue.length - newValue.length;
        for (let i = 0; i < numDeleted; i++) {
          requests.fetchRoku({ key: 'keypress', value: 'Backspace' });
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
            onTouchMove={(e) => onTouchMove(e)}
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
