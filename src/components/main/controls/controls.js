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

function Controls({devicesState, screenSelected, view, youtubeSearchVideos, youtubeLizVideos, changeControlParent, changeViewParent, changeChannelCategoryParent, changeVibrateParent, searchYoutubeParent}) {
  const searchMode = useRef(false);
  const changeControl = (params) => {
    changeControlParent(params);
  }

  const changeChannelCategory = (category) => {
    changeChannelCategoryParent(category);
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
          changeControlParent={changeControl}
          changeViewParent={changeView}>
        </Top>
        <Arrows
          changeControlParent={changeControl}>
        </Arrows>
        <Levels
          devicesState={devicesState}
          screenSelected={screenSelected}
          view={view}
          changeControlParent={changeControl}
          changeViewParent={changeView}
          changeChannelCategoryParent={changeChannelCategory}
          changeVibrateParent={changeVibrate}>
        </Levels>
        <Toolbar
          devicesState={devicesState}
          changeControlParent={changeControl}>
        </Toolbar>
        {view.state !== 'main' &&
        <Search
          devicesState={devicesState}
          view={view}
          changeViewParent={changeView}
          searchYoutubeParent={searchYoutube}>
        </Search>
        }
        {devicesState.hdmiSala.state === 'roku' &&
        <Apps
          devicesState={devicesState}
          view={view}
          youtubeSearchVideos={youtubeSearchVideos}
          youtubeLizVideos={youtubeLizVideos}
          changeControlParent={changeControl}
          changeViewParent={changeView}>
        </Apps>
        }
        {devicesState.hdmiSala.state === 'cable' &&
        <Channels
          view={view}
          devicesState={devicesState}
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
