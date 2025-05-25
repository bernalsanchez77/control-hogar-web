import React from 'react';
import './lamparaTurca.css';

function LamparaTurca({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="lamparaTurca">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaTurca.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.lamparaTurca.id)}>{devicesState.lamparaTurca.label}
        </button>
      </div>
    </div>
  );
}

export default LamparaTurca;
