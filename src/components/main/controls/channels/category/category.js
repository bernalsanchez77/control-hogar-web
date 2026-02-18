import { useCategory } from './useCategory';
import './category.css';

function Category() {
  const {
    category,
    cableChannelsSt,
    cableChannelsSelectedId,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = useCategory();

  return (
    <div>
      <div className='controls-channels-categories'>
        <ul className='controls-channels-categories-ul'>
          {
            cableChannelsSt.map((channel, key) => category.includes(channel.category) ? (
              <li key={key} className='controls-channels-category'>
                <button
                  className={`controls-channels-category-button ${cableChannelsSelectedId === channel.id ? 'controls-channels-category-button--selected' : ''}`}
                  onTouchStart={(e) => onTouchStart(e)}
                  onTouchMove={(e) => onTouchMove(e)}
                  onTouchEnd={(e) => onTouchEnd(e, channel.id)}>
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
