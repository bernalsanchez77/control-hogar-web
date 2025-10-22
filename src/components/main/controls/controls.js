import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import Search from './search/search';
import Toolbar from './toolbar/toolbar';
import Channels from './channels/channels';
import Devices from './devices/devices';
import Apps from './apps/apps';
import './controls.css';

function Controls({rokuPlayStatePosition, rokuPlayState, screens, devices, rokuSearchMode, changeRokuSearchModeParent, screenSelected, view, hdmiSala, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, cableChannels, cableChannelCategories, changeControlParent, changeViewParent, triggerVibrateParent, searchYoutubeParent, searchRokuModeParent, addToYoutubeQueueParent}) {
  const changeControl = (params) => {
    changeControlParent(params);
  }

  const triggerVibrate = (length) => {
    triggerVibrateParent(length);
  }

  const changeView = (view) => {
    changeViewParent(view);
  }

  const searchYoutube = (text) => {
    searchYoutubeParent(text);
  }

  const addToYoutubeQueue = (videoId, number) => {
    addToYoutubeQueueParent(videoId, number);
  }

  const changeRokuSearchMode = (mode) => {
    changeRokuSearchModeParent(mode);
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
          triggerVibrateParent={triggerVibrate}>
        </Levels>
        }
        {hdmiSala.length &&
        <Toolbar
          hdmiSala={hdmiSala}
          changeControlParent={changeControl}>
        </Toolbar>
        }
        {view.selected === 'roku' && rokuApps.length && !view.roku.apps.youtube.channel &&
        <Search
          view={view}
          rokuSearchMode={rokuSearchMode}
          rokuApps={rokuApps}
          changeViewParent={changeView}
          searchYoutubeParent={searchYoutube}
          searchRokuModeParent={searchRokuModeParent}
          changeRokuSearchModeParent={changeRokuSearchMode}>
        </Search>
        }
        {view.selected === 'roku' &&
        <Apps
          rokuPlayState={rokuPlayState}
          view={view}
          rokuApps={rokuApps}
          rokuSearchMode={rokuSearchMode}
          youtubeSearchVideos={youtubeSearchVideos}
          youtubeChannelsLiz={youtubeChannelsLiz}
          rokuPlayStatePosition={rokuPlayStatePosition}
          youtubeVideosLiz={youtubeVideosLiz}
          addToYoutubeQueueParent={addToYoutubeQueue}
          changeControlParent={changeControl}
          changeRokuSearchModeParent={changeRokuSearchMode}
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
