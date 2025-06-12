import React, {useRef} from 'react';
import './luzCuarto.css';

function LuzCuarto({devicesState, triggerDeviceParent}) {
  const timeout3s = useRef(null);
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }
  const triggerDeviceStart = (device) => {
    triggerDevice(device);
    timeout3s.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate([200]);
      }
      alert('ojo');
    }, 1000);
  }

  return (
    <div className="luzCuarto">
      <div>
        <button
          className={`devices-button ${devicesState.luzCuarto.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDeviceStart(devicesState.luzCuarto.id)}
          onTouchEnd={() => triggerDeviceEnd(devicesState.luzCuarto.id)}>
          {devicesState.luzCuarto.label}
        </button>
      </div>
    </div>
  );
}

export default LuzCuarto;
