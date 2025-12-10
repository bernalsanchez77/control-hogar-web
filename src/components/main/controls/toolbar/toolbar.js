import { useRef, useEffect } from 'react';
import { store } from "../../../../store/store";
import requests from '../../../../global/requests';
import './toolbar.css';

function Toolbar() {
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const hdmiSalaSt = store(v => v.hdmiSalaSt);
  const isAppSt = store(v => v.isAppSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const rokuPlayStatePositionSt = store(v => v.rokuPlayStatePositionSt);
  const roku = hdmiSalaSt.find(hdmi => hdmi.id === 'roku');
  const currentVideoRef = useRef(youtubeVideosLizSt.find(vid => vid.state === 'selected'));
  const normalizedPercentage = useRef(Math.min(100, Math.max(0, 0)));
  const changeControl = (value) => {
    const device = 'rokuSala';
    if (value === 'play') {
      if (roku.playState === 'play') {
        if (isAppSt && wifiNameSt === 'Noky') {
          requests.fetchRoku({ key: 'keypress', value: 'Play' });
        } else {
          requests.sendIfttt({ device, key: 'playState', value: 'pause' });
        }
        requests.updateTable({
          new: { newId: 'roku', newTable: 'hdmiSala', newPlayState: 'pause' }
        });
      } else {
        if (isAppSt && wifiNameSt === 'Noky') {
          requests.fetchRoku({ key: 'keypress', value: 'Play' });
        } else {
          requests.sendIfttt({ device, key: 'playState', value: 'play' });
        }
        requests.updateTable({
          new: { newId: 'roku', newTable: 'hdmiSala', newPlayState: 'play' }
        });
      }
    } else {
      if (isAppSt && wifiNameSt === 'Noky') {
        requests.fetchRoku({ key: 'keypress', value: value.charAt(0).toUpperCase() + value.slice(1) });
      } else {
        requests.sendIfttt({ device, key: 'command', value });
      }
    }
  }

  const timeToMs = (timeString) => {
    const parts = timeString.split(':');
    const numParts = parts.length;
    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = 60 * MS_IN_SECOND; // 60,000
    const MS_IN_HOUR = 60 * MS_IN_MINUTE;   // 3,600,000
    let totalMilliseconds = 0;
    if (numParts === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      totalMilliseconds = (hours * MS_IN_HOUR) + (minutes * MS_IN_MINUTE) + (seconds * MS_IN_SECOND);
    } else if (numParts === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      totalMilliseconds = (minutes * MS_IN_MINUTE) + (seconds * MS_IN_SECOND);
    }
    return totalMilliseconds;
  };

  useEffect(() => {
    if (currentVideoRef.current && currentVideoRef.current.id) {
      let currentVideoDuration = 0;
      if (currentVideoRef.current.duration) {
        currentVideoDuration = timeToMs(currentVideoRef.current.duration);
      }
      console.log('position:', rokuPlayStatePositionSt, 'duration:', currentVideoDuration);
      const timeLeft = currentVideoDuration - rokuPlayStatePositionSt;
      const percentage = (rokuPlayStatePositionSt * 100) / currentVideoDuration;
      normalizedPercentage.current = Math.round(Math.min(100, Math.max(0, (percentage))));
      console.log(normalizedPercentage.current);
      if (timeLeft && timeLeft < 6000) {
        console.log('terminando');
      }
    }
  }, [rokuPlayStatePositionSt]);

  return (
    <div className='controls-toolbar'>
      <div className='controls-toolbar-row'>
        <div className='controls-toolbar-element controls-toolbar-element--left'>
          <button
            className='controls-toolbar-button'
            onTouchStart={() => changeControl('rev')}>
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
            onTouchStart={() => changeControl('play')}>
            {(roku.playState === 'play' || roku.playState === 'none' || roku.playState === 'close') &&
              <img
                className='controls-toolbar-img controls-toolbar-img--button'
                src="/imgs/pause-50.png"
                alt="icono">
              </img>
            }
            {roku.playState === 'pause' &&
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
            onTouchStart={() => changeControl('fwd')}>
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
          {currentVideoRef.current &&
            <div className="controls-toolbar-progress-bar-track">
              <div
                className="controls-toolbar-progress-bar-fill" style={{ width: `${normalizedPercentage.current}%` }}>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
