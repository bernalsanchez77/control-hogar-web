import { useLuzCuarto } from './useLuzCuarto';
import './luzCuarto.css';

function LuzCuarto({ element }) {
  const { onTouchStart, onTouchMove, onTouchEnd } = useLuzCuarto(element);

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
