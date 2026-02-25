import React from 'react';
import { useDev } from './useDev';
import './dev.css';

function Dev() {
  const {
    sendEnabledSt,
    wifiNameSt,
    networkTypeSt,
    leaderSt,
    onEnableSend,
    onWifiChange,
    onNetworkChange,
    onLeaderChange
  } = useDev();

  return (
    <div className='dev'>
      <div className='dev-row'>
        <div className='dev-element dev-element--send'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={onEnableSend}>
            Send: {sendEnabledSt ? 'On' : 'Off'}
          </button>
        </div>
        <div className='dev-element dev-element--leader'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={onLeaderChange}>
            Leader: {leaderSt}
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
        <div className='dev-element dev-element--network'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={onNetworkChange}>
            Network: {networkTypeSt}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
