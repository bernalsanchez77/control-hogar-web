
import requests from "../../../../global/requests";
import utils from '../../../../global/utils';
import './arrows.css';

function Arrows() {
  const changeControl = (value) => {
    utils.triggerVibrate();
    requests.sendIfttt({ device: 'rokuSala', value: value });
    requests.fetchRoku({ key: 'keypress', value: value.charAt(0).toUpperCase() + value.slice(1) });
  }

  return (
    <div className='controls-arrows'>
      <div className='controls-arrows-wrapper'>
        <div className='controls-arrows-row controls-arrows-row--top'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={() => changeControl('up')}>
              &#9650;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row'>
          <div className='controls-arrows-element controls-arrows-element--left'>
            <button
              className="controls-arrows-button control-arrows-button--left"
              onTouchStart={() => changeControl('left')}>
              &#9664;
            </button>
          </div>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button controls-arrows-button--circle"
              onTouchStart={() => changeControl('select')}>
              ok
            </button>
          </div>
          <div className='controls-arrows-element controls-arrows-element--right'>
            <button
              className="controls-arrows-button"
              onTouchStart={() => changeControl('right')}>
              &#9654;
            </button>
          </div>
        </div>
        <div className='controls-arrows-row  controls-arrows-row--bottom'>
          <div className='controls-arrows-element'>
            <button
              className="controls-arrows-button"
              onTouchStart={() => changeControl('down')}>
              &#9660;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arrows;
