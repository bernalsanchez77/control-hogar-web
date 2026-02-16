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

function Controls() {
  const screensSt = store(v => v.screensSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const hdmiSalaSt = store(v => v.hdmiSalaSt);
  const devicesSt = store(v => v.devicesSt);
  const viewSt = store(v => v.viewSt);

  return (
    <div>
      <div className='controls'>
        {screensSt.length &&
          <Top>
          </Top>
        }
        <Arrows>
        </Arrows>
        {screensSt.length &&
          <Levels>
          </Levels>
        }
        {hdmiSalaSt.length &&
          <Toolbar>
          </Toolbar>
        }
        {viewSt.selected === 'roku' && rokuAppsSt.length && !viewSt.roku.apps.youtube.channel && viewSt.roku.apps.youtube.mode !== 'edit' &&
          <Search>
          </Search>
        }
        {viewSt.selected === 'roku' &&
          <Apps>
          </Apps>
        }
        {viewSt.selected === 'cable' &&
          <Channels>
          </Channels>
        }
        {viewSt.devices.device !== '' && devicesSt.length &&
          <Devices>
          </Devices>
        }
      </div>
    </div>
  )
}

export default Controls;
