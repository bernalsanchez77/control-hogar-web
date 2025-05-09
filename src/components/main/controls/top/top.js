import React from 'react';
import './top.css';

function Controls({devicesState, screenSelected, triggerControlParent}) {
  const triggerPower = (control) => {
    if (devicesState[control].state === 'on') {
      triggerControlParent(control, 'state', 'off');
    }
    if (devicesState[control].state === 'off') {
      triggerControlParent(control, 'state', 'on');
    }
  }
  const triggerHdmi = (device) => {
    if (devicesState[device].state === 'roku') {
      triggerControlParent(device, 'state', 'cable');
    }
    if (devicesState[device].state === 'cable') {
      triggerControlParent(device, 'state', 'roku');
    }
  }
  const triggerInput = (input) => {
  }
  return (
    <div>
      <div className='controls-row'>
        <div className='controls-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-top-button ${devicesState[screenSelected].state === 'on' ? "controls-button--on" : "controls-button-off"}`}
            onClick={() => triggerPower(devicesState[screenSelected].id)}>
              {devicesState[screenSelected].state}
          </button>
        </div>
        <div className='controls-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-top-button controls-top-button-off"
            onClick={() => triggerHdmi(devicesState.hdmiSala.id)}>
              {devicesState.hdmiSala.label[devicesState.hdmiSala.state]}
          </button>
        </div>
        <div className='controls-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-top-button`}
            onClick={() => triggerInput()}>
              Input
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
