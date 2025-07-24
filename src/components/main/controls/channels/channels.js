import './channels.css';

function Channels({devicesState, triggerCategoryParent}) {
  let selectedImg = '/imgs/channels/' + devicesState.channelsSala.selected + '.png';
  const triggerCategory = (category) => {
    triggerCategoryParent(category);
  }

  return (
    <div>
      <div className='controls-channels'>
        <div className='controls-channels-row'>
          <div className='controls-channels-element  controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['national'])}>
              Nacionales
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--center'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['news'])}>
              Noticias
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['sports'])}>
              Deportes
            </button>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['science'])}>
              Ciencia
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
              onTouchStart={() => triggerCategory(['movies'])}>
              Peliculas
            </button>
          </div>
        </div>
        <div className='controls-channels-row'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['food', 'lifestyle'])}>
              Vida
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--center'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => triggerCategory(['general'])}>
              General
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
    </div>
  )
}

export default Channels;
