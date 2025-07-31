import React, {useRef} from 'react';
import './levels.css';

function Levels({devicesState, screenSelected, channelCategory, deviceState, triggerControlParent, triggerDeviceStateParent, triggerChannelCategoryParent, triggerVibrateParent}) {
  const timeout3s = useRef(null);
  const timeout6s = useRef(null);
  const volumeChange = useRef('1');

  const triggerMute = () => {
    const device = screenSelected;
    if (devicesState[screenSelected].mute === 'on') {
      triggerControlParent({ifttt: [{device, key: 'mute', value: 'off'}]});
    }
    if (devicesState[screenSelected].mute === 'off') {
      triggerControlParent({ifttt: [{device, key: 'mute', value: 'on'}]});
    }
  }
  const triggerControl = (value, saveChange = true) => {
    const device = devicesState.hdmiSala.state === 'roku' ? 'rokuSala' : 'cableSala';
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (saveChange) {
      triggerControlParent({ifttt: [{device, key: 'command', value}], roku: [{device, key: 'keypress', value: rokuValue}], massMedia: [{device, key: 'app', value}]});
    } else {
      triggerControlParent({ifttt: [{device, key: 'command', value}], roku: [{device, key: 'keypress', value: rokuValue}], massMedia: []});
    }
  }

  const triggerChannel = (value) => {
    let newChannel = {};
    const device = 'channelsSala';
    let newChannelOrder = 0;
    const channelIdSelected = devicesState.channelsSala.selected;
    const channelOrderSelected = devicesState.channelsSala.channels[channelIdSelected].order;
    if (value === 'up') {
      newChannelOrder = channelOrderSelected + 1; 
    }
    if (value === 'down') {
      newChannelOrder = channelOrderSelected - 1;
    }
    newChannel = Object.values(devicesState.channelsSala.channels).find(obj => obj.order === newChannelOrder);
    if (!newChannel) {
      if (value === 'up') {
        newChannel = Object.values(devicesState.channelsSala.channels).find(obj => obj.order === 1);
      } else {
        newChannel = Object.values(devicesState.channelsSala.channels)[Object.values(devicesState.channelsSala.channels).length - 1];
      }     
    }
    triggerControlParent({
      ifttt: [{device: device + newChannel.ifttt, key: 'selected', value: newChannel.id}],
      massMedia: [{device, key: 'selected', value: newChannel.id}]
    });
  }

  const triggerVolume = (vol, button, vib = true) => {
    const device = screenSelected;
    let newVol = 0;
    if (button === 'up') {
      newVol = parseInt(devicesState[screenSelected].volume) + parseInt(vol);
      triggerControlParent({
        ifttt: [{device, key: 'volume', value: button + vol}],
        massMedia: [{device, key: 'volume', value: newVol.toString()}],
        ignoreVibration: !vib
      });

    } else if (devicesState[screenSelected].volume !== '0') {
      if (parseInt(devicesState[screenSelected].volume) - parseInt(vol) >= 0) {
        newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
        triggerControlParent({
          ifttt: [{device, key: 'volume', value: button + vol}],
          massMedia: [{device, key: 'volume', value: newVol.toString()}],
          ignoreVibration: !vib
        });
      } else {
        newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
        triggerControlParent({
          ifttt: [{device, key: 'volume', value: button + vol}],
          massMedia: [{device, key: 'volume', value: '0'}],
          ignoreVibration: !vib
        });
      }
    } else {
      triggerControlParent({ifttt: [{device, key: 'volume', value: button + vol}], massMedia: [], ignoreVibration: !vib}); 
    }
  }

  const triggerVolumeStart = () => {
    volumeChange.current = '1';
    timeout3s.current = setTimeout(() => {
      volumeChange.current = '5';
      triggerVibrateParent(200);
    }, 1000);
    timeout6s.current = setTimeout(() => {
      volumeChange.current = '10';
      triggerVibrateParent(400);
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

  const triggerChannelCategory = (category) => {
    triggerChannelCategoryParent(category);
  }

  const backButtonTriggered = () => {
    if (deviceState !== 'default') {
      if (deviceState === 'youtubeVideos') {
        triggerDeviceStateParent('youtube');
      } else {
        triggerDeviceStateParent('default');
      }
    } else {
      if (channelCategory === 'default') {
        triggerControl('back', false);
      } else {
        triggerChannelCategory('default');
      }
    }
  }
      
  return (
    <div className='controls-levels'>
      <div className='controls-levels-row controls-levels-row--top'>
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
      <div className='controls-levels-row controls-levels-row--middle'>
        <div className='controls-levels-element controls-levels-element--no-margin'>
          <span className='controls-levels-span'>
            vol {devicesState[screenSelected].volume}
          </span>
        </div>
        <div className='controls-levels-element controls-levels-element--right controls-levels-element--no-margin'>
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
      <div className='controls-levels-row controls-levels-row--bottom'>
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
            onTouchStart={() => backButtonTriggered()}>
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
              onTouchStart={() => triggerControl('info', false)}>
              <img
                className='controls-levels-img controls-levels-img--button'
                src="/imgs/asterisk-24.png"
                alt="icono">
              </img>
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
