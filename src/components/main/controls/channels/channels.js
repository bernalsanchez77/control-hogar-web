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
          <div className='controls-channels-element'>
              Nacionales
          </div>
          <div className='controls-channels-element'>
              Noticias
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element'>
              Deportes
          </div>
          <div className='controls-channels-element'>
              <img
                  className='controls-channels-img'
                  src={selectedImg}
                  alt="icono">
              </img>
          </div>
          <div className='controls-channels-element'>
              Entretenimiento
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element'>
              Historia
          </div>
          <div className='controls-channels-element'>
              Peliculas y Series
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
