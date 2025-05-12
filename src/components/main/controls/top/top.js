import React from 'react';
import './top.css';

function Controls({devicesState, screenSelected, triggerControlParent, triggerControlParent2}) {
  const triggerPower = (control) => {
    if (control === 'proyectorSala') {
      if (devicesState[control].state === 'on') {
        triggerControlParent(control, 'state', 'off');
        setTimeout(() => {
          triggerControlParent2('proyectorSwitchSala', 'state', 'off');
        }, 15000);
      } else {
        triggerControlParent('proyectorSwitchSala', 'state', 'on');
        setTimeout(() => {
          triggerControlParent2(control, 'state', 'on');
        }, 5000);
      }
    } else {
      if (devicesState[control].state === 'on') {
        triggerControlParent(control, 'state', 'off');
      } else {
        triggerControlParent(control, 'state', 'on');
      }
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
