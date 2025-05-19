import React from 'react';
import './toolbar.css';

function Toolbar({ devicesState, triggerControlParent }) {
  const triggerControl = (value) => {
    navigator.vibrate([200]);
    if (value === 'play') {
      if (devicesState.rokuSala.state === 'play') {
        triggerControlParent([devicesState.rokuSala.id], ['state'], ['pause']);
      } else {
        triggerControlParent([devicesState.rokuSala.id], ['state'], ['play']);
      }
    } else {
      triggerControlParent([devicesState.rokuSala.id], ['command'], [value], false);
    }

  }

  return (
    <div className='controls-toolbar-levels'>
      <div className='controls-toolbar-levels-row'>
        <div className='controls-toolbar-levels-element controls-toolbar-levels-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='controls-toolbar-levels-button'
            onClick={() => triggerControl('rewind')}>
            &#x23ee;
          </button>
        </div>
        <div className='controls-toolbar-levels-element'>
            <button
                onContextMenu={(e) => e.preventDefault()}
                className={`controls-toolbar-levels-button`}
                onClick={() => triggerControl('play')}>
                {devicesState.rokuSala.state === 'play' &&
                <img
                  className='controls-toolbar-levels-img controls-toolbar-levels-img--button'
                  src="/imgs/pause-50.png"
                  alt="icono">
                </img>
                }
                {devicesState.rokuSala.state === 'pause' &&
                <img
                  className='controls-toolbar-levels-img controls-toolbar-levels-img--button'
                  src="/imgs/play-50.png"
                  alt="icono">
                </img>
                }
            </button>
        </div>
        <div className='controls-toolbar-levels-element controls-toolbar-levels-element--right'>
        <button
            onContextMenu={(e) => e.preventDefault()}
            className={'controls-toolbar-levels-button'}
            onClick={() => triggerControl('forward')}>
            &#x23ed;
        </button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
