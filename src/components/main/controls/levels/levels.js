
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
  const triggerMute = () => {
    navigator.vibrate([200]);
    alert(screenSelected);
    if (devicesState[screenSelected].mute === 'on') {
      triggerControlParent([screenSelected], ['mute'], 'off');
    }
    if (devicesState[screenSelected].mute === 'off') {
      triggerControlParent([screenSelected], ['mute'], 'on');
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
        <div className='controls-levels-element controls-levels-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerPower()}>
             &#9650;
          </button>
        </div>
       {
         devicesState.hdmiSala.state === 'roku' &&
         <div className='controls-levels-element controls-levels-element--right'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-levels-button`}
            onClick={() => triggerInput()}>
              home
          </button>
        </div>
        }
        {
         devicesState.hdmiSala.state === 'cable' &&
         <div className='controls-levels-element controls-levels-element--right'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={'controls-levels-button'}
            onClick={() => triggerInput()}>
              &#9650;
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
            onClick={() => triggerMute()}>
              {devicesState[screenSelected].mute === 'off' &&
                <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z"></path><path d="M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z"></path><path d="M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z"></path></g></svg>
              }
               {devicesState[screenSelected].mute === 'on' &&
              <svg fill="#ffffff" viewBox="0 0 24 24" id="mute-2" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M17,3,10.16,8H6A1,1,0,0,0,5,9v6a1,1,0,0,0,1,1h4.16L17,21Z" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><line id="secondary" x1="3" y1="18.63" x2="21" y2="5.37" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line></g></svg>
                }
                </button>
        </div>
       <div className='controls-levels-element'>
          <span className='controls-levels-span'>
              ch
          </span>
        </div>
      </div>
      <div className='controls-levels-row'>
        <div className='controls-levels-element controls-levels-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-levels-button'
            onClick={() => triggerPower()}>
             &#9660;
          </button>
        </div> 
        {devicesState.hdmiSala.state === 'roku' &&
         <div className='controls-levels-element controls-levels-element--right'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-levels-button`}
            onClick={() => triggerInput()}>
              rewind
          </button>
        </div>
        }
        {
         devicesState.hdmiSala.state === 'cable' &&
         <div className='controls-levels-element controls-levels-element--right'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`controls-levels-button`}
            onClick={() => triggerInput()}>
              &#9660;
          </button>
        </div>  
        }
      </div>
    </div>
  )
}

export default Controls;
