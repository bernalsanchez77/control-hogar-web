import React from 'react';
import './channelCategory.css';

function ChannelCategory({devicesState, channelCategory, triggerControlParent}) {
  const triggerChannel = (channel) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = 'channelsSala';
    triggerControlParent({
      ifttt: [[{device: device + devicesState.channelsSala.channels[channel].ifttt, key: 'selected', value: channel}]],
      massMedia: [[{device: device, key: 'selected', value: channel}]],
    });
  }

  return (
    <div>
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
    </div>
  )
}

export default ChannelCategory;
