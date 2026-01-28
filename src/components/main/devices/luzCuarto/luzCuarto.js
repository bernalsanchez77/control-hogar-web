import { useRef } from 'react';
import './luzCuarto.css';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';

function LuzCuarto({ element, changeViewParent }) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const changeControl = (device) => {
    utils.triggerVibrate();
    if (element.state === 'on') {
      requests.sendIfttt({ device, key: 'state', value: 'off' });
      requests.updateTable({ id: device, table: 'devices', state: 'off' });
    }
    if (element.state === 'off') {
      requests.sendIfttt({ device, key: 'state', value: 'on' });
      requests.updateTable({ id: device, table: 'devices', state: 'on' });
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
          className={`devices-button ${element.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControlStart(element.id)}
          onTouchEnd={() => changeControlEnd(element.id)}>
          <img
            className='devices-button-img'
            src={element.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LuzCuarto;
