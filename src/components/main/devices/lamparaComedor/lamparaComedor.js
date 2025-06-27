import React from 'react';
import './lamparaComedor.css';

function LamparaComedor({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="lamparaComedor">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaComedor.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.lamparaComedor.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparacomedor.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaComedor;
