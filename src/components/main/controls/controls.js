import React from 'react';
import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import './controls.css';

function Controls({credential, ownerCredential, inRange, devicesState, loadingDevices, screenSelected, changeControlParent}) {
  const triggerControl = (control, key, value, save) => {
    if (inRange || (credential === ownerCredential)) {
      if (!loadingDevices.current) {
        changeControlParent(control, key, value, save);
      } else {
        setTimeout(() => {
            triggerControl(control, key, value, save);
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
        <Arrows
          devicesState={devicesState}
          screenSelected={screenSelected}
          triggerControlParent={triggerControl}>
        </Arrows>
      </div>
    </div>
  )
}

export default Controls;
