import { store } from "../../../../../store/store";
import requests from '../../../../../global/requests';
import utils from '../../../../../global/utils';
import { useTouch } from '../../../../../hooks/useTouch';
import './category.css';

function Category() {
  const category = store(v => v.viewSt.cable.channels.category);
  const cableChannelsSt = store(v => v.cableChannelsSt);
  const cableChannelsSelectedId = store(v => v.selectionsSt.find(el => el.table === 'cableChannels')?.id);
  const onShortClick = (e, value) => {
    utils.triggerVibrate();
    const device = 'channelsSala';
    const ifttt = cableChannelsSt.find(ch => ch.id === value).ifttt;
    requests.sendIfttt({ device: device + ifttt, key: 'selected', value: value });
    requests.updateSelections({ table: 'cableChannels', id: value });
  }

  const onLongClick = (e, value) => {
  }

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

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
