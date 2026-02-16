import { useEffect, useCallback, useState } from 'react';
import { store } from "../../../../store/store";
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';
import youtube from '../../../../global/youtube';
import viewRouter from '../../../../global/view-router';
import { useTouch } from '../../../../hooks/useTouch';
import './toolbar.css';

function Toolbar() {
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const rokuPlayStatePositionSt = store(v => v.rokuPlayStatePositionSt);
  const leaderSt = store(v => v.peersSt.findLast(p => p.wifiName === 'Noky')?.name || '');
  const selectionsSt = store(v => v.selectionsSt);
  const viewSt = store(v => v.viewSt);
  const simulatePlayStateSt = store(v => v.simulatePlayStateSt);
  let youtubeVideosLizSelectedId;
  if (simulatePlayStateSt) {
    youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;
  } else {
    youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;
  }
  const youtubeVideosLizSelected = youtubeVideosLizSt.find(el => el.id === youtubeVideosLizSelectedId);
  const userNameSt = store(v => v.userNameSt);
  const userDeviceSt = store(v => v.userDeviceSt);
  const userTypeSt = store(v => v.userTypeSt);
  const selectionsPlayState = selectionsSt.find(el => el.table === 'rokuSala')?.id;
  const [normalizedPercentageSt, setNormalizedPercentageSt] = useState(Math.min(100, Math.max(0, 0)));
  const lizEnabledSt = store(v => v.lizEnabledSt);
  const setLizEnabledSt = store(v => v.setLizEnabledSt);
  const device = 'rokuSala';

  const onShortClick = useCallback((e, value) => {
    utils.triggerVibrate();
    if (value === 'play') {
      let playState = '';
      if (selectionsPlayState === 'stop') {
        playState = 'play';
      }
      if (selectionsPlayState === 'play') {
        playState = 'pause';
      }
      if (selectionsPlayState === 'pause') {
        playState = 'play';
      }
      requests.updateSelections({ table: 'rokuSala', id: playState });
    }


    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (wifiNameSt === 'Noky') {
      if (value === 'rev' || value === 'fwd') {
        requests.fetchRoku({ key: 'keydown', value: rokuValue });
      }
      if (value === 'queue') {
        const newView = structuredClone(viewSt);
        newView.roku.apps.youtube.mode = 'queue';
        viewRouter.changeView(newView);
      }
      if (value === 'liz') {
        if (localStorage.getItem('lizEnabled') === 'true') {
          localStorage.setItem('lizEnabled', 'false');
          setLizEnabledSt(false);
        } else {
          localStorage.setItem('lizEnabled', 'true');
          setLizEnabledSt(true);
        }
      }
    } else {
      if (value === 'queue') {
        const newView = structuredClone(viewSt);
        newView.roku.apps.youtube.mode = 'queue';
        viewRouter.changeView(newView);
      } else if (value === 'liz') {
        if (localStorage.getItem('lizEnabled') === 'true') {
          localStorage.setItem('lizEnabled', 'false');
          setLizEnabledSt(false);
        } else {
          localStorage.setItem('lizEnabled', 'true');
          setLizEnabledSt(true);
        }
      } else {
        requests.sendIfttt({ device, key: 'command', value });
      }
    }
  }, [selectionsPlayState, wifiNameSt, viewSt, setLizEnabledSt]);

  const onLongClick = (e, value) => {
    // const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    // if (wifiNameSt === 'Noky') {
    //   if (value === 'play') {
    //     utils.triggerVibrate();
    //     requests.fetchRoku({ key: 'keypress', value: 'Play' });
    //     roku.updatePlayState(1000);
    //   } else {
    //     utils.triggerVibrate();
    //     requests.fetchRoku({ key: 'keyup', value: rokuValue });
    //     roku.updatePlayState(1000);
    //   }
    // }
  }

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

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
      if (leaderSt === userNameSt + '-' + userDeviceSt && end) {
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
  }, [leaderSt, userNameSt, userDeviceSt, getNextQueue, rokuPlayStatePositionSt, youtubeVideosLizSt, selectionsSt, youtubeVideosLizSelected]);

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
            onTouchStart={(e) => onTouchStart(e)}
            onTouchMove={(e) => onTouchMove(e)}
            onTouchEnd={(e) => onTouchEnd(e, 'rev')}>
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
            onTouchStart={(e) => onTouchStart(e)}
            onTouchMove={(e) => onTouchMove(e)}
            onTouchEnd={(e) => onTouchEnd(e, 'play')}>
            {selectionsPlayState === 'play' &&
              <img
                className='controls-toolbar-img controls-toolbar-img--button'
                src="/imgs/pause-50.png"
                alt="icono">
              </img>
            }
            {(selectionsPlayState === 'pause' || selectionsPlayState === 'none' || selectionsPlayState === 'close') &&
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
            onTouchStart={(e) => onTouchStart(e)}
            onTouchMove={(e) => onTouchMove(e)}
            onTouchEnd={(e) => onTouchEnd(e, 'fwd')}>
            <img
              className='controls-toolbar-img controls-toolbar-img--button'
              src="/imgs/forward-50.png"
              alt="icono">
            </img>
          </button>
        </div>
      </div>
      <div className='controls-toolbar-row'>
        <div className='controls-toolbar-row-wrapper'>
          <div className="controls-toolbar-progress-bar-container">
            {youtubeVideosLizSelected?.id &&
              <div>
                <div className="controls-toolbar-progress-bar-track">
                  <div
                    className="controls-toolbar-progress-bar-fill" style={{ width: `${normalizedPercentageSt}%` }}>
                  </div>
                </div>
                <div className="controls-toolbar-progress-bar-label">
                  <div className="controls-toolbar-progress-bar-marquee">
                    <span className="controls-toolbar-progress-bar-label-title">
                      {youtubeVideosLizSelected?.title}
                    </span>
                    <span className="controls-toolbar-progress-bar-label-duration">
                      {youtubeVideosLizSelected?.duration}
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
          {viewSt.roku.apps.selected === 'youtube' && viewSt.roku.apps.youtube.mode === '' &&
            <div className="controls-toolbar-playlist">
              <button
                className={`controls-toolbar-playlist-button`}
                onTouchStart={(e) => onTouchStart(e)}
                onTouchMove={(e) => onTouchMove(e)}
                onTouchEnd={(e) => onTouchEnd(e, 'queue')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6ZM17 7.25C17.4142 7.25 17.75 7.58579 17.75 8C17.75 9.79493 19.2051 11.25 21 11.25C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75C19.7428 12.75 18.5997 12.2616 17.75 11.4641V16.5C17.75 18.2949 16.2949 19.75 14.5 19.75C12.7051 19.75 11.25 18.2949 11.25 16.5C11.25 14.7051 12.7051 13.25 14.5 13.25C15.1443 13.25 15.7449 13.4375 16.25 13.7609V8C16.25 7.58579 16.5858 7.25 17 7.25ZM16.25 16.5C16.25 15.5335 15.4665 14.75 14.5 14.75C13.5335 14.75 12.75 15.5335 12.75 16.5C12.75 17.4665 13.5335 18.25 14.5 18.25C15.4665 18.25 16.25 17.4665 16.25 16.5ZM2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H13C13.4142 9.25 13.75 9.58579 13.75 10C13.75 10.4142 13.4142 10.75 13 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10ZM2.25 14C2.25 13.5858 2.58579 13.25 3 13.25H9C9.41421 13.25 9.75 13.5858 9.75 14C9.75 14.4142 9.41421 14.75 9 14.75H3C2.58579 14.75 2.25 14.4142 2.25 14ZM2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H8C8.41421 17.25 8.75 17.5858 8.75 18C8.75 18.4142 8.41421 18.75 8 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z"
                    fill="#fff" />
                </svg>
              </button>
              {(userTypeSt === 'owner' || userTypeSt === 'dev') &&
                <button
                  className={`controls-toolbar-playlist-liz`}
                  onTouchStart={(e) => onTouchStart(e)}
                  onTouchMove={(e) => onTouchMove(e)}
                  onTouchEnd={(e) => onTouchEnd(e, 'liz')}>
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="-64 0 512 512"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill={lizEnabledSt ? '#00FF00' : '#fff'}
                      d="M120 72c0-39.765 32.235-72 72-72s72 32.235 72 72c0 39.764-32.235 72-72 72s-72-32.236-72-72zm254.627 1.373c-12.496-12.497-32.758-12.497-45.254 0L242.745 160H141.254L54.627 73.373c-12.496-12.497-32.758-12.497-45.254 0-12.497 12.497-12.497 32.758 0 45.255L104 213.254V480c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V368h16v112c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V213.254l94.627-94.627c12.497-12.497 12.497-32.757 0-45.254z" />
                  </svg>
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
