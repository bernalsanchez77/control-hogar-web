import React from 'react';
import { useEdit } from './useEdit';
import utils from '../../../../../../../global/utils';
import './edit.css';

function Edit({ videoToSave }) {
  const {
    lizEnabledSt,
    userNameSt,
    youtubeChannelsImagesSt,
    youtubeSortedChannels,
    channel,
    channelImg,
    addChannel,
    saveChannel,
    cancelChannel,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = useEdit(videoToSave);

  return (
    <div>
      <div className='controls-apps-youtube--edit'>
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
