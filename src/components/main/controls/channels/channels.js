import React, { useState } from 'react';
import './channels.css';

function Channels({devicesState, credential, triggerControlParent}) {
  const [view, setView] = useState('default');
  let selectedImg = '/imgs/channels/' + devicesState.channelsSala.selected + '.png';
  const triggerCategory = (category) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    setView(category);
  }

  return (
    <div>
      {view === 'default' &&
      <div className='controls-channels'>
        <div className='controls-channels-row'>
          <div className='controls-channels-element  controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory('nationals')}>
              Nacionales
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button className='controls-channels-elements-button'>
              Noticias
            </button>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button className='controls-channels-elements-button controls-channels-elements-button--tall'>
              Deportes
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--img'>
              <img
                  className='controls-channels-img'
                  src={selectedImg}
                  alt="icono">
              </img>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button className='controls-channels-elements-button controls-channels-elements-button--tall'>
              Entretenimiento
            </button>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button className='controls-channels-elements-button'>
              Ciencia y Historia
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button className='controls-channels-elements-button'>
              Peliculas y Series
            </button>
          </div>
        </div>
      </div>
      }
      {view = 'nationals' &&
      <div>
        bernalito
      </div>
      }
    </div>
  )
}

export default Channels;
