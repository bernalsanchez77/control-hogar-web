
import React from 'react';
import './levels.css';

function Controls({devicesState, screenSelected, triggerControlParent}) {
  const triggerPower = () => {
    navigator.vibrate([200]);
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent([screenSelected], ['state'], 'off');
        setTimeout(() => {
          triggerControlParent([devicesState.proyectorSwitchSala.id], ['state'], 'off');
        }, 20000);
      } else {
        triggerControlParent([devicesState.proyectorSwitchSala.id], ['state'], 'on');
        setTimeout(() => {
          triggerControlParent([screenSelected], ['state'], 'on');
        }, 5000);
      }
    } else {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent([screenSelected], ['state'], 'off');
      } else {
        triggerControlParent([screenSelected], ['state'], 'on');
      }
    }
  }
  const triggerHdmi = () => {
    navigator.vibrate([200]);
    const device = devicesState.hdmiSala.id;
    if (devicesState[device].state === 'roku') {
      triggerControlParent([device], ['state'], 'cable');
    }
    if (devicesState[device].state === 'cable') {
      triggerControlParent([device], ['state'], 'roku');
    }
  }
  const triggerInput = () => {
    navigator.vibrate([200]);
    if (screenSelected === devicesState.teleSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi1');
      }
    }
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi1');
      }
    }
    if (screenSelected === devicesState.teleCuarto.id) {
      if (devicesState[screenSelected].input.state === 'hdmi1') {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi2');
      } else {
        triggerControlParent([devicesState[screenSelected].id], ['input','state'], 'hdmi1');
      }
    }
  }
  return (
    <div className='controls-levels'>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left '>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerPower()}>
             &#9650;
          </button>
        </div>
       {devicesState.hdmiSala.state === 'roku' &&
         <div className='controls-levels-element controls-levels-element--right '>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-levels-button`}
            onClick={() => triggerInput()}>
              home
          </button>
        </div>
        }
        {devicesState.hdmiSala.state === 'cable' &&
         <div className='controls-levels-element controls-levels-element--right '>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-levels-button`}
            onClick={() => triggerInput()}>
              up
          </button>
        </div>  
        }
      </div>
      <div className='controls-levels-row'>
        <div className='controls-levels-element'>
          <span className='controls-levels-span'>
              vol
          </span>
        </div>
             <div className='controls-levels-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-levels-button"
            onClick={() => triggerHdmi()}>
              mute
          </button>
        </div>
       <div className='controls-levels-element'>
          <span className='controls-levels-span'>
              ch
          </span>
        </div>
      </div>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left '>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerPower()}>
             &#9650;
          </button>
        </div> 
        {devicesState.hdmiSala.state === 'roku' &&
         <div className='controls-levels-element controls-levels-element--right '>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-levels-button`}
            onClick={() => triggerInput()}>
              rewind
          </button>
        </div>
        }
        {devicesState.hdmiSala.state === 'cable' &&
         <div className='controls-levels-element  controls-levels-element--right'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-levels-button`}
            onClick={() => triggerInput()}>
              down
          </button>
        </div>  
        }
      </div>
    </div>
  )
}

export default Controls;
