import './luzCuarto.css';
import requests from '../../../../../global/requests';
import utils from '../../../../../global/utils';

function LuzCuarto({ element }) {
  const onDeviceColorClick = (color) => {
    utils.triggerVibrate();
    const device = element.id;
    if (element.state === 'off') {
      requests.sendIfttt({ device, key: 'state', value: 'on' });
    }
    setTimeout(() => {
      requests.sendIfttt({ device, key: 'color', value: color });
    }, 1000);
  };

  return (
    <div>
      <div className='controls-devices-luzcuarto'>
        <ul className='controls-devices-luzcuarto-ul'>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--white ${element.color === 'white' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={() => onDeviceColorClick('white')}>
            </button>
          </li>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--red ${element.color === 'red' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={() => onDeviceColorClick('red')}>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LuzCuarto;
