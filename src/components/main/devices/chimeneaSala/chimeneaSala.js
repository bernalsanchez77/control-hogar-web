import React from 'react';
import './chimeneaSala.css';

function ChimeneaSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="chimenea">
      <div>
        <button
          className={`devices-button ${devicesState.chimeneaSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.chimeneaSala.id)}>
          <img
            className='devices-button-img'
            src={devicesState.chimeneaSala.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default ChimeneaSala;
