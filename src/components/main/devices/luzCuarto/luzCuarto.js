import React, {useRef} from 'react';
import './luzCuarto.css';

function LuzCuarto({devicesState, deviceState, triggerDeviceStateParent, triggerDeviceParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }
  const triggerDeviceStart = (device) => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
      if (navigator.vibrate) {
        navigator.vibrate([200]);
      }
    }, 1000);
  }
  const triggerDeviceEnd = (device) => {
    clearTimeout(timeout3s.current);
    if (longClick.current) {
      triggerDeviceStateParent('luzCuarto');
    } else {
      triggerDevice(device);
    }
    longClick.current = false;
  }

  return (
    <div className="luzCuarto">
      <div>
        <button
          className={`devices-button ${devicesState.luzCuarto.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDeviceStart(devicesState.luzCuarto.id)}
          onTouchEnd={() => triggerDeviceEnd(devicesState.luzCuarto.id)}>
          cuarto
        </button>
      </div>
    </div>
  );
}

export default LuzCuarto;
