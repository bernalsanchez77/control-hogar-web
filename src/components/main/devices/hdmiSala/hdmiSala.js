import React from 'react';
import './hdmiSala.css';

function HdmiSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'roku') {
      triggerDeviceParent([device], ['state'], ['cable']);
    }
    if (devicesState[device].state === 'cable') {
      triggerDeviceParent([device], ['state'], ['roku']);
    }
  }

  return (
    <div className="hdmiSala">
      <div>
        <button
          className="devices-button devices-button-off"
          onTouchStart={() => triggerDevice(devicesState.hdmiSala.id)}>{devicesState.hdmiSala.label[devicesState.hdmiSala.state]}
        </button>
      </div>
    </div>
  );
}

export default HdmiSala;
