import React from 'react';
import './screens.css';

function Screens({credential, ownerCredential, devCredential, devicesState, screenSelected, changeScreenParent}) {
  const triggerScreen = (screen) => {
    if (screenSelected !== screen) {
      changeScreenParent(screen);
    }
  }
  return (
    <div>
      <div className='screens'>
        <div className='screens-row'>
          {(credential === ownerCredential || credential === devCredential) &&
          <div className='screens-element'>
            <button
              className={`screens-button ${screenSelected === devicesState.teleCuarto.id ? "screens-button--on" : "screens-button--off fade-in"}`}
              onTouchStart={() => triggerScreen(devicesState.teleCuarto.id)}>
                {devicesState.teleCuarto.label}
              </button>
          </div>
          }
          <div className='screens-element'>
            <button
              className={`screens-button ${screenSelected === devicesState.teleSala.id ? "screens-button--on" : "screens-button--off fade-in"}`}
              onTouchStart={() => triggerScreen(devicesState.teleSala.id)}>
                {devicesState.teleSala.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={`screens-button ${screenSelected === devicesState.teleCocina.id ? "screens-button--on" : "screens-button--off fade-in"}`}
              onTouchStart={() => triggerScreen(devicesState.teleCocina.id)}>
                {devicesState.teleCocina.label}
            </button>
          </div>  
          <div className='screens-element'>
            <button
              className={`screens-button ${screenSelected === devicesState.proyectorSala.id ? "screens-button--on" : "screens-button--off fade-in"}`}
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
