import './luzCuarto.css';
import requests from '../../../../../global/requests';
import utils from '../../../../../global/utils';

function LuzCuarto({ element }) {
  const onShortClick = (keyup, value) => {
    if (keyup) {
      utils.triggerVibrate();
      const device = element.id;
      if (element.state === 'off') {
        requests.sendIfttt({ device, key: 'state', value: 'on' });
      }
      setTimeout(() => {
        requests.sendIfttt({ device, key: 'color', value: value });
      }, 1000);
    }
  };

  const onLongClick = (value) => {
  }

  return (
    <div>
      <div className='controls-devices-luzcuarto'>
        <ul className='controls-devices-luzcuarto-ul'>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--white ${element.color === 'white' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={(e) => utils.onTouchStart(element.id, e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd(element.id, e, onShortClick, onLongClick)}>
            </button>
          </li>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--red ${element.color === 'red' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={(e) => utils.onTouchStart(element.id, e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd(element.id, e, onShortClick, onLongClick)}>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LuzCuarto;
