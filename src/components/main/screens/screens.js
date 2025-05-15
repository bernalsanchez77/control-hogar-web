import React from 'react';
import './screens.css';

function Screens({credential, ownerCredential, inRange, devicesState, loadingDevices, screenSelected, changeScreenParent}) {
  const triggerScreen = (screen) => {
    navigator.vibrate([200]);
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
          {credential === 'owner' &&
          <div className='screens-element'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`screens-button ${screenSelected === devicesState.teleCuarto.id ? "screens-button--on" : "screens-button-off"}`}
              onClick={() => triggerScreen(devicesState.teleCuarto.id)}>
                {devicesState.teleCuarto.label}
              </button>
          </div>
          }
          <div className='screens-element'>
            <button
              onContextMenu={(e) => e.preventDefault()}
              className={`screens-button ${screenSelected === devicesState.teleSala.id ? "screens-button--on" : "screens-button-off"}`}
              onClick={() => triggerScreen(devicesState.teleSala.id)}>
                {devicesState.teleSala.label}
            </button>
          </div>
          <div className='screens-element'>
            <button onContextMenu={(e) => e.preventDefault()}
              className={`screens-button ${screenSelected === devicesState.proyectorSala.id ? "screens-button--on" : "screens-button-off"}`}
              onClick={() => triggerScreen(devicesState.proyectorSala.id)}>
                {devicesState.proyectorSala.label}
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screens;
