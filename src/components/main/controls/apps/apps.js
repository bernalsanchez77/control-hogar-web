

import React from 'react';
import './apps.css';

function Apps({devicesState, screenSelected, triggerControlParent}) {
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = 'rokuSala';
    // triggerControlParent([device], ['command'], [value], false);
  }

  return (
    <div className='controls-apps'>
      <div className='controls-apps-row'>
        <div className='controls-apps-element'>
          <button
            className="controls-apps-button"
            onTouchStart={() => triggerControl('netflix')}>
              Netflix
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className="controls-apps-button"
            onTouchStart={() => triggerControl('disney')}>
              Disney
          </button>
        </div>
        <div className='controls-apps-element'>
          <button
            className="controls-apps-button"
            onTouchStart={() => triggerControl('youtube')}>
              Youtube
          </button>
        </div>
      </div>
    </div>
  )
}

export default Apps;
