import {useRef} from 'react';

import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import Search from './search/search';
import Toolbar from './toolbar/toolbar';
import Channels from './channels/channels';
import Devices from './devices/devices';
import Apps from './apps/apps';
import './controls.css';

function Controls({devicesState, screenSelected, view, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, cableChannels, cableChannelCategories, changeControlParent, changeViewParent, changeVibrateParent, searchYoutubeParent}) {
  const searchMode = useRef(false);
  const changeControl = (params) => {
    changeControlParent(params);
  }

  const changeVibrate = (length) => {
    changeVibrateParent(length);
  }

  const changeView = (view) => {
    changeViewParent(view);
  }

  const searchYoutube = (text) => {
    searchMode.current = true;
    searchYoutubeParent(text);
  }

  return (
    <div>
      <div className='controls'>
        <Top
          devicesState={devicesState}
          view={view}
          screenSelected={screenSelected}
          changeControlParent={changeControl}>
        </Top>
        <Arrows
          changeControlParent={changeControl}>
        </Arrows>
        <Levels
          devicesState={devicesState}
          screenSelected={screenSelected}
          view={view}
          cableChannels={cableChannels}
          changeControlParent={changeControl}
          changeViewParent={changeView}
          changeVibrateParent={changeVibrate}>
        </Levels>
        <Toolbar
          devicesState={devicesState}
          changeControlParent={changeControl}>
        </Toolbar>
        <Search
          devicesState={devicesState}
          view={view}
          changeViewParent={changeView}
          searchYoutubeParent={searchYoutube}>
        </Search>
        {view.selected === 'roku' &&
        <Apps
          devicesState={devicesState}
          view={view}
          rokuApps={rokuApps}
          youtubeSearchVideos={youtubeSearchVideos}
          youtubeChannelsLiz={youtubeChannelsLiz}
          youtubeVideosLiz={youtubeVideosLiz}
          changeControlParent={changeControl}
          changeViewParent={changeView}>
        </Apps>
        }
        {view.selected === 'cable' &&
        <Channels
          view={view}
          cableChannels={cableChannels}
          cableChannelCategories={cableChannelCategories}
          changeControlParent={changeControl}
          changeViewParent={changeView}>
        </Channels>
        }
        {view.devices.device !== '' &&
        <Devices
          devicesState={devicesState}
          view={view}
          changeControlParent={changeControl}
          changeViewParent={changeView}>
        </Devices>
        }
      </div>
    </div>
  )
}

export default Controls;
