import React from 'react';
import './channels.css';

function Channels({devicesState, credential, channelCategory, deviceState, triggerControlParent, triggerDeviceStateParent, triggerCategoryParent}) {
  let selectedImg = '/imgs/channels/' + devicesState.channelsSala.selected + '.png';
  const triggerCategory = (category) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    triggerCategoryParent(category);
  }

  const triggerChannel = (channel) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: 'channelsSala', ifttt: 'channelsSala'}];
    device[0].ifttt = device[0].ifttt + devicesState.channelsSala.channels[channel].ifttt;
    triggerControlParent(device, ['selected'], [channel], true);
  }

  const triggerDevice = (device) => {

  }

  return (
    <div>
      {channelCategory.includes('default') && deviceState == 'default' &&
      <div className='controls-channels'>
        <div className='controls-channels-row'>
          <div className='controls-channels-element  controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['national'])}>
              Nacionales
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['news'])}>
              Noticias
            </button>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['sports'])}>
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
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['general'])}>
              General
            </button>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['science'])}>
              Ciencia y Historia
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['movies'])}>
              Peliculas y Series
            </button>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['food', 'lifestyle'])}>
              Gastronomia y Vida
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['children'])}>
              Infantiles
            </button>
          </div>
        </div>
      </div>
      }
      {!channelCategory.includes('default') && deviceState == 'default' &&
      <div className='controls-channels-categories'>
        <ul className='controls-channels-categories-ul'>
          {
            Object.entries(devicesState.channelsSala.channels).map(([key, channel]) => channelCategory.includes(channel.category) ? (
            <li key={key} className='controls-channels-category'>
              <button
                className={`controls-channels-category-button ${devicesState.channelsSala.selected === channel.id ? 'controls-channels-category-button--selected' : ''}`}
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
      {deviceState == 'luzCuarto' &&
      <div className='controls-channels-devices'>
        <ul className='controls-channels-devices-ul'>
          <li className='controls-channels-device'>
              <button
                className='controls-channels-device-button controls-channels-device-button--white'
                onTouchStart={() => triggerDevice('white')}>
              </button>
          </li>
          <li className='controls-channels-device'>
              <button
                className='controls-channels-device-button controls-channels-device-button--red'
                onTouchStart={() => triggerDevice('red')}>
              </button>
          </li>
        </ul>
      </div>
      }
    </div>
  )
}

export default Channels;
