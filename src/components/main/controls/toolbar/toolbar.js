import './toolbar.css';

function Toolbar({devicesState, changeControlParent}) {
  const changeControl = (value) => {
    const device = devicesState.rokuSala.id;
    if (value === 'play') {
      if (devicesState.rokuSala.state === 'play') {
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
                {(devicesState.rokuSala.state === 'play' || devicesState.rokuSala.state === 'none' || devicesState.rokuSala.state === 'close') &&
                <img
                  className='controls-toolbar-img controls-toolbar-img--button'
                  src="/imgs/pause-50.png"
                  alt="icono">
                </img>
                }
                {devicesState.rokuSala.state === 'pause' &&
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
