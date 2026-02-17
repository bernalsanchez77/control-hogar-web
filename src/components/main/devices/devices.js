import { useDevices } from './useDevices';
import './devices.css';

function Devices() {
  const {
    allDevices,
    userTypeSt,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = useDevices();

  return (
    <div className="devices">
      <ul className='devices-ul'>
        {
          allDevices.filter(device => device.order !== 0).sort((a, b) => a.order - b.order).map((device, key) => (
            (userTypeSt === 'owner' || userTypeSt === 'dev' || device.public) &&
            <li key={key} className='devices-element'>
              <button
                className={`devices-button ${device.state === 'on' || (device.id === 'lamparasAbajo' && device.state === 'on') ? "devices-button--on" : "devices-button-off"}`}
                onTouchStart={(e) => onTouchStart(e)}
                onTouchEnd={(e) => onTouchEnd(e, device)}
                onTouchMove={(e) => onTouchMove(e)}>
                <img
                  className='devices-button-img'
                  src={device.img}
                  alt="icono">
                </img>
                <div className='devices-led'></div>
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default Devices;
