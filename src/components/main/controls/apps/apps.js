

import React from 'react';
import './apps.css';

function Apps({devicesState, screenSelected, triggerControlParent}) {
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = 'rokuSala';
    triggerControlParent([device], ['app'], [value]);
  }

  return (
    <div className='controls-apps'>
      <div className='controls-apps-row'>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.netflix.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.netflix.id)}>
              {devicesState.rokuSala.apps.netflix.label}
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.disney.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.disney.id)}>
              {devicesState.rokuSala.apps.disney.label}
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.youtube.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.youtube.id)}>
              {devicesState.rokuSala.apps.youtube.label}
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.max.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.max.id)}>
              {devicesState.rokuSala.apps.max.label}
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.amazon.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.amazon.id)}>
              {devicesState.rokuSala.apps.amazon.label}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Apps;
