import React from 'react';
import { useDev } from './useDev';
import './dev.css';

function Dev() {
    const {
        sendEnabledSt,
        wifiNameSt,
        networkTypeSt,
        leader,
        simulatePlayStateSt,
        onEnableSend,
        onWifiChange,
        onNetworkChange,
        onLeaderChange,
        onClose,
        onSimulatePlaystateChange
    } = useDev();

    return (
        <div className='dev'>
            <div className='dev-row'>
                <div className='dev-element dev-element--close'>
                    <button
                        onContextMenu={(e) => e.preventDefault()}
                        className={`dev-button`}
                        onClick={onClose}>
                        Close
                    </button>
                </div>
                <div className='dev-element dev-element--send'>
                    <button
                        onContextMenu={(e) => e.preventDefault()}
                        className={`dev-button`}
                        onClick={onEnableSend}>
                        Send To Roku and IFTTT: {sendEnabledSt ? 'On' : 'Off'}
                    </button>
                </div>
                <div className='dev-element dev-element--simulate-playstate'>
                    <button
                        onContextMenu={(e) => e.preventDefault()}
                        className={`dev-button`}
                        onClick={onSimulatePlaystateChange}>
                        Simulate Playstate: {simulatePlayStateSt ? 'On' : 'Off'}
                    </button>
                </div>
                <div className='dev-element dev-element--leader'>
                    <button
                        onContextMenu={(e) => e.preventDefault()}
                        className={`dev-button`}
                        onClick={onLeaderChange}>
                        Leader: {leader}
                    </button>
                </div>
                <div className='dev-element dev-element--wifi'>
                    <button
                        onContextMenu={(e) => e.preventDefault()}
                        className={`dev-button`}
                        onClick={onWifiChange}>
                        Wifi Selected: {wifiNameSt}
                    </button>
                </div>
                <div className='dev-element dev-element--network'>
                    <button
                        onContextMenu={(e) => e.preventDefault()}
                        className={`dev-button`}
                        onClick={onNetworkChange}>
                        Network Selected: {networkTypeSt}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dev;
