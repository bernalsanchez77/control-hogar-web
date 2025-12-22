import { store } from "../../../../../store/store";
import requests from '../../../../../global/requests';
import utils from '../../../../../global/utils';
import './category.css';

function Category() {
  const category = store(v => v.viewSt.cable.channels.category);
  const cableChannelsSt = store(v => v.cableChannelsSt);
  const selectedChannel = cableChannelsSt.find(ch => ch.state === 'selected');
  const onChannelShortClick = (channel) => {
    utils.triggerVibrate();
    const device = 'channelsSala';
    const ifttt = cableChannelsSt.find(ch => ch.id === channel).ifttt;
    requests.sendIfttt({ device: device + ifttt, key: 'selected', value: channel });
    requests.updateTable({
      current: { currentId: selectedChannel.id, currentTable: 'cableChannels' },
      new: { newId: channel, newTable: 'cableChannels' }
    });
  }

  return (
    <div>
      <div className='controls-channels-categories'>
        <ul className='controls-channels-categories-ul'>
          {
            cableChannelsSt.map((channel, key) => category.includes(channel.category) ? (
              <li key={key} className='controls-channels-category'>
                <button
                  className={`controls-channels-category-button ${selectedChannel?.id === channel.id ? 'controls-channels-category-button--selected' : ''}`}
                  onTouchStart={() => onChannelShortClick(channel.id)}>
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
