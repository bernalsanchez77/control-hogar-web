import React from 'react';
import './lamparasAbajo.css';

function LamparasAbajo({devicesState, triggerDeviceParent}) {
  setState();
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'on');
    }
  }

  const setState = () => {
    console.log('test');
  }

  const getLamparasAbajoState = () => {
    return devicesState.lamparaSala.state === "on" &&
      devicesState.lamparaComedor.state === "on";
  }

  return (
    <div className="lamparasAbajo">
      <div>
        <button className={`devices-button ${getLamparasAbajoState() ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice()}>Lamparas Abajo</button>
      </div>
    </div>
  );
}

export default LamparasAbajo;
