import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import Toolbar from './toolbar/toolbar';
import Channels from './channels/channels';
import ChannelCategory from './channelCategory/channelCategory';
import Devices from './devices/devices';
import Apps from './apps/apps';
import './controls.css';

function Controls({devicesState, screenSelected, channelCategory, deviceState, youtubeLizVideos, changeControlParent, changeDeviceStateParent, changeChannelCategoryParent, triggerVibrateParent}) {
  const triggerControl = (params) => {
    changeControlParent(params);
  }

  const triggerChannelCategory = (category) => {
    changeChannelCategoryParent(category);
  }

  const triggerVibrate = (length) => {
    triggerVibrateParent(length);
  }

  const triggerDeviceState = (state) => {
    changeDeviceStateParent(state);
  }

  return (
    <div>
      <div className='controls'>
        <Top
          devicesState={devicesState}
          screenSelected={screenSelected}
          triggerControlParent={triggerControl}>
        </Top>
        <Arrows
          devicesState={devicesState}
          screenSelected={screenSelected}
          triggerControlParent={triggerControl}>
        </Arrows>
        <Levels
          devicesState={devicesState}
          screenSelected={screenSelected}
          channelCategory={channelCategory}
          deviceState={deviceState}
          triggerControlParent={triggerControl}
          triggerDeviceStateParent={triggerDeviceState}
          triggerChannelCategoryParent={triggerChannelCategory}
          triggerVibrateParent={triggerVibrate}>
        </Levels>
        {devicesState.hdmiSala.state === 'roku' && deviceState === 'default' &&
        <div className='controls-toolbar-apps'>
          <div className='controls-toolbar-apps-wrapper'>
            <Toolbar
              devicesState={devicesState}
              triggerControlParent={triggerControl}>
            </Toolbar>
            <Apps
              devicesState={devicesState}
              triggerControlParent={triggerControl}
              triggerDeviceStateParent={triggerDeviceState}>
            </Apps>
          </div>
        </div>
        }
        {devicesState.hdmiSala.state === 'cable' && channelCategory.includes('default') && deviceState === 'default' &&
        <div>
          <Channels
            devicesState={devicesState}
            triggerCategoryParent={triggerChannelCategory}>
          </Channels>
        </div>
        }
        {devicesState.hdmiSala.state === 'cable' && !channelCategory.includes('default') && deviceState === 'default' &&
        <div>
          <ChannelCategory
            devicesState={devicesState}
            channelCategory={channelCategory}
            triggerControlParent={triggerControl}>
          </ChannelCategory>
        </div>
        }
        {deviceState !== 'default' &&
        <div>
          <Devices
            devicesState={devicesState}
            deviceState={deviceState}
            youtubeLizVideos={youtubeLizVideos}
            triggerControlParent={triggerControl}
            triggerDeviceStateParent={triggerDeviceState}>
          </Devices>
        </div>
        }
      </div>
    </div>
  )
}

export default Controls;
