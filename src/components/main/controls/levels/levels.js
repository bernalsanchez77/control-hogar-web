import { useLevels } from './useLevels';
import utils from '../../../../global/utils';
import './levels.css';

function Levels() {
  const {
    screen,
    viewSt,
    onMuteShortClick,
    onMuteLongClick,
    onOptionsShortClick,
    onChannelShortClick,
    changeVolumeStart,
    changeVolumeEnd
  } = useLevels();


  return (
    <div className='controls-levels'>
      <div className='controls-levels-wrapper'>
        <div className='controls-levels-row controls-levels-row--top'>
          <div className='controls-levels-element controls-levels-element--left'>
            <button
              className='controls-levels-button'
              onTouchStart={(e) => changeVolumeStart(e, 'up')}
              onTouchEnd={(e) => changeVolumeEnd(e, 'up')}>
              &#9650;
            </button>
          </div>
          <div className='controls-levels-element controls-levels-element--mute-icon'>
            <button
              className="controls-levels-button controls-levels-button--img"
              onTouchStart={(e) => utils.onTouchStart('mute', e, onMuteShortClick)}
              onTouchEnd={(e) => utils.onTouchEnd('mute', e, onMuteShortClick, onMuteLongClick)}>
              {screen.mute === 'off' &&
                <img
                  className='controls-levels-img controls-levels-img--no-button'
                  src="/imgs/sound-50.png"
                  alt="icono">
                </img>
              }
              {screen.mute === 'on' &&
                <img
                  className='controls-levels-img controls-levels-img--no-button'
                  src="/imgs/mute-50.png"
                  alt="icono">
                </img>
              }
            </button>
          </div>
          {
            viewSt.selected === 'roku' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={`controls-levels-button`}
                onTouchStart={() => onOptionsShortClick('back')}>
                <img
                  className='controls-levels-img controls-levels-img--button'
                  src="/imgs/back-50.png"
                  alt="icono">
                </img>
              </button>
            </div>
          }
          {
            viewSt.selected === 'cable' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={'controls-levels-button'}
                onTouchStart={() => onChannelShortClick('up')}>
                &#9650;
              </button>
            </div>
          }
        </div>
        <div className='controls-levels-row controls-levels-row--middle'>
          <div className='controls-levels-element controls-levels-element--no-margin'>
            <span className='controls-levels-span'>
              vol {screen.volume}
            </span>
          </div>
          <div className='controls-levels-element controls-levels-element--right controls-levels-element--no-margin'>
            <span className='controls-levels-span'>
              {viewSt.selected === 'roku' &&
                'op'
              }
              {viewSt.selected === 'cable' &&
                'ch'
              }
            </span>
          </div>
        </div>
        <div className='controls-levels-row controls-levels-row--bottom'>
          <div className='controls-levels-element controls-levels-element--left'>
            <button
              className='controls-levels-button'
              onTouchStart={(e) => changeVolumeStart(e, 'down')}
              onTouchEnd={(e) => changeVolumeEnd(e, 'down')}>
              &#9660;
            </button>
          </div>
          <div className='controls-levels-element controls-levels-element--back'>
          </div>
          {
            viewSt.selected === 'roku' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={`controls-levels-button`}
                onTouchStart={() => onOptionsShortClick('info')}>
                <img
                  className='controls-levels-img controls-levels-img--button'
                  src="/imgs/asterisk-24.png"
                  alt="icono">
                </img>
              </button>
            </div>
          }
          {
            viewSt.selected === 'cable' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={`controls-levels-button`}
                onTouchStart={() => onChannelShortClick('down')}>
                &#9660;
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Levels;
