import './toolbar.css';

function Toolbar({rokuApps, changeControlParent}) {
  const app = rokuApps.find(app => app.state === 'selected');
  const changeControl = (value) => {
    const device = 'rokuSala';
    if (value === 'play') {
      if (app.playState === 'play') {
        changeControlParent({
          ifttt: [{device, key: 'state', value: 'pause'}],
          roku: [{device, key: 'keypress', value: 'Play'}]
        });
      } else {
        changeControlParent({
          ifttt: [{device, key: 'state', value: 'play'}],
          roku: [{device, key: 'keypress', value: 'Play'}]
        });
      }
    } else {
      changeControlParent({
        ifttt: [{device, key: 'command', value}],
        roku: [{device, key: 'keypress', value: value.charAt(0).toUpperCase() + value.slice(1)}],
        massMedia: []
      });
    }
  }

  return (
    <div className='controls-toolbar'>
      <div className='controls-toolbar-row'>
        <div className='controls-toolbar-element controls-toolbar-element--left'>
          <button
            className='controls-toolbar-button'
            onTouchStart={() => changeControl('rev')}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/rewind-50.png"
              alt="icono">
            </img>
          </button>
        </div>
        <div className='controls-toolbar-element'>
            <button
                className={`controls-toolbar-button`}
                onTouchStart={() => changeControl('play')}>
                {(app.playState === 'play' || app.playState === 'none' || app.playState === 'close') &&
                <img
                  className='controls-toolbar-img controls-toolbar-img--button'
                  src="/imgs/pause-50.png"
                  alt="icono">
                </img>
                }
                {app.playState === 'pause' &&
                <img
                  className='controls-toolbar-img controls-toolbar-img--button'
                  src="/imgs/play-50.png"
                  alt="icono">
                </img>
                }
            </button>
        </div>
        <div className='controls-toolbar-element controls-toolbar-element--right'>
        <button
            className={'controls-toolbar-button'}
            onTouchStart={() => changeControl('fwd')}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/forward-50.png"
              alt="icono">
            </img>
        </button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
