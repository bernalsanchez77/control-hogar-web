import React from 'react';
import './screens.css';

function Screens({credential, ownerCredential, devCredential,  inRange, devicesState, loadingDevices, screenSelected, changeScreenParent}) {
  const triggerScreen = (screen) => {
    navigator.vibrate([100]);
    if (inRange || (credential === ownerCredential && screenSelected !== screen)) {
      if (!loadingDevices.current) {
        changeScreenParent(screen);
      } else {
        setTimeout(() => {
          changeScreenParent(screen);
        }, 1000);
      }
    }
  }
  return (
    <div>
      <div className='screens'>
        <div className='screens-row'>
          {(credential === ownerCredential || credential === devCredential) &&
          <div className='screens-element'>
            <button
              className={`screens-button ${screenSelected === devicesState.teleCuarto.id ? "screens-button--on" : "screens-button-off"}`}
              onTouchStart={() => triggerScreen(devicesState.teleCuarto.id)}>
                {devicesState.teleCuarto.label}
              </button>
          </div>
          }
          <div className='screens-element'>
            <button
              className={`screens-button ${screenSelected === devicesState.teleSala.id ? "screens-button--on" : "screens-button-off"}`}
              onTouchStart={() => triggerScreen(devicesState.teleSala.id)}>
                {devicesState.teleSala.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={`screens-button ${screenSelected === devicesState.proyectorSala.id ? "screens-button--on" : "screens-button-off"}`}
              onTouchStart={() => triggerScreen(devicesState.proyectorSala.id)}>
                {devicesState.proyectorSala.label}
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screens;
