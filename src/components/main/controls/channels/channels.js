import React from 'react';
import './channels.css';

function Channels({devicesState, credential, triggerControlParent}) {
  let selectedImg = '/imgs/channels/' + devicesState.cableSala.selected + '.png';
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    if (value === 'play') {
      if (devicesState.rokuSala.state === 'play') {
        triggerControlParent([devicesState.rokuSala.id], ['state'], ['pause'], true);
      } else {
        triggerControlParent([devicesState.rokuSala.id], ['state'], ['play'], true);
      }
    } else {
      triggerControlParent([devicesState.rokuSala.id], ['command'], [value], false);
    }
  }

  return (
    <div>
      {credential === 'dev' &&
      <div className='controls-channels'>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <p className='controls-channels-elements-paragraph controls-channels-elements-paragraph--right'>
              Nacionales
            </p>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <p className='controls-channels-elements-paragraph controls-channels-elements-paragraph-left'>
              Noticias
            </p>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <p className='controls-channels-elements-paragraph controls-channels-elements-paragraph--right'>
              Deportes
            </p>
          </div>
          <div className='controls-channels-element controls-channels-element--img'>
              <img
                  className='controls-channels-img'
                  src={selectedImg}
                  alt="icono">
              </img>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <p className='controls-channels-elements-paragraph controls-channels-elements-paragraph--left'>
              Entretenimiento
            </p>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <p className='controls-channels-elements-paragraph controls-channels-elements-paragraph--right'>
              Historia
            </p>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <p className='controls-channels-elements-paragraph controls-channels-elements-paragraph--left'>
              Peliculas y Series
            </p>
          </div>
        </div>
      </div>
      }
      {credential !== 'dev' &&
      <div className='controls-channels'>
        <div className='controls-channels-row'>
          <div className='controls-channels-element'>
              <img
                  className='controls-channels-img'
                  src={selectedImg}
                  alt="icono">
              </img>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default Channels;
