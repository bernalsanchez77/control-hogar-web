import { store } from "../../../../../store/store";
import './category.css';

function Category({category, changeControlParent}) {
  const cableChannelsSt = store(v => v.cableChannelsSt);
  const selectedChannel = cableChannelsSt.find(ch => ch.state === 'selected');
  const changeControl = (channel) => {
    const device = 'channelsSala';
    const ifttt = cableChannelsSt.find(ch => ch.id === channel).ifttt;
    changeControlParent({
      ifttt: [{device: device + ifttt, key: 'selected', value: channel}],
      massMedia: [{device: device, key: 'selected', value: channel}],
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
