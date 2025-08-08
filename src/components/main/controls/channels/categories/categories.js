import './categories.css';

function Categories({devicesState, cableChannels, cableChannelCategories, changeCategoryParent}) {
  let selectedImg = '/imgs/channels/' + devicesState.channelsSala.selected + '.png';
  const changeCategory = (category) => {
    changeCategoryParent(category);
  }

  return (
    <div>
      <div className='controls-channels'>
      <ul className='controls-channels-wrapper'>
        {
        cableChannelCategories.current.map((category, key) => (
        <li key={key} className='{`controls-channels-row ${key === 0 ? }`}'>

        </li>
        ))
        }  
      </ul>

{/*       
      <div className='controls-channels'>
        <div className='controls-channels-wrapper'>
        <div className='controls-channels-row controls-channels-row--top'>
          <div className='controls-channels-element  controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => changeCategory(['national'])}>
              Nacionales
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--center'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => changeCategory(['news'])}>
              Noticias
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => changeCategory(['sports'])}>
              Deportes
            </button>
          </div>
        </div>
        <div className='controls-channels-row controls-channels-row--middle'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => changeCategory(['science'])}>
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
              onTouchStart={() => changeCategory(['movies'])}>
              Peliculas
            </button>
          </div>
        </div>
        <div className='controls-channels-row controls-channels-row--bottom'>
          <div className='controls-channels-element controls-channels-element--left'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => changeCategory(['food', 'lifestyle'])}>
              Vida
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--center'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => changeCategory(['general'])}>
              General
            </button>
          </div>
          <div className='controls-channels-element controls-channels-element--right'>
            <button
              className='controls-channels-elements-button'
              onTouchStart={() => changeCategory(['children'])}>
              Infantiles
            </button>
          </div>
        </div>
        </div>
      </div> */}
      </div>
    </div>
  )
}

export default Categories;
