

import React from 'react';
import './apps.css';

function Apps({devicesState, screenSelected, triggerControlParent}) {
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: 'rokuSala', ifttt: 'rokuSala'}];
    triggerControlParent(device, ['app'], [value]);
  }

  return (
    <div className='controls-apps'>
      <div className='controls-apps-row'>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.netflix.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.netflix.id)}>
              <img
                className='controls-apps-img controls-apps-img--button'
                src={devicesState.rokuSala.apps.netflix.img}
                alt="icono">
              </img>
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.disney.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.disney.id)}>
              <img
                className='controls-apps-img controls-apps-img--button'
                src={devicesState.rokuSala.apps.disney.img}
                alt="icono">
              </img>
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.youtube.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.youtube.id)}>
              <img
                className='controls-apps-img controls-apps-img--button'
                src={devicesState.rokuSala.apps.youtube.img}
                alt="icono">
              </img>
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.max.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.max.id)}>
              <img
                className='controls-apps-img controls-apps-img--button'
                src={devicesState.rokuSala.apps.max.img}
                alt="icono">
              </img>
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.amazon.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.amazon.id)}>
              <img
                className='controls-apps-img controls-apps-img--button'
                src={devicesState.rokuSala.apps.amazon.img}
                alt="icono">
              </img>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Apps;
