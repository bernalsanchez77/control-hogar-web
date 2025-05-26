

import React from 'react';
import './apps.css';

function Apps({devicesState, screenSelected, triggerControlParent}) {
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = 'rokuSala';
    triggerControlParent([device], ['app'], [value]);
  }

  return (
    <div className='controls-apps'>
      <div className='controls-apps-row'>

      </div>
    </div>
  )
}

export default Apps;
