
import requests from "../../../../global/requests";
import utils from '../../../../global/utils';
import { store } from '../../../../store/store';
import roku from '../../../../global/roku';
import './arrows.css';

function Arrows() {
  const wifiNameSt = store(v => v.wifiNameSt);
  const device = 'rokuSala';

  const onShortClick = (keyup, value) => {
    if (keyup) {
      if (wifiNameSt === 'Noky') {
        utils.triggerVibrate();
        requests.fetchRoku({ key: 'keypress', value: value.charAt(0).toUpperCase() + value.slice(1) });
        roku.updatePlayState(1000);
      } else {
        utils.triggerVibrate();
        requests.sendIfttt({ device, key: 'command', value });
      }
    }
  }

  const onLongClick = (value) => {
  }

  const onTouchStart = (value, e) => {
    utils.onTouchStart(value, e, onShortClick);
  }

  const onTouchEnd = (value, e) => {
    utils.onTouchEnd(value, e, onShortClick, onLongClick);
  }


  return (
    <div className='controls-arrows'>
      <div className='controls-arrows-wrapper'>
        <div className='controls-arrows-row controls-arrows-row--top'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => onTouchStart('up', e)}
              onTouchEnd={(e) => onTouchEnd('up', e)}>
              &#9650;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row'>
          <div className='controls-arrows-element controls-arrows-element--left'>
            <button
              className="controls-arrows-button control-arrows-button--left"
              onTouchStart={(e) => onTouchStart('left', e)}
              onTouchEnd={(e) => onTouchEnd('left', e)}>
              &#9664;
            </button>
          </div>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button controls-arrows-button--circle"
              onTouchStart={(e) => onTouchStart('select', e)}
              onTouchEnd={(e) => onTouchEnd('select', e)}>
              ok
            </button>
          </div>
          <div className='controls-arrows-element controls-arrows-element--right'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => onTouchStart('right', e)}
              onTouchEnd={(e) => onTouchEnd('right', e)}>
              &#9654;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row  controls-arrows-row--bottom'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={(e) => onTouchStart('down', e)}
              onTouchEnd={(e) => onTouchEnd('down', e)}>
              &#9660;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arrows;
