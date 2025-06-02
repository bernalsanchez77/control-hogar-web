import React from 'react';
import './toolbar.css';

function Toolbar({devicesState, triggerControlParent}) {
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: devicesState.rokuSala.id, ifttt: devicesState.rokuSala.id}];
    if (value === 'play') {
      if (devicesState.rokuSala.state === 'play') {
        triggerControlParent(device, ['state'], ['pause'], true);
      } else {
        triggerControlParent(device, ['state'], ['play'], true);
      }
    } else {
      triggerControlParent(device, ['command'], [value], false);
    }

  }

  return (
    <div className='controls-toolbar'>
      <div className='controls-toolbar-row'>
        <div className='controls-toolbar-element controls-toolbar-element--left'>
          <button
            className='controls-toolbar-button'
            onTouchStart={() => triggerControl('rewind')}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/rewind-50.png"
              alt="icono">
            </img>
          </button>
        </div>
        <div className='controls-toolbar-element'>
            <button
                className={`controls-toolbar-button`}
                onTouchStart={() => triggerControl('play')}>
                {devicesState.rokuSala.state === 'play' &&
                <img
                  className='controls-toolbar-img controls-toolbar-img--button'
                  src="/imgs/pause-50.png"
                  alt="icono">
                </img>
                }
                {devicesState.rokuSala.state === 'pause' &&
                <img
                  className='controls-toolbar-img controls-toolbar-img--button'
                  src="/imgs/play-50.png"
                  alt="icono">
                </img>
                }
            </button>
        </div>
        <div className='controls-toolbar-element controls-toolbar-element--right'>
        <button
            className={'controls-toolbar-button'}
            onTouchStart={() => triggerControl('forward')}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/forward-50.png"
              alt="icono">
            </img>
        </button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
