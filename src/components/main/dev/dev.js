import React from 'react';
import './dev.css';

function Dev({ iftttDisabled, channelsDisabled, changeDevParent }) {
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
            className={`dev-button`}
            onClick={() => changeDev('resetDevices')}>
            Reset Devices
          </button>
        </div>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button ${iftttDisabled.current ? "dev-button--on" : "dev-button-off"}`}
            onClick={() => changeDev('disableIfttt')}>
              Disable IFTTT
            </button>
        </div>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button ${channelsDisabled.current ? "dev-button--on" : "dev-button-off"}`}
            onClick={() => changeDev('disableChannels')}>
              Disable Channels
            </button>
        </div>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={() => changeDev('removeStorage')}>
              Remove Storage
            </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
