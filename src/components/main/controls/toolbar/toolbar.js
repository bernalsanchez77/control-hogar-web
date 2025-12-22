import { useEffect, useCallback, useState } from 'react';
import { store } from "../../../../store/store";
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';
import youtube from '../../../../global/youtube';
import roku from '../../../../global/roku';
import './toolbar.css';

function Toolbar() {
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const hdmiSalaSt = store(v => v.hdmiSalaSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const rokuPlayStatePositionSt = store(v => v.rokuPlayStatePositionSt);
  const leaderSt = store(v => v.leaderSt);
  const userNameSt = store(v => v.userNameSt);
  const rokuRow = hdmiSalaSt.find(hdmi => hdmi.id === 'roku');
  const [normalizedPercentageSt, setNormalizedPercentageSt] = useState(Math.min(100, Math.max(0, 0)));
  const device = 'rokuSala';

  const onShortClick = (keyup, value) => {
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (wifiNameSt === 'Noky') {
      if (value === 'play') {
        if (keyup) {
          utils.triggerVibrate();
          requests.fetchRoku({ key: 'keypress', value: 'Play' });
          roku.updatePlayState(1000);
        }
      } else {
        utils.triggerVibrate();
        requests.fetchRoku({ key: 'keydown', value: rokuValue });
      }
    } else {
      utils.triggerVibrate();
      requests.sendIfttt({ device, key: 'command', value });
    }
  }

  const onLongClick = (value) => {
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (wifiNameSt === 'Noky') {
      if (value === 'play') {
        utils.triggerVibrate();
        requests.fetchRoku({ key: 'keypress', value: 'Play' });
        roku.updatePlayState(1000);
      } else {
        utils.triggerVibrate();
        requests.fetchRoku({ key: 'keyup', value: rokuValue });
        roku.updatePlayState(1000);
      }
    }
  }

  const onTouchStart = (value, e) => {
    utils.onTouchStart(value, e, onShortClick);
  }

  const onTouchEnd = (value, e) => {
    utils.onTouchEnd(value, e, onShortClick, onLongClick);
  }

  const getNextQueue = useCallback((currentQueue) => {
    const higherQueueVideos = youtubeVideosLizSt.filter(obj => {
      const propValue = Number(obj['queue']);
      return propValue > currentQueue;
    });
    if (higherQueueVideos.length === 0) {
      return null;
    }
    higherQueueVideos.sort((a, b) => {
      return Number(a.queue) - Number(b.queue);
    });
    return higherQueueVideos[0];
  }, [youtubeVideosLizSt]);

  useEffect(() => {
    const position = rokuPlayStatePositionSt;
    const video = youtubeVideosLizSt.find(vid => vid.state === 'selected');
    const { normalizedPercentage, end } = utils.checkVideoEnd(position, video);
    setNormalizedPercentageSt(normalizedPercentage);
    if (leaderSt === userNameSt && end) {
      if (video) {
        youtube.clearCurrentVideo();
      }
      setTimeout(() => {
        const nextVideo = getNextQueue(video.queue);
        if (nextVideo) {
          const rokuId = store.getState().rokuAppsSt.find(app => app.id === 'youtube').rokuId;
          requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: nextVideo.id } });
          requests.updateTable({
            new: { newId: nextVideo.id, newTable: 'youtubeVideosLiz', newState: 'selected' }
          });
          youtube.handleQueue(nextVideo);
        } else {
          requests.fetchRoku({ key: 'keypress', value: 'Stop' });
          youtube.clearCurrentVideo();
        }
      }, 1000);
    }
  }, [leaderSt, userNameSt, getNextQueue, rokuPlayStatePositionSt, youtubeVideosLizSt]);

  return (
    <div className='controls-toolbar'>
      <div className='controls-toolbar-row'>
        <div className='controls-toolbar-element controls-toolbar-element--left'>
          <button
            className='controls-toolbar-button'
            onTouchStart={(e) => onTouchStart('rev', e)}
            onTouchEnd={(e) => onTouchEnd('rev', e)}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/rewind-50.png"
              alt="icono">
            </img>
          </button>
        </div>
        <div className='controls-toolbar-element'>
          <button
            className={`controls-toolbar-button`}
            onTouchStart={(e) => onTouchStart('play', e)}
            onTouchEnd={(e) => onTouchEnd('play', e)}>
            {rokuRow.playState === 'play' &&
              <img
                className='controls-toolbar-img controls-toolbar-img--button'
                src="/imgs/pause-50.png"
                alt="icono">
              </img>
            }
            {(rokuRow.playState === 'pause' || rokuRow.playState === 'none' || rokuRow.playState === 'close') &&
              <img
                className='controls-toolbar-img controls-toolbar-img--button'
                src="/imgs/play-50.png"
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-toolbar-element controls-toolbar-element--right'>
          <button
            className={'controls-toolbar-button'}
            onTouchStart={(e) => onTouchStart('fwd', e)}
            onTouchEnd={(e) => onTouchEnd('fwd', e)}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/forward-50.png"
              alt="icono">
            </img>
          </button>
        </div>
      </div>
      <div className='controls-toolbar-row'>
        <div className="controls-toolbar-progress-bar-container">
          {youtubeVideosLizSt.find(vid => vid.state === 'selected') &&
            <div className="controls-toolbar-progress-bar-track">
              <div
                className="controls-toolbar-progress-bar-fill" style={{ width: `${normalizedPercentageSt}%` }}>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
