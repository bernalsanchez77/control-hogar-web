import React from 'react';
import { useYoutube } from './useYoutube';
import Edit from './modules/edit/edit';
import Queue from './modules/queue/queue';
import Search from './modules/search/search';
import Channel from './modules/channel/channel';
import Home from './modules/home/home';
import './youtube.css';

function Youtube() {
  const {
    viewSt,
    videoToSave,
    setVideoToSave
  } = useYoutube();

  return (
    <div className='controls-apps-youtube'>
      {viewSt.roku.apps.youtube.mode === '' &&
        <Home />
      }
      {
        (viewSt.roku.apps.youtube.mode === 'channel') &&
        <Channel setVideoToSave={setVideoToSave} />
      }
      {
        (viewSt.roku.apps.youtube.mode === 'search') &&
        <Search setVideoToSave={setVideoToSave} />
      }
      {
        (viewSt.roku.apps.youtube.mode === 'edit') &&
        <Edit videoToSave={videoToSave} />
      }
      {
        (viewSt.roku.apps.youtube.mode === 'queue') &&
        <Queue />
      }
    </div >
  )
}

export default Youtube;
