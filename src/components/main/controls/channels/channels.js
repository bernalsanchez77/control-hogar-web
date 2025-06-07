import React from 'react';
import './channels.css';

function Channels({devicesState, credential, channelCategory, triggerControlParent, triggerCategoryParent}) {
  let selectedImg = '/imgs/channels/' + devicesState.channelsSala.selected + '.png';
  const triggerCategory = (category) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    triggerCategoryParent(category);
  }
  const triggerChannel = (category) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    triggerControlParent(category);
  }

  return (
    <div>
      {channelCategory === 'default' &&
      <div className='controls-channels'>
        <div className='controls-channels-row'>
          <div className='controls-channels-element  controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory('national')}>
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
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button className='controls-channels-elements-button'>
              Gastronomia
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button className='controls-channels-elements-button'>
              Infantiles
            </button>
          </div>
        </div>
      </div>
      }
      {channelCategory !== 'default' &&
      <div className='controls-channels-categories'>
        <ul className='controls-channels-categories-ul'>
          {
            Object.entries(devicesState.channelsSala.channels).map(([key, channel]) => channel.category == channelCategory ? (
            <li key={key} className='controls-channels-category'>
              <button
                className='controls-channels-category-element'
                onTouchStart={() => triggerChannel(channel.id)}>
                <img
                  className='controls-channels-category-img'
                  src={channel.img}
                  alt="icono">
                </img>
              </button>
            </li>
            ) : null
            )
          }
        </ul>
      </div>
      }
    </div>
  )
}

export default Channels;
