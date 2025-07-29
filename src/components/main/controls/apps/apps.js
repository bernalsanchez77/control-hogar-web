import React, {useRef} from 'react';
import './apps.css';

function Apps({devicesState, triggerControlParent, triggerDeviceStateParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const triggerControl = (value) => {
    const device = 'rokuSala';
    let rokuValue = devicesState.rokuSala.apps[value].rokuId
    rokuValue = rokuValue.charAt(0).toUpperCase() + rokuValue.slice(1);
    triggerControlParent({
      ifttt: [{device, key: 'app', value}],
      roku: [{device, key: 'launch', value: rokuValue}],
    });
  }

  const triggerDeviceStart = () => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 1000);
  }
  const triggerDeviceEnd = (app) => {
    clearTimeout(timeout3s.current);
    if (longClick.current) {
      triggerDeviceStateParent(app);
    } else {
      triggerControl(app);
    }
    longClick.current = false;
  }

  return (
    <div className='controls-apps'>
      <div className='controls-apps-wrapper'>
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
            onTouchStart={() => triggerDeviceStart(devicesState.rokuSala.apps.youtube.id)}
            onTouchEnd={() => triggerDeviceEnd(devicesState.rokuSala.apps.youtube.id)}>
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
        <div className='controls-apps-element'>
          <button
            className={`controls-apps-button ${devicesState.rokuSala.apps.pluto.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
            onTouchStart={() => triggerControl(devicesState.rokuSala.apps.pluto.id)}>
              <img
                className='controls-apps-img controls-apps-img--button'
                src={devicesState.rokuSala.apps.pluto.img}
                alt="icono">
              </img>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Apps;
