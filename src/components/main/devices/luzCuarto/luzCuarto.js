import React, {useRef} from 'react';
import './luzCuarto.css';

function LuzCuarto({devicesState, triggerDeviceStateParent, triggerControlParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }
  const triggerDeviceStart = () => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
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
          <img
            className='devices-button-img'
            src={devicesState.luzCuarto.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LuzCuarto;
