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
        requests.updateTable({ newId: device, newTable: 'devices', newState: 'on' });
      }
      setTimeout(() => {
        requests.sendIfttt({ device, key: 'color', value: value });
        requests.updateTable({ newId: device, newTable: 'devices', newColor: value });
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
              onTouchStart={(e) => utils.onTouchStart('white', e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('white', e, onShortClick, onLongClick)}>
            </button>
          </li>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--red ${element.color === 'red' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={(e) => utils.onTouchStart('red', e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('red', e, onShortClick, onLongClick)}>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LuzCuarto;
