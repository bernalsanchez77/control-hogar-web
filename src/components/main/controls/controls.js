import React from 'react';
import Top from './top/top';
import Arrows from './arrows/arrows';
import Levels from './levels/levels';
import Toolbar from './toolbar/toolbar';
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
        <Levels
          devicesState={devicesState}
          screenSelected={screenSelected}
          triggerControlParent={triggerControl}>
        </Levels>
        <Toolbar
          devicesState={devicesState}
          triggerControlParent={triggerControl}>
        </Toolbar>
      </div>
    </div>
  )
}

export default Controls;
