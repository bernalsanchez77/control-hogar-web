import React from 'react';
import Top from './top/top';
import './controls.css';

function Controls({credential, ownerCredential, inRange, devicesState, loadingDevices, screenSelected, changeControlParent}) {
  const triggerControl = (control, key, value) => {
    if (inRange || (credential === ownerCredential)) {
      if (!loadingDevices.current) {
        changeControlParent(control, key, value);
      } else {
        setTimeout(() => {
            triggerControl(control, key, value);
        }, 1000);
      }
    }
  }

  return (
    <div>
      <div className='controls'>
        <Top
          devicesState={devicesState}
          screenSelected={screenSelected}
          triggerControlParent={triggerControl}>
        </Top>
      </div>
    </div>
  )
}

export default Controls;
