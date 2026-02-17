import { useTop } from './useTop';
import './top.css';

function Controls() {
  const {
    screen,
    viewSt,
    changePower,
    changeHdmi,
    changeInput
  } = useTop();


  return (
    <div className='controls-top'>
      <div className='controls-top-row'>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => changePower()}>
            {screen.state === 'on' &&
              <img
                className='controls-top-img controls-top-img--button'
                src="/imgs/power-on-50.png"
                alt="icono">
              </img>
            }
            {screen.state === 'off' &&
              <img
                className='controls-top-img controls-top-img--button'
                src="/imgs/power-off-50.png"
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className="controls-top-button controls-top-button-off"
            onTouchStart={() => changeHdmi()}>
            {viewSt.selected === 'cable' &&
              <img
                className='controls-top-img controls-top-img--roku'
                src='/imgs/roku.png'
                alt="icono">
              </img>
            }
            {viewSt.selected === 'roku' &&
              <img
                className='controls-top-img controls-top-img--telecable'
                src='/imgs/telecable.png'
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => changeInput()}>
            {screen.inputLabel1}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
