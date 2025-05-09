import React from 'react';
import './top.css';

function Controls({devicesState, controlSelected, triggerControlParent}) {
  const triggerControl = (control) => {
    if (devicesState[control].state === 'on') {
      triggerControlParent(control, 'state', 'off');
    }
    if (devicesState[control].state === 'off') {
      triggerControlParent(control, 'state', 'on');
    }
  }
  return (
    <div>
      <div className='controls-row'>
        <div className='controls-element'>
          <button onContextMenu={(e) => e.preventDefault()} className={`controls-button ${devicesState[controlSelected].state === 'on' ? "controls-button--on" : "controls-button-off"}`} onClick={() => triggerControl(devicesState[controlSelected].id)}>{devicesState[controlSelected].state}</button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
