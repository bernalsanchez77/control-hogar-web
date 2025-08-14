import {useRef} from 'react';
import './luzCuarto.css';

function LuzCuarto({element, changeViewParent, changeControlParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const changeControl = (device) => {
    if (element.state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (element.state === 'off') {
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
