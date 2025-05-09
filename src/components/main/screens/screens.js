import React from 'react';
import './screens.css';

function Screens({credential, ownerCredential, inRange, devicesState, loadingDevices, controlSelected, changeControlParent}) {
  const triggerControl = (control) => {
    if (inRange || (credential === ownerCredential && controlSelected !== control)) {
      if (!loadingDevices.current) {
        changeControlParent(control);
      } else {
        setTimeout(() => {
          changeControlParent(control);
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
            <button onContextMenu={(e) => e.preventDefault()} className={`screens-button ${controlSelected === devicesState.teleCuarto.id ? "screens-button--on" : "screens-button-off"}`} onClick={() => triggerControl(devicesState.teleCuarto.id)}>{devicesState.teleCuarto.label}</button>
          </div>
          }
          <div className='screens-element'>
          <button onContextMenu={(e) => e.preventDefault()} className={`screens-button ${controlSelected === devicesState.teleSala.id ? "screens-button--on" : "screens-button-off"}`} onClick={() => triggerControl(devicesState.teleSala.id)}>{devicesState.teleSala.label}</button>
            </div>
          <div className='screens-element'>
          <button onContextMenu={(e) => e.preventDefault()} className={`screens-button ${controlSelected === devicesState.proyectorSala.id ? "screens-button--on" : "screens-button-off"}`} onClick={() => triggerControl(devicesState.proyectorSala.id)}>{devicesState.proyectorSala.label}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screens;
