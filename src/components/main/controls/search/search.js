import React, {useRef, useState} from 'react';
import './search.css';

function Search({devicesState, deviceState, youtubeSearchVideos, youtubeLizVideos, triggerControlParent, triggerDeviceStateParent, searchYoutubeParent}) {
  const [youtubeSearchText, setYoutubeSearchText] = useState('');
  const searchYoutube = () => {
    if (youtubeSearchText) {
      triggerDeviceStateParent('youtubeVideos');
      searchYoutubeParent(youtubeSearchText);
    }
  };

  return (
    <div className='controls-search'>
      <div className='controls-search-row'>


   <form
  className="controls-search-input-wrapper"
  onSubmit={(e) => {
    e.preventDefault(); // Prevent page reload
    searchYoutube();    // Trigger the search
  }}
>
  <input
    className="controls-search-input"
    type="search"
    inputMode="search"
    enterKeyHint="search"
    placeholder="Buscar Videos"
    value={youtubeSearchText}
    onChange={(e) => setYoutubeSearchText(e.target.value)}
  />
</form>

<div className="controls-search-button-wrapper">
  <button className="controls-search-button" onClick={searchYoutube}>
    Buscar
  </button>
</div>

      /*
        <div className='controls-search-input-wrapper'>
          <input className='controls-search-input'
            type="text"
            placeholder="Buscar Videos"
            value={youtubeSearchText}
            onKeyDown={(e) => {if (e.key === 'Enter'){setYoutubeSearchText(e.target.value)}}}
            onChange={e => setYoutubeSearchText(e.target.value)}>
          </input>
        </div>
        <div className='controls-search-button-wrapper'>
          <button className='controls-search-button' onClick={searchYoutube}>
            Buscar
          </button>
        </div>
        */
      </div>
    </div>
  )
}

export default Search;
