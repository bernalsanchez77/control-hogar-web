import React from 'react';
import { useDev } from './useDev';
import './dev.css';

function Dev() {
  const {
    sendEnabledSt,
    wifiNameSt,
    onEnableSend,
    onWifiChange
  } = useDev();

  return (
    <div className='dev'>
      <div className='dev-row'>
        <div className='dev-element dev-element--send'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button ${sendEnabledSt ? "dev-button--on" : "dev-button-off"}`}
            onClick={onEnableSend}>
            Enable Changes
          </button>
        </div>
        <div className='dev-element dev-element--wifi'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={onWifiChange}>
            Wifi: {wifiNameSt}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
