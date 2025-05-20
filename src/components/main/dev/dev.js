import React from 'react';
import './dev.css';

function Dev({ changeDevParent }) {
  const changeDev = (fn) => {
    navigator.vibrate([200]);
    changeDevParent(fn);
  }

  return (
    <div className='dev'>
      <div className='dev-row'>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='dev-button'
            onClick={() => changeDev('resetDevices')}>
            Reset Devices
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
