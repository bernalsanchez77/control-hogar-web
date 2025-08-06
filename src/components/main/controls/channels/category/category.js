import './category.css';

function Category({devicesState, category, changeControlParent}) {
  const changeControl = (channel) => {
    const device = 'channelsSala';
    changeControlParent({
      ifttt: [{device: device + devicesState.channelsSala.channels[channel].ifttt, key: 'selected', value: channel}],
      massMedia: [{device: device, key: 'selected', value: channel}],
    });
  }

  return (
    <div>
      <div className='controls-channels-categories'>
        <ul className='controls-channels-categories-ul'>
          {
            Object.entries(devicesState.channelsSala.channels).map(([key, channel]) => category.includes(channel.category) ? (
            <li key={key} className='controls-channels-category'>
              <button
                className={`controls-channels-category-button ${devicesState.channelsSala.selected === channel.id ? 'controls-channels-category-button--selected' : ''}`}
                onTouchStart={() => changeControl(channel.id)}>
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

export default Category;
