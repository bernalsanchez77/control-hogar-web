import { useTouch } from '../../../../../hooks/useTouch';
import './luzCuarto.css';
import requests from '../../../../../global/requests';
import utils from '../../../../../global/utils';

function LuzCuarto({ element }) {
  const onShortClick = (e, value) => {
    utils.triggerVibrate();
    const device = element.id;
    if (element.state === 'off') {
      requests.sendIfttt({ device, key: 'state', value: 'on' });
      requests.updateTable({ id: device, table: 'devices', state: 'on' });
    }
    setTimeout(() => {
      requests.sendIfttt({ device, key: 'color', value: value });
      requests.updateTable({ id: device, table: 'devices', color: value });
    }, 1000);
  };

  const onLongClick = (e, value) => {
  }

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

  return (
    <div>
      <div className='controls-devices-luzcuarto'>
        <ul className='controls-devices-luzcuarto-ul'>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--white ${element.color === 'white' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e, 'white')}>
            </button>
          </li>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--red ${element.color === 'red' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e, 'red')}>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LuzCuarto;
