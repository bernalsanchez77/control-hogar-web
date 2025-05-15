
import React from 'react';
import './arrows.css';

function Controls({devicesState, screenSelected, triggerControlParent}) {
  const triggerControl = (value) => {
    navigator.vibrate([200]);
    const device = 'rokuSala';
    triggerControlParent([device], ['command'], value, false);
  }

  return (
    <div className='controls-arrows'>
      <div className='controls-arrows-row controls-arrows-row--one'>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button"
            onClick={() => triggerControl('up')}>
              arriba
          </button>
        </div>
      </div>
      <div className='controls-arrows-row'>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button control-arrows-button--left"
            onClick={() => triggerControl('left')}>
              izquierda
          </button>
        </div>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button controls-arrows-button--circle"
            onClick={() => triggerControl('enter')}>
              enter
          </button>
        </div>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button control-arrows-button--right"
            onClick={() => triggerControl('right')}>
              derecha
          </button>
        </div>
      </div>
      <div className='controls-arrows-row  controls-arrows-row--one'>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button"
            onClick={() => triggerControl('down')}>
              abajo
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
