import React, {useRef, useState} from 'react';
import './search.css';

function Search({devicesState, deviceState, youtubeSearchVideos, youtubeLizVideos, triggerControlParent, triggerDeviceStateParent, searchYoutubeParent}) {
  const [youtubeSearchText, setYoutubeSearchText] = useState('');
  const searchYoutube = () => {
    triggerDeviceStateParent('youtubeVideos');
    searchYoutubeParent(youtubeSearchText);
  };

  return (
    <div className='controls-search'>
      <div className='controls-search-row'>
        <div className='controls-search-input-wrapper'>
          <input className='controls-search-input'
            type="text"
            placeholder="Buscar Videos"
            value={youtubeSearchText}
            onChange={e => setYoutubeSearchText(e.target.value)}>
          </input>
        </div>
        <div className='controls-search-button-wrapper'>
          <button className='controls-search-button' onClick={searchYoutube}>
            Buscar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Search;
