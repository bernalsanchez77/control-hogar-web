import { useState, useRef } from 'react';
import { store } from "../../../../../store/store";
import viewRouter from '../../../../../global/view-router';
import youtube from '../../../../../global/youtube';
import utils from '../../../../../global/utils';
import Edit from './modules/edit/edit';
import Queue from './modules/queue/queue';
import Search from './modules/search/search';
import Channel from './modules/channel/channel';
import { useTouch } from '../../../../../hooks/useTouch';
import './youtube.css';

function Youtube() {
  const youtubeChannelsLizSt = store(v => v.youtubeChannelsLizSt);
  const viewSt = store(v => v.viewSt);
  const leaderSt = store(v => v.peersSt.findLast(p => p.wifiName === 'Noky')?.name || '');
  const userNameSt = store(v => v.userNameSt);
  const lizEnabledSt = store(v => v.lizEnabledSt);
  const [videoToSave, setVideoToSave] = useState(null);
  let youtubeSortedChannels = [];
  const channelSelected = useRef('');

  const onChannelShortClick = (channel) => {
    utils.triggerVibrate();
    localStorage.setItem('channelSelected', channel);
    channelSelected.current = channel;
    const newView = structuredClone(viewSt);
    newView.roku.apps.youtube.channel = channel;
    newView.roku.apps.youtube.mode = 'channel';
    viewRouter.changeView(newView);
  };

  if (viewSt.roku.apps.youtube.mode === '' || viewSt.roku.apps.youtube.mode === 'edit') {
    youtubeSortedChannels = Object.values(youtubeChannelsLizSt).sort((a, b) => a.order - b.order);
  }

  const handleShortPress = (e, type, video) => {
    if (type === 'channel') {
      utils.triggerVibrate();
      onChannelShortClick(video.id);
    }
    if (type === 'video') {
      if (leaderSt) {
        utils.triggerVibrate();
        youtube.onVideoShortClick(video);
      }
    }
    if (type === 'edit') {
      utils.triggerVibrate();
      setVideoToSave(video);
      const newView = structuredClone(viewSt);
      newView.roku.apps.youtube.mode = 'edit';
      viewRouter.changeView(newView);
    }
  };

  const handleLongPress = (e, type, video) => {
    utils.triggerVibrate();
    youtube.handleQueue(video);
  };

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(handleShortPress, handleLongPress);

  return (
    <div>
      {viewSt.roku.apps.youtube.mode === '' &&
        <div className='controls-apps-youtube'>
          <ul className='controls-apps-youtube-ul'>
            {
              youtubeSortedChannels.map((channel, key) => (
                ((!lizEnabledSt && channel.user === userNameSt) || (lizEnabledSt && channel.user === 'elizabeth')) &&
                <li key={key} className='controls-apps-youtube-li'>
                  <button
                    className={'controls-apps-youtube-channel-button'}
                    onTouchStart={(e) => onTouchStart(e)}
                    onTouchMove={(e) => onTouchMove(e)}
                    onTouchEnd={(e) => onTouchEnd(e, 'channel', channel)}>
                    <img
                      className='controls-apps-youtube-channel-img'
                      src={channel.img || 'https://control-hogar-psi.vercel.app/imgs/youtube-channels/' + channel.id + '.png'}
                      alt="icono">
                    </img>
                    <p className='controls-apps-youtube-channel-title'>
                      {channel.title}
                    </p>
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      }
      {
        (viewSt.roku.apps.youtube.mode === 'channel') &&
        <Channel setVideoToSave={setVideoToSave} />
      }
      {
        (viewSt.roku.apps.youtube.mode === 'search') &&
        <Search setVideoToSave={setVideoToSave} />
      }
      {
        (viewSt.roku.apps.youtube.mode === 'edit') &&
        <Edit videoToSave={videoToSave} />
      }
      {
        (viewSt.roku.apps.youtube.mode === 'queue') &&
        <Queue />
      }
    </div >
  )
}

export default Youtube;
