import React from 'react';
import './top.css';

function Controls({devicesState, screenSelected, triggerControlParent}) {
  const triggerPower = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent([screenSelected, devicesState.parlantesSala.id, devicesState.lamparaSala.id, devicesState.lamparaComedor.id], ['state'], ['off'], true);
        setTimeout(() => {
          triggerControlParent([devicesState.proyectorSwitchSala.id], ['state'], ['off'], true);
        }, 60000);
      } else {
        triggerControlParent([devicesState.proyectorSwitchSala.id, devicesState.parlantesSala.id, devicesState.lamparaSala.id, devicesState.lamparaComedor.id], ['state'], ['on'], true);
        setTimeout(() => {
          triggerControlParent([screenSelected], ['state'], ['on'], true);
        }, 5000);
      }
    } else {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent([screenSelected], ['state'], ['off'], true);
      } else {
        triggerControlParent([screenSelected], ['state'], ['on'], true);
      }
    }
  }
  const triggerHdmi = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = devicesState.hdmiSala.id;
    if (devicesState[device].state === 'roku') {
      triggerControlParent([device], ['state'], ['cable'], true);
    }
    if (devicesState[device].state === 'cable') {
      triggerControlParent([device], ['state'], ['roku'], true);
    }
  }
  const triggerInput = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    if (screenSelected === devicesState.teleSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], ['hdmi2'], true);
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], ['hdmi1'], true);
      }
    }
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], ['hdmi2'], true);
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], ['hdmi1'], true);
      }
    }
    if (screenSelected === devicesState.teleCuarto.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], ['hdmi2'], true);
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], ['hdmi1'], true);
      }
    }
  }
  return (
    <div className='controls-top'>
      <div className='controls-top-row'>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => triggerPower()}>
              {devicesState[screenSelected].state === 'on' &&
                <img
                  className='controls-top-img controls-top-img--button'
                  src="/imgs/power-on-50.png"
                  alt="icono">
                </img>
              }
              {devicesState[screenSelected].state === 'off' &&
                <img
                  className='controls-top-img controls-top-img--button'
                  src="/imgs/power-off-50.png"
                  alt="icono">
                </img>
              }
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className="controls-top-button controls-top-button-off"
            onTouchStart={() => triggerHdmi()}>
              {devicesState.hdmiSala.label[devicesState.hdmiSala.state]}
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => triggerInput()}>
              {devicesState[screenSelected].input.label[devicesState[screenSelected].input.state]}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
