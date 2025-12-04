import { store } from '../../../store/store';
import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import Search from './search/search';
import Toolbar from './toolbar/toolbar';
import Channels from './channels/channels';
import Devices from './devices/devices';
import Apps from './apps/apps';
import './controls.css';

function Controls({ cableChannelCategories, changeControlParent, searchYoutubeParent, searchRokuModeParent, handleYoutubeQueueParent, removeSelectedVideoParent }) {
  const screensSt = store(v => v.screensSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const hdmiSalaSt = store(v => v.hdmiSalaSt);
  const devicesSt = store(v => v.devicesSt);
  const viewSt = store(v => v.viewSt);
  const changeControl = (params) => {
    changeControlParent(params);
  };

  const searchYoutube = (text) => {
    searchYoutubeParent(text);
  };

  const handleYoutubeQueue = (params) => {
    handleYoutubeQueueParent(params);
  };

  const removeSelectedVideo = () => {
    removeSelectedVideoParent();
  };

  return (
    <div>
      <div className='controls'>
        {screensSt.length &&
          <Top
            changeControlParent={changeControl}>
          </Top>
        }
        <Arrows
          changeControlParent={changeControl}>
        </Arrows>
        {screensSt.length &&
          <Levels
            changeControlParent={changeControl}>
          </Levels>
        }
        {hdmiSalaSt.length &&
          <Toolbar
            changeControlParent={changeControl}>
          </Toolbar>
        }
        {viewSt.selected === 'roku' && rokuAppsSt.length && !viewSt.roku.apps.youtube.channel &&
          <Search
            searchYoutubeParent={searchYoutube}
            searchRokuModeParent={searchRokuModeParent}>
          </Search>
        }
        {viewSt.selected === 'roku' &&
          <Apps
            handleYoutubeQueueParent={handleYoutubeQueue}
            changeControlParent={changeControl}
            removeSelectedVideoParent={removeSelectedVideo}>
          </Apps>
        }
        {viewSt.selected === 'cable' &&
          <Channels
            cableChannelCategories={cableChannelCategories}
            changeControlParent={changeControl}>
          </Channels>
        }
        {viewSt.devices.device !== '' && devicesSt.length &&
          <Devices
            changeControlParent={changeControl}>
          </Devices>
        }
      </div>
    </div>
  )
}

export default Controls;
