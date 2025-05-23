import React, {useRef} from 'react';
import './levels.css';

function Levels({ devicesState, screenSelected, credential, triggerControlParent }) {
  const timeout3s = useRef(null);
  const timeout6s = useRef(null);
  const volumeChange = useRef('1');
  const volumeShow = useRef(null);
  const triggerMute = () => {
    navigator.vibrate([200]);
    if (devicesState[screenSelected].mute === 'on') {
      triggerControlParent([screenSelected], ['mute'], ['off'], true);
    }
    if (devicesState[screenSelected].mute === 'off') {
      triggerControlParent([screenSelected], ['mute'], ['on'], true);
    }
  }
  const triggerControl = (value) => {
    navigator.vibrate([200]);
    const device = 'rokuSala';
    triggerControlParent([device], ['command'], [value], false);
  }
  const triggerChannel = (value) => {
    navigator.vibrate([200]);
    const device = 'cableSala';
    let newChannelOrder = 0;
    const channelIdSelected = devicesState.cableSala.selected;
    const channelOrderSelected = devicesState.cableSala.channels[channelIdSelected].order;
    if (value === 'up') {
      newChannelOrder = channelOrderSelected + 1; 
    }
    if (value === 'down') {
      newChannelOrder = channelOrderSelected - 1; 
    }
    const newChannel = Object.values(devicesState.cableSala.channels).find(obj => obj.order === newChannelOrder);
    if (newChannel) {
      triggerControlParent([device], ['selected'], [newChannel.id], true);
    }
  }
  const triggerVolume = (vol, button) => {
    navigator.vibrate([200]);
    let newVol = 0;
    if (button === 'up') {
      newVol = parseInt(devicesState[screenSelected].volume) + parseInt(vol);
      triggerControlParent([screenSelected], ['volume'], [button + vol, newVol.toString()], true);
    } else if (devicesState[screenSelected].volume !== '0') {
      newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
      triggerControlParent([screenSelected], ['volume'], [button + vol, newVol.toString()], true);
    } else {
      triggerControlParent([screenSelected], ['volume'], [button + vol], false);      
    }
  }
  const triggerVolumeStart = (button) => {
    volumeChange.current = '1';
    timeout3s.current = setTimeout(() => {
      volumeChange.current = '5';
      if (button === 'down') {
        volumeShow.current = parseInt(devicesState[screenSelected].volume) - parseInt(volumeChange.current);
      } else {
        volumeShow.current = parseInt(devicesState[screenSelected].volume) + parseInt(volumeChange.current);
      }
    }, 1000);
    timeout6s.current = setTimeout(() => {
      volumeChange.current = '10';
      if (button === 'down') {
        volumeShow.current = parseInt(devicesState[screenSelected].volume) - parseInt(volumeChange.current);
      } else {
        volumeShow.current = parseInt(devicesState[screenSelected].volume) + parseInt(volumeChange.current);
      }
    }, 2000);
  }

  const triggerVolumeEnd = (button) => {
    clearTimeout(timeout3s.current);
    clearTimeout(timeout6s.current);
    volumeShow.current = null;
    triggerVolume(volumeChange.current, button);
  }

  const renderVolume = () => {
    if (volumeShow.current) {
      return volumeShow.current;
    } else {
      return devicesState[screenSelected].volume;
    }
  }
      
  return (
    <div className='controls-levels'>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left'>
          {credential === 'dev' && 
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onTouchStart={() => triggerVolumeStart('up')}
            onTouchEnd={() => triggerVolumeEnd('up')}>
            &#9650;
          </button>
          }
          {credential !== 'dev' && 
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerVolume('1', 'up')}>
            &#9650;
          </button>
          }
        </div>
        {
          devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerControl('home')}>
              <img
                className='controls-levels-img controls-levels-img--button'
                src="/imgs/home-50.png"
                alt="icono">
              </img>
            </button>
          </div>
        }
        {
          devicesState.hdmiSala.state === 'cable' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={'controls-levels-button'}
              onClick={() => triggerChannel('up')}>
              &#9650;
            </button>
          </div>
        }
      </div>
      <div className='controls-levels-row controls-levels-row--mute'>
        <div className='controls-levels-element controls-levels-element--mute'>
          <span className='controls-levels-span'>
            vol {renderVolume()}
          </span>
        </div>
        <div className='controls-levels-element controls-levels-element--mute-icon'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-levels-button controls-levels-button--img"
            onClick={() => triggerMute()}>
            {devicesState[screenSelected].mute === 'off' &&
              <img
                className='controls-levels-img controls-levels-img--no-button'
                src="/imgs/sound-50.png"
                alt="icono">
              </img>
            }
            {devicesState[screenSelected].mute === 'on' &&
              <img
                className='controls-levels-img controls-levels-img--no-button'
                src="/imgs/mute-50.png"
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-levels-element  controls-levels-element--mute'>
          <span className='controls-levels-span'>
            {devicesState.hdmiSala.state === 'roku'  &&
              'op'
            }
            {devicesState.hdmiSala.state === 'cable'  &&
              'ch'
            }
          </span>
        </div>
      </div>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left'>
          {credential === 'dev' && 
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onTouchStart={() => triggerVolumeStart('down')}
            onTouchEnd={() => triggerVolumeEnd('down')}>
            &#9660;
          </button>
          }
          {credential !== 'dev' && 
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerVolume('1', 'down')}>
            &#9660;
          </button>
          }
        </div>
        {
        devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerControl('back')}>
              <img
                className='controls-levels-img controls-levels-img--button'
                src="/imgs/back-50.png"
                alt="icono">
              </img>
            </button>
          </div>
        }
        {
        devicesState.hdmiSala.state === 'cable' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerChannel('down')}>
              &#9660;
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Levels;
