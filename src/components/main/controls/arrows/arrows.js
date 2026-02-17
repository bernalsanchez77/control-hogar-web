import { useArrows } from './useArrows';
import './arrows.css';

function Arrows() {
  const {
    leaderSt,
    userNameSt,
    userDeviceSt,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = useArrows();

  const isLeader = leaderSt === userNameSt + '-' + userDeviceSt;

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
              className={`controls-arrows-button controls-arrows-button--circle ${isLeader ? 'controls-arrows-button--leader' : ''}`}
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
