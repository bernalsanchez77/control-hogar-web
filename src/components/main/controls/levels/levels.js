
import React from 'react';
import './levels.css';

function Controls({ devicesState, screenSelected, triggerControlParent }) {
  const triggerPower = () => {
    navigator.vibrate([200]);
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent([screenSelected], ['state'], 'off');
        setTimeout(() => {
          triggerControlParent([devicesState.proyectorSwitchSala.id], ['state'], 'off');
        }, 20000);
      } else {
        triggerControlParent([devicesState.proyectorSwitchSala.id], ['state'], 'on');
        setTimeout(() => {
          triggerControlParent([screenSelected], ['state'], 'on');
        }, 5000);
      }
    } else {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent([screenSelected], ['state'], 'off');
      } else {
        triggerControlParent([screenSelected], ['state'], 'on');
      }
    }
  }
  const triggerMute = () => {
    navigator.vibrate([200]);
    if (devicesState[screenSelected].mute === 'on') {
      triggerControlParent([screenSelected], ['mute'], 'off');
    }
    if (devicesState[screenSelected].mute === 'off') {
      triggerControlParent([screenSelected], ['mute'], 'on');
    }
  }
  const triggerVolume = (vol) => {
    navigator.vibrate([200]);
    const newVol = devicesState[screenSelected].volume + vol;
    triggerControlParent([screenSelected], ['volume'], newVol);
  }
  const triggerInput = () => {
    navigator.vibrate([200]);
    if (screenSelected === devicesState.teleSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input', 'state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input', 'state'], 'hdmi1');
      }
    }
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input', 'state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input', 'state'], 'hdmi1');
      }
    }
    if (screenSelected === devicesState.teleCuarto.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input', 'state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input', 'state'], 'hdmi1');
      }
    }
  }
  return (
    <div className='controls-levels'>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerVolume('1')}>
            &#9650;
          </button>
        </div>
        {
          devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerVolume('-1')}>
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
              onClick={() => triggerInput()}>
              &#9650;
            </button>
          </div>
        }
      </div>
      <div className='controls-levels-row controls-levels-row--mute'>
        <div className='controls-levels-element controls-levels-element--mute'>
          <span className='controls-levels-span'>
            vol {{ devicesState[screenSelected].volume }}
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
            onClick={() => triggerPower()}>
            &#9660;
          </button>
        </div>
        {devicesState.hdmiSala.state === 'roku' &&
          <div className='controls-levels-element controls-levels-element--right'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`controls-levels-button`}
              onClick={() => triggerInput()}>
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
              onClick={() => triggerInput()}>
              &#9660;
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Controls;
