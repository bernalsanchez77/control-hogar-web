import React from 'react';
import './lamparaSala.css';

function LamparaSala({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaSala">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.lamparaSala.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaSala.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaSala;
