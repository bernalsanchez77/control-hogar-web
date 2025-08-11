import {useRef} from 'react';
import './levels.css';

function Levels({devicesState, screenSelected, view, cableChannels, changeControlParent, changeViewParent, changeVibrateParent}) {
  const timeout3s = useRef(null);
  const timeout6s = useRef(null);
  const volumeChange = useRef('1');

  const changeMute = () => {
    const device = screenSelected;
    if (devicesState[screenSelected].mute === 'on') {
      changeControlParent({ifttt: [{device, key: 'mute', value: 'off'}]});
    }
    if (devicesState[screenSelected].mute === 'off') {
      changeControlParent({ifttt: [{device, key: 'mute', value: 'on'}]});
    }
  }
  const changeControl = (value, saveChange = true) => {
    const device = devicesState.hdmiSala.state === 'roku' ? 'rokuSala' : 'cableSala';
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (saveChange) {
      changeControlParent({ifttt: [{device, key: 'command', value}], roku: [{device, key: 'keypress', value: rokuValue}], massMedia: [{device, key: 'app', value}]});
    } else {
      changeControlParent({ifttt: [{device, key: 'command', value}], roku: [{device, key: 'keypress', value: rokuValue}], massMedia: []});
    }
  }

  const changeChannel = (value) => {
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
    newChannel = cableChannels.find(ch => ch.order === newChannelOrder);
    if (!newChannel) {
      if (value === 'up') {
        newChannel = cableChannels.find(ch => ch.order === 1);
      } else {
        newChannel = cableChannels[cableChannels.length - 1];
      }     
    }
    changeControlParent({
      ifttt: [{device: device + newChannel.ifttt, key: 'selected', value: newChannel.id}],
      massMedia: [{device, key: 'selected', value: newChannel.id}]
    });
  }

  const changeVolume = (vol, button, vib = true) => {
    const device = screenSelected;
    let newVol = 0;
    if (button === 'up') {
      newVol = parseInt(devicesState[screenSelected].volume) + parseInt(vol);
      changeControlParent({
        ifttt: [{device, key: 'volume', value: button + vol}],
        massMedia: [{device, key: 'volume', value: newVol.toString()}],
        ignoreVibration: !vib
      });

    } else if (devicesState[screenSelected].volume !== '0') {
      if (parseInt(devicesState[screenSelected].volume) - parseInt(vol) >= 0) {
        newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
        changeControlParent({
          ifttt: [{device, key: 'volume', value: button + vol}],
          massMedia: [{device, key: 'volume', value: newVol.toString()}],
          ignoreVibration: !vib
        });
      } else {
        newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
        changeControlParent({
          ifttt: [{device, key: 'volume', value: button + vol}],
          massMedia: [{device, key: 'volume', value: '0'}],
          ignoreVibration: !vib
        });
      }
    } else {
      changeControlParent({ifttt: [{device, key: 'volume', value: button + vol}], massMedia: [], ignoreVibration: !vib}); 
    }
  }

  const changeVolumeStart = () => {
    volumeChange.current = '1';
    timeout3s.current = setTimeout(() => {
      volumeChange.current = '5';
      changeVibrateParent(200);
    }, 1000);
    timeout6s.current = setTimeout(() => {
      volumeChange.current = '10';
      changeVibrateParent(400);
    }, 2000);
  }

  const changeVolumeEnd = (button) => {
    clearTimeout(timeout3s.current);
    clearTimeout(timeout6s.current);
    if (volumeChange.current === '1') {
      changeVolume(volumeChange.current, button);
    } else {
      changeVolume(volumeChange.current, button, false);
    }
  }

  const backButtonTriggered = () => {
    const newView = {...view};
    if (devicesState.hdmiSala.state === 'roku') {
      if (view.apps.selected) {
        if (view.apps.youtube.mode === 'channel' || view.apps.youtube.mode === 'search') {
          newView.apps.youtube.mode = '';
          if (view.apps.youtube.channel !== '') {
            newView.apps.youtube.channel = '';
          }
          changeViewParent(newView);
        } else {
          newView.apps.selected = '';
          changeViewParent(newView);
        }
      }
    }
    if (devicesState.hdmiSala.state === 'cable') {
      if (view.channels.category.length) {
        newView.channels.category = [];
        changeViewParent(newView);
      }
    }
    if (view.devices.device) {
      newView.devices.device = '';
      changeViewParent(newView);
    }
  }
      
  return (
    <div className='controls-levels'>
      <div className='controls-levels-row controls-levels-row--top'>
        <div className='controls-levels-element controls-levels-element--left'>
          <button
            className='controls-levels-button'
            onTouchStart={() => changeVolumeStart('up')}
            onTouchEnd={() => changeVolumeEnd('up')}>
            &#9650;
          </button>
        </div>
        <div className='controls-levels-element controls-levels-element--mute-icon'>
          <button
            className="controls-levels-button controls-levels-button--img"
            onTouchStart={() => changeMute()}>
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
              onTouchStart={() => changeControl('home')}>
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
              onTouchStart={() => changeChannel('up')}>
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
            onTouchStart={() => changeVolumeStart('down')}
            onTouchEnd={() => changeVolumeEnd('down')}>
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
              onTouchStart={() => changeControl('info', false)}>
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
              onTouchStart={() => changeChannel('down')}>
              &#9660;
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Levels;
