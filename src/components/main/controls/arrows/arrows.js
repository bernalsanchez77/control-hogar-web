
import requests from "../../../../global/requests";
import utils from '../../../../global/utils';
import { store } from '../../../../store/store';
import roku from '../../../../global/roku';
import { useTouch } from '../../../../hooks/useTouch';
import './arrows.css';

function Arrows() {
  const wifiNameSt = store(v => v.wifiNameSt);
  const leaderSt = store(v => v.leaderSt);
  const userNameSt = store(v => v.userNameSt);
  const userDeviceSt = store(v => v.userDeviceSt);
  const device = 'rokuSala';

  const onShortClick = (e, value) => {
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (wifiNameSt === 'Noky') {
      utils.triggerVibrate();
      requests.fetchRoku({ key: 'keypress', value: rokuValue });
      roku.updatePlayState(1000);
    } else {
      utils.triggerVibrate();
      requests.sendIfttt({ device, key: 'command', value });
    }
  }

  const onLongClick = (e, value) => {
  }

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

  return (
    <div className='controls-arrows'>
      <div className='controls-arrows-wrapper'>
        <div className='controls-arrows-row controls-arrows-row--top'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e, 'up')}>
              &#9650;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row'>
          <div className='controls-arrows-element controls-arrows-element--left'>
            <button
              className="controls-arrows-button control-arrows-button--left"
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e, 'left')}>
              &#9664;
            </button>
          </div>
          <div className='controls-arrows-element'>
            <button
              className={`controls-arrows-button controls-arrows-button--circle ${leaderSt === userNameSt + '-' + userDeviceSt ? 'controls-arrows-button--leader' : ''}`}
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e, 'select')}>
              ok
            </button>
          </div>
          <div className='controls-arrows-element controls-arrows-element--right'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e, 'right')}>
              &#9654;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row  controls-arrows-row--bottom'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e, 'down')}>
              &#9660;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arrows;
