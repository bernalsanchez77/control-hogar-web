import { useRef, useState } from 'react';
import { store } from "../../../../../../../store/store";
import requests from '../../../../../../../global/requests';
import utils from '../../../../../../../global/utils';
import './edit.css';

function Edit({ videoToSave }) {
  const lizEnabledSt = store(v => v.lizEnabledSt);
  const userNameSt = store(v => v.userNameSt);
  const youtubeChannelsImagesSt = store(v => v.youtubeChannelsImagesSt);
  const youtubeChannelsLizSt = store(v => v.youtubeChannelsLizSt);
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);

  // Look up existing video data to pre-populate form
  const savedVideo = youtubeVideosLizSt.find(v => v.id === videoToSave.id);
  const existingChannelId = savedVideo?.channelId || '';
  const existingChannel = youtubeChannelsLizSt.find(c => c.id === existingChannelId);
  const existingChannelImgPath = existingChannel?.img || '';
  // Find the image ID from the path
  const existingImage = youtubeChannelsImagesSt.find(img => img.path === existingChannelImgPath);
  const existingChannelImgId = existingImage?.id || '';

  const [channel, setChannel] = useState(existingChannelId);
  const [channelImg, setChannelImg] = useState(existingChannelImgId);
  const youtubeSortedChannels = Object.values(youtubeChannelsLizSt).sort((a, b) => a.order - b.order);

  const channelRef = useRef(existingChannelId);
  const channelImgRef = useRef(existingChannelImgPath);

  let touchMoved = false;
  let touchStartY = 0;
  const timeout3s = useRef(null);
  const longClick = useRef(false);

  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 500);
  };

  const onTouchMove = (e) => {
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
    if (deltaY > 10) {
      touchMoved = true;
    }
  };

  const onTouchEnd = (e, type, video) => {
    e.preventDefault();
    clearTimeout(timeout3s.current);
    if (!touchMoved) {
      if (longClick.current) {
        utils.triggerVibrate();
      } else {
        if (type === 'image') {
          setChannelImg(video.id);
          channelImgRef.current = video.path;
        }
      }
    }
    longClick.current = false;
  };

  const addChannel = (channel) => {
    setChannel(channel);
    channelRef.current = channel;
  };

  const saveChannel = () => {
    if (channelRef.current && channelRef.current.trim() !== '') {
      utils.triggerVibrate();
      requests.upsertTable({ id: channelRef.current, table: 'youtubeChannelsLiz', title: channelRef.current, user: lizEnabledSt ? 'elizabeth' : userNameSt, img: channelImgRef.current });
      requests.upsertTable({ id: videoToSave.id, table: 'youtubeVideosLiz', title: utils.decodeYoutubeTitle(videoToSave.title), duration: videoToSave.duration, channelId: channelRef.current });
      window.history.back();
    }
  };

  const cancelChannel = () => {
    utils.triggerVibrate();
    window.history.back();
  };

  return (
    <div>
      <div className='controls-apps-youtube controls-apps-youtube--edit'>
        <p className='controls-apps-youtube-edit-video-title'>
          {utils.decodeYoutubeTitle(videoToSave.title)}
        </p>
        <div className='controls-apps-youtube-save-channel-select'>
          <select
            onChange={(e) => addChannel(e.target.value)}
            value={channel}>
            <option defaultValue value="">Selecciona un canal</option>
            {
              youtubeSortedChannels.map((channel, key) => (
                ((lizEnabledSt && channel.user === 'elizabeth') || (!lizEnabledSt && channel.user === userNameSt)) &&
                <option key={key} value={channel.id}>{channel.title}</option>
              ))
            }
          </select>
        </div>
        <div className='controls-apps-youtube-save-channel-input'>
          <input
            type="text"
            placeholder='Nombre del nuevo canal'
            onChange={(e) => addChannel(e.target.value)}
            value={channel}>
          </input>
        </div>
        <div className='controls-apps-youtube-save-channel-images'>
          {
            youtubeChannelsImagesSt.map((image, key) => (
              <div key={key} className={`controls-apps-youtube-save-channel-image ${image.id === channelImg ? 'controls-apps-youtube-save-channel-image--selected' : ''}`}>
                <img
                  src={image.path}
                  alt=""
                  onTouchStart={(e) => onTouchStart(e)}
                  onTouchMove={(e) => onTouchMove(e)}
                  onTouchEnd={(e) => onTouchEnd(e, 'image', image)} />
              </div>
            ))
          }
        </div>
        <div className='controls-apps-youtube-save-channel-buttons'>
          <button
            className='controls-apps-youtube-save-channel-button'
            onClick={cancelChannel}>
            Cancelar
          </button>
          <button
            className='controls-apps-youtube-save-channel-button'
            onClick={saveChannel}
            disabled={!channel || channel.trim() === ''}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Edit;
