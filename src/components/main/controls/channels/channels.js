import React from 'react';
import './channels.css';

function Channels({devicesState, credential, triggerControlParent}) {
  // let selectedImg = '/imgs/channels/' + devicesState.channelsSala.selected + '.png';
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: devicesState.rokuSala.id, ifttt: devicesState.rokuSala.id}];
    if (value === 'play') {
      if (devicesState.rokuSala.state === 'play') {
        triggerControlParent(device, ['state'], ['pause'], true);
      } else {
        triggerControlParent(device, ['state'], ['play'], true);
      }
    } else {
      triggerControlParent(device, ['command'], [value], false);
    }
  }

  return (
    <div>
      <div className='controls-channels'>
        <div className='controls-channels-row'>
          <div className='controls-channels-element  controls-channels-element--left'>
            <button className='controls-channels-elements-button'>
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
    </div>
  )
}

export default Channels;
