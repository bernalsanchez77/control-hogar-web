
import requests from "../../../../global/requests";
import utils from '../../../../global/utils';
import { store } from '../../../../store/store';
import roku from '../../../../global/roku';
import './arrows.css';

function Arrows() {
  const wifiNameSt = store(v => v.wifiNameSt);
  const leaderSt = store(v => v.leaderSt)
  const userNameSt = store(v => v.userNameSt)
  const device = 'rokuSala';

  const onShortClick = (keyup, value) => {
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (keyup) {
      if (wifiNameSt === 'Noky') {
        utils.triggerVibrate();
        requests.fetchRoku({ key: 'keypress', value: rokuValue });
        roku.updatePlayState(1000);
      } else {
        utils.triggerVibrate();
        requests.sendIfttt({ device, key: 'command', value });
      }
    }
  }

  const onLongClick = (value) => {
  }

  return (
    <div className='controls-arrows'>
      <div className='controls-arrows-wrapper'>
        <div className='controls-arrows-row controls-arrows-row--top'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => utils.onTouchStart('up', e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('up', e, onShortClick, onLongClick)}>
              &#9650;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row'>
          <div className='controls-arrows-element controls-arrows-element--left'>
            <button
              className="controls-arrows-button control-arrows-button--left"
              onTouchStart={(e) => utils.onTouchStart('left', e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('left', e, onShortClick, onLongClick)}>
              &#9664;
            </button>
          </div>
          <div className='controls-arrows-element'>
            <button
              className={`controls-arrows-button controls-arrows-button--circle ${leaderSt === userNameSt ? 'controls-arrows-button--leader' : ''}`}
              onTouchStart={(e) => utils.onTouchStart('select', e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('select', e, onShortClick, onLongClick)}>
              ok
            </button>
          </div>
          <div className='controls-arrows-element controls-arrows-element--right'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => utils.onTouchStart('right', e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('right', e, onShortClick, onLongClick)}>
              &#9654;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row  controls-arrows-row--bottom'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => utils.onTouchStart('down', e, onShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('down', e, onShortClick, onLongClick)}>
              &#9660;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arrows;
