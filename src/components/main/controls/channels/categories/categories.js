import { useCategories } from './useCategories';
import './categories.css';

function Categories() {
  const {
    cableChannelCategories,
    selectedImg,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = useCategories();

  return (
    <div>
      <div className='controls-channels'>
        <div className='controls-channels-wrapper'>
          {cableChannelCategories.map((row, rowIndex) => (
            <div key={rowIndex} className={`controls-channels-row controls-channels-row--${['top', 'middle', 'bottom'][rowIndex]}`}>
              {row.map((item, colIndex) => {
                const position = ['left', 'center', 'right'][colIndex];
                if (item.isImage) {
                  return (
                    <div key={colIndex + 's'} className='controls-channels-element controls-channels-element--img'>
                      <img
                        className='controls-channels-img'
                        src={selectedImg}
                        alt='icono'>
                      </img>
                    </div>
                  );
                } else {
                  return (
                    <div key={colIndex} className={`controls-channels-element controls-channels-element--${position}`}>
                      <button className='controls-channels-elements-button'
                        onTouchStart={(e) => onTouchStart(e)}
                        onTouchMove={(e) => onTouchMove(e)}
                        onTouchEnd={(e) => onTouchEnd(e, item.categories)}>
                        {item.label}
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories;
