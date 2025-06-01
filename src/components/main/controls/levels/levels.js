import React, {useRef} from 'react';
import './levels.css';

function Levels({ devicesState, screenSelected, credential, triggerControlParent }) {
  const timeout3s = useRef(null);
  const timeout6s = useRef(null);
  const volumeChange = useRef('1');
  const triggerMute = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: screenSelected, ifttt: screenSelected}];
    if (devicesState[screenSelected].mute === 'on') {
      triggerControlParent(device, ['mute'], ['off'], true);
    }
    if (devicesState[screenSelected].mute === 'off') {
      triggerControlParent(device, ['mute'], ['on'], true);
    }
  }
  const triggerControl = (value, saveChange = true) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    let device = [];
    if (devicesState.hdmiSala.state === 'roku') {
      device = [{device: 'rokuSala', ifttt: 'rokuSala'}];
    } else {
      device = [{device: 'cableSala', ifttt: 'cableSala'}];
    }
    triggerControlParent(device, ['command'], [value], saveChange);
  }
  const triggerChannel = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: 'channelsSala', ifttt: 'channelsSala'}];
    let newChannelOrder = 0;
    const channelIdSelected = devicesState.channelsSala.selected;
    const channelOrderSelected = devicesState.channelsSala.channels[channelIdSelected].order;
    if (value === 'up') {
      newChannelOrder = channelOrderSelected + 1; 
    }
    if (value === 'down') {
      newChannelOrder = channelOrderSelected - 1; 
    }
    const newChannel = Object.values(devicesState.channelsSala.channels).find(obj => obj.order === newChannelOrder);
    if (newChannel) {
      device[0].ifttt = device[0].ifttt + newChannel.ifttt;
      triggerControlParent(device, ['selected'], [newChannel.id], true);
    }
  }

  const triggerVolume = (vol, button, vib = true) => {
    if (vib && navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: screenSelected, ifttt: screenSelected}];
    let newVol = 0;
    if (button === 'up') {
      newVol = parseInt(devicesState[screenSelected].volume) + parseInt(vol);
      triggerControlParent(device, ['volume'], [button + vol, newVol.toString()], true);
    } else if (devicesState[screenSelected].volume !== '0') {
      if (parseInt(devicesState[screenSelected].volume) - parseInt(vol) >= 0) {
        newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
        triggerControlParent(device, ['volume'], [button + vol, newVol.toString()], true);
      } else {
        newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
        triggerControlParent(device, ['volume'], [button + vol, '0'], true);
      }
    } else {
      triggerControlParent(device, ['volume'], [button + vol], false);      
    }
  }
  const triggerVolumeStart = (button) => {
    volumeChange.current = '1';
    timeout3s.current = setTimeout(() => {
      volumeChange.current = '5';
      if (navigator.vibrate) {
        navigator.vibrate([200]);
      }
    }, 1000);
    timeout6s.current = setTimeout(() => {
      volumeChange.current = '10';
      if (navigator.vibrate) {
        navigator.vibrate([400]);
      }
    }, 2000);
  }

  const triggerVolumeEnd = (button) => {
    clearTimeout(timeout3s.current);
    clearTimeout(timeout6s.current);
    if (volumeChange.current === '1') {
      triggerVolume(volumeChange.current, button);
    } else {
      triggerVolume(volumeChange.current, button, false);
    }
  }
      
  return (
    <div className='controls-levels'>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left'>
          <button
            className='controls-levels-button'
            onTouchStart={() => triggerVolumeStart('up')}
            onTouchEnd={() => triggerVolumeEnd('up')}>
            &#9650;
          </button>
        </div>
        <div className='controls-levels-element controls-levels-element--mute-icon'>
          <button
            className="controls-levels-button controls-levels-button--img"
            onTouchStart={() => triggerMute()}>
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
        {
          devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              className={`controls-levels-button`}
              onTouchStart={() => triggerControl('home')}>
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
              className={'controls-levels-button'}
              onTouchStart={() => triggerChannel('up')}>
              &#9650;
            </button>
          </div>
        }
      </div>
      <div className='controls-levels-row controls-levels-row--mute'>
        <div className='controls-levels-element'>
          <span className='controls-levels-span'>
            vol {devicesState[screenSelected].volume}
          </span>
        </div>
        <div className='controls-levels-element controls-levels-element--right'>
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
          <button
            className='controls-levels-button'
            onTouchStart={() => triggerVolumeStart('down')}
            onTouchEnd={() => triggerVolumeEnd('down')}>
            &#9660;
          </button>
        </div>
        <div className='controls-levels-element controls-levels-element--back'>
          <button
            className='controls-levels-button controls-levels-button--img'
            onTouchStart={() => triggerControl('back', false)}>
            <img
              className='controls-levels-img controls-levels-img--no-button'
              src="/imgs/back-50.png"
              alt="icono">
            </img>
          </button>
        </div>
        {
        devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              className={`controls-levels-button`}
              onTouchStart={() => triggerControl('options', false)}>
              *
            </button>
          </div>
        }
        {
        devicesState.hdmiSala.state === 'cable' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              className={`controls-levels-button`}
              onTouchStart={() => triggerChannel('down')}>
              &#9660;
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Levels;
