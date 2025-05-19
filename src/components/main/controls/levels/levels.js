import React from 'react';
import './levels.css';

function Controls({ devicesState, screenSelected, triggerControlParent }) {
  const triggerMute = () => {
    navigator.vibrate([200]);
    if (devicesState[screenSelected].mute === 'on') {
      triggerControlParent([screenSelected], ['mute'], ['off']);
    }
    if (devicesState[screenSelected].mute === 'off') {
      triggerControlParent([screenSelected], ['mute'], ['on']);
    }
  }
  const triggerVolume = (vol, button) => {
    navigator.vibrate([200]);
    let newVol = 0;
    if (button === 'up') {
      newVol = parseInt(devicesState[screenSelected].volume) + parseInt(vol);
      triggerControlParent([screenSelected], ['volume'], [button + vol, newVol.toString()]);
    } else if (devicesState[screenSelected].volume !== '0') {
      newVol = parseInt(devicesState[screenSelected].volume) - parseInt(vol);
      triggerControlParent([screenSelected], ['volume'], [button + vol, newVol.toString()]);
    }
  }
      
  return (
    <div className='controls-levels'>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerVolume('1','up')}>
            &#9650;
          </button>
        </div>
        {
          devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerVolume()}>
              home
            </button>
          </div>
        }
        {
          devicesState.hdmiSala.state === 'cable' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={'controls-levels-button'}
              onClick={() => triggerVolume()}>
              &#9650;
            </button>
          </div>
        }
      </div>
      <div className='controls-levels-row controls-levels-row--mute'>
        <div className='controls-levels-element controls-levels-element--mute'>
          <span className='controls-levels-span'>
            vol {devicesState[screenSelected].volume}
          </span>
        </div>
        <div className='controls-levels-element controls-levels-element--mute-icon'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-levels-button controls-levels-button--img"
            onClick={() => triggerMute()}>
            {
              devicesState[screenSelected].mute === 'off' &&
              <img
                className='controls-levels-img'
                src="/imgs/sound-50.png"
                alt="icono">
              </img>
            }
            {
              devicesState[screenSelected].mute === 'on' &&
              <img
                className='controls-levels-img'
                src="/imgs/mute-50.png"
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-levels-element  controls-levels-element--mute'>
          <span className='controls-levels-span'>
            ch
          </span>
        </div>
      </div>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerVolume('1', 'down')}>
            &#9660;
          </button>
        </div>
        {devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerVolume()}>
              rewind
            </button>
          </div>
        }
        {
          devicesState.hdmiSala.state === 'cable' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerVolume()}>
              &#9660;
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Controls;
