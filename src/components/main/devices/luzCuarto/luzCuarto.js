import {useRef} from 'react';
import './luzCuarto.css';

function LuzCuarto({devicesState, changeViewParent, changeControlParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }
  const changeControlStart = () => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 1000);
  }
  const changeControlEnd = (device) => {
    clearTimeout(timeout3s.current);
    if (longClick.current) {
      changeViewParent(device);
    } else {
      changeControl(device);
    }
    longClick.current = false;
  }

  return (
    <div className="luzCuarto">
      <div>
        <button
          className={`devices-button ${devicesState.luzCuarto.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControlStart(devicesState.luzCuarto.id)}
          onTouchEnd={() => changeControlEnd(devicesState.luzCuarto.id)}>
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
