
import React from 'react';
import './arrows.css';

function Controls({devicesState, screenSelected, triggerControlParent}) {
  const triggerPower = () => {
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent([screenSelected], ['state'], 'off');
        setTimeout(() => {
          triggerControlParent(devicesState.proyectorSwitchSala.id, ['state'], 'off');
        }, 15000);
      } else {
        triggerControlParent(devicesState.proyectorSwitchSala.id, ['state'], 'on');
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
  const triggerHdmi = () => {
    const device = devicesState.hdmiSala.id;
    if (devicesState[device].state === 'roku') {
      triggerControlParent([device], ['state'], 'cable');
    }
    if (devicesState[device].state === 'cable') {
      triggerControlParent([device], ['state'], 'roku');
    }
  }
  const triggerInput = () => {
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi1');
      }
    }
    if (screenSelected === devicesState.teleSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi1');
      }
    }
    if (screenSelected === devicesState.teleCuarto.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi1');
      }
    }
  }
  return (
    <div>
      <div className='controls-top-row'>
        <div className='controls-top-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-top-button ${devicesState[screenSelected].state === 'on' ? "controls-button--on" : "controls-button-off"}`}
            onClick={() => triggerPower()}>
              {devicesState[screenSelected].state}
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-top-button controls-top-button-off"
            onClick={() => triggerHdmi()}>
              {devicesState.hdmiSala.label[devicesState.hdmiSala.state]}
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-top-button`}
            onClick={() => triggerInput()}>
              {devicesState[screenSelected].input.label[devicesState[screenSelected].input.state]}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
