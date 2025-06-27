import React from 'react';
import './lamparaRotatoria.css';

function LamparaRotatoria({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="lamparaRotatoria">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaRotatoria.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.lamparaRotatoria.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaRotatoria.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaRotatoria;
