import './toolbar.css';

function Toolbar({devicesState, triggerControlParent, triggerControlParent2}) {
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: devicesState.rokuSala.id, ifttt: devicesState.rokuSala.id}];
    if (value === 'play') {
      if (devicesState.rokuSala.state === 'play') {
        triggerControlParent2(
          [
            {[devicesState.rokuSala.id]:
              [
                {
                  key: 'state',
                  value: 'pause'
                }
              ]
            }
          ],
          [
            {[devicesState.rokuSala.id]:
              [
                {
                  key: 'keypress',
                  value: 'Play'

                }
              ]
            }
          ],
          [
            {[devicesState.rokuSala.id]:
              [
                {
                  key: ['state'],
                  value: 'pause'
                }
              ]
            }
          ]
        );
      } else {
        triggerControlParent2(
          [
            {[devicesState.rokuSala.id]:
              [
                {
                  key: 'state',
                  value: 'play'
                }
              ]
            }
          ],
          [
            {[devicesState.rokuSala.id]:
              [
                {
                  key: 'keypress',
                  value: 'Play'
                }
              ]
            }
          ],
          [
            {[devicesState.rokuSala.id]:
              [
                {
                  key: ['state'],
                  value: 'play'
                }
              ]
            }
          ]
        );
      }
    } else {
      triggerControlParent(device, ['keypress'], [value], false);
    }

  }

  return (
    <div className='controls-toolbar'>
      <div className='controls-toolbar-row'>
        <div className='controls-toolbar-element controls-toolbar-element--left'>
          <button
            className='controls-toolbar-button'
            onTouchStart={() => triggerControl('rev')}>
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
                onTouchStart={() => triggerControl('play')}>
                {devicesState.rokuSala.state === 'play' &&
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
            onTouchStart={() => triggerControl('fwd')}>
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
