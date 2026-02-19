import React from 'react';
import { useControls } from './useControls';
import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import Search from './search/search';
import Toolbar from './toolbar/toolbar';
import Channels from './channels/channels';
import Devices from './devices/devices';
import Apps from './apps/apps';
import './controls.css';

function Controls() {
  const {
    screensSt,
    rokuAppsSt,
    hdmiSalaSt,
    devicesSt,
    viewSt
  } = useControls();

  return (
    <div>
      <div className='controls'>
        {screensSt.length > 0 &&
          <Top />
        }
        <Arrows />
        {screensSt.length > 0 &&
          <Levels />
        }
        {hdmiSalaSt.length > 0 &&
          <Toolbar />
        }
        {viewSt.selected === 'roku' && rokuAppsSt.length > 0 && !viewSt.roku.apps.youtube.channel && viewSt.roku.apps.youtube.mode !== 'edit' &&
          <Search />
        }
        {viewSt.selected === 'roku' &&
          <Apps />
        }
        {viewSt.selected === 'cable' &&
          <Channels />
        }
        {viewSt.devices.device !== '' && devicesSt.length > 0 &&
          <Devices />
        }
      </div>
    </div>
  )
}

export default Controls;
