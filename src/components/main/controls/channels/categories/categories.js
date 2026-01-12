import { store } from "../../../../../store/store";
import CableChannelCategories from '../../../../../global/cable-channel-categories';
import utils from '../../../../../global/utils';
import viewRouter from '../../../../../global/view-router';
import './categories.css';

function Categories() {
  const cableChannelCategories = new CableChannelCategories().getCableChannelCategories();
  const cableChannelsSt = store(v => v.cableChannelsSt);
  let selectedImg = '/imgs/channels/' + cableChannelsSt.find(ch => ch.state === 'selected')?.id + '.png';
  const viewSt = store(v => v.viewSt);

  const onShortClick = async (keyup, value) => {
    if (keyup) {
      utils.triggerVibrate();
      const newView = structuredClone(viewSt);
      newView.cable.channels.category = value;
      await viewRouter.changeView(newView);
    }
  }

  const onLongClick = (value) => {
  }

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
                        onTouchStart={(e) => utils.onTouchStart(item.categories, e, onShortClick)}
                        onTouchEnd={(e) => utils.onTouchEnd(item.categories, e, onShortClick, onLongClick)}>
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
