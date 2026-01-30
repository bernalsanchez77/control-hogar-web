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
  const selectionsSt = store(v => v.selectionsSt);
  const youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;
  const youtubeVideosLizSelected = youtubeVideosLizSt.find(el => el.id === youtubeVideosLizSelectedId);
  const userNameSt = store(v => v.userNameSt);
  const rokuRow = hdmiSalaSt.find(hdmi => hdmi.id === 'roku');
  const [normalizedPercentageSt, setNormalizedPercentageSt] = useState(Math.min(100, Math.max(0, 0)));
  const device = 'rokuSala';

  const onShortClick = useCallback((keyup, value) => {
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (keyup) {
      utils.triggerVibrate();
      if (wifiNameSt === 'Noky') {
        if (value === 'play') {
          requests.fetchRoku({ key: 'keypress', value: 'Play' });
          roku.updatePlayState(1000);
        } else {
          requests.fetchRoku({ key: 'keydown', value: rokuValue });
        }
      } else {
        requests.sendIfttt({ device, key: 'command', value });
        if (value === 'play') {
          const newPlayState = rokuRow.playState === "play" ? "pause" : "play";
          requests.updateTable({ id: rokuRow.id, table: 'hdmiSala', playState: newPlayState });
        }
      }
    }
  }, [rokuRow, wifiNameSt]);

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
    if (youtubeVideosLizSt.length && selectionsSt.length) {
      const position = rokuPlayStatePositionSt;
      const video = youtubeVideosLizSelected;
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
            requests.updateSelections({ table: 'youtubeVideosLiz', id: nextVideo.id });
            youtube.handleQueue(nextVideo);
          } else {
            requests.fetchRoku({ key: 'keypress', value: 'Stop' });
            youtube.clearCurrentVideo();
          }
        }, 1000);
      }
    }
  }, [leaderSt, userNameSt, getNextQueue, rokuPlayStatePositionSt, youtubeVideosLizSt, selectionsSt, youtubeVideosLizSelected]);

  useEffect(() => {
    const performChangePlay = () => {
      onShortClick(true, 'play');
    };
    window.addEventListener('play-state-change', performChangePlay);
    return () => window.removeEventListener('play-state-change', performChangePlay);
  }, [onShortClick]);

  return (
    <div className='controls-toolbar'>
      <div className='controls-toolbar-row'>
        <div className='controls-toolbar-element controls-toolbar-element--left'>
          <button
            className={`controls-toolbar-button ${wifiNameSt === 'Noky' ? 'controls-toolbar-button--connected' : ''}`}
            onTouchStart={(e) => utils.onTouchStart('rev', e, onShortClick)}
            onTouchEnd={(e) => utils.onTouchEnd('rev', e, onShortClick, onLongClick)}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/rewind-50.png"
              alt="icono">
            </img>
          </button>
        </div>
        <div className='controls-toolbar-element'>
          <button
            className={`controls-toolbar-button ${wifiNameSt === 'Noky' ? 'controls-toolbar-button--connected' : ''}`}
            onTouchStart={(e) => utils.onTouchStart('play', e, onShortClick)}
            onTouchEnd={(e) => utils.onTouchEnd('play', e, onShortClick, onLongClick)}>
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
            className={`controls-toolbar-button ${wifiNameSt === 'Noky' ? 'controls-toolbar-button--connected' : ''}`}
            onTouchStart={(e) => utils.onTouchStart('fwd', e, onShortClick)}
            onTouchEnd={(e) => utils.onTouchEnd('fwd', e, onShortClick, onLongClick)}>
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
          {youtubeVideosLizSelected?.id &&
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
