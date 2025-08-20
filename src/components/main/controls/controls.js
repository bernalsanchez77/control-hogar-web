import {useState} from 'react';

import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import Search from './search/search';
import Toolbar from './toolbar/toolbar';
import Channels from './channels/channels';
import Devices from './devices/devices';
import Apps from './apps/apps';
import './controls.css';

function Controls({screens, devices, screenSelected, view, hdmiSala, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, cableChannels, cableChannelCategories, changeControlParent, changeViewParent, changeVibrateParent, searchYoutubeParent, searchRokuModeParent}) {
  const [rokuSearchMode, setRokuSearchMode] = useState(false);
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
    searchYoutubeParent(text);
  }

  const changeRokuSearchMode = (mode) => {
    setRokuSearchMode(mode);
  }

  return (
    <div>
      <div className='controls'>
        {screens.length &&
        <Top
          screens={screens}
          view={view}
          screenSelected={screenSelected}
          changeControlParent={changeControl}>
        </Top>
        }
        <Arrows
          changeControlParent={changeControl}>
        </Arrows>
        {screens.length &&
        <Levels
          screenSelected={screenSelected}
          view={view}
          screens={screens}
          cableChannels={cableChannels}
          changeControlParent={changeControl}
          changeViewParent={changeView}
          changeVibrateParent={changeVibrate}>
        </Levels>
        }
        {hdmiSala.length &&
        <Toolbar
          hdmiSala={hdmiSala}
          changeControlParent={changeControl}>
        </Toolbar>
        }
        <Search
          view={view}
          rokuSearchMode={rokuSearchMode}
          changeViewParent={changeView}
          searchYoutubeParent={searchYoutube}
          searchRokuModeParent={searchRokuModeParent}
          changeRokuSearchModeParent={changeRokuSearchMode}>
        </Search>
        {view.selected === 'roku' &&
        <Apps
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
        {view.devices.device !== '' && devices.length &&
        <Devices
          view={view}
          devices={devices}
          changeControlParent={changeControl}
          changeViewParent={changeView}>
        </Devices>
        }
      </div>
    </div>
  )
}

export default Controls;
