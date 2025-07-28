import React from 'react';
import './lamparaTurca.css';

function LamparaTurca({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaTurca">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaTurca.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.lamparaTurca.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaTurca.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaTurca;
