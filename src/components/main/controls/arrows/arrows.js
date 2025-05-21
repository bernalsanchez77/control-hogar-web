
import React from 'react';
import './arrows.css';

function Controls({devicesState, screenSelected, triggerControlParent}) {
  const triggerControl = (value) => {
    navigator.vibrate([200]);
    const device = 'rokuSala';
    triggerControlParent([device], ['command'], [value], false);
  }

  return (
    <div className='controls-arrows'>
      <div className='controls-arrows-row controls-arrows-row--one'>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button"
            onClick={() => triggerControl('up')}>
              &#9650;
          </button>
        </div>
      </div>
      <div className='controls-arrows-row'>
        <div className='controls-arrows-element controls-arrows-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button control-arrows-button--left"
            onClick={() => triggerControl('left')}>
              &#9664;
          </button>
        </div>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button controls-arrows-button--circle"
            onClick={() => triggerControl('enter')}>
              ok
          </button>
        </div>
        <div className='controls-arrows-element controls-arrows-element--right'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button"
            onClick={() => triggerControl('right')}>
              &#9654;
          </button>
        </div>
      </div>
      <div className='controls-arrows-row  controls-arrows-row--one'>
        <div className='controls-arrows-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className="controls-arrows-button"
            onClick={() => triggerControl('down')}>
              &#9660;
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
