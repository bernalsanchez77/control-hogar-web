import { useRef, useEffect } from 'react';
import { store } from "../../../../store/store";
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';
import './toolbar.css';

function Toolbar() {
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const hdmiSalaSt = store(v => v.hdmiSalaSt);
  const isAppSt = store(v => v.isAppSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const rokuPlayStatePositionSt = store(v => v.rokuPlayStatePositionSt);
  const roku = hdmiSalaSt.find(hdmi => hdmi.id === 'roku');
  const currentVideo = youtubeVideosLizSt.find(vid => vid.state === 'selected');
  const normalizedPercentageRef = useRef(Math.min(100, Math.max(0, 0)));
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

  useEffect(() => {
    const position = rokuPlayStatePositionSt;
    const video = currentVideo;
    const { normalizedPercentage } = utils.checkVideoEnd(position, video);
    normalizedPercentageRef.current = normalizedPercentage;
  }, [rokuPlayStatePositionSt, currentVideo]);

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
          {currentVideo &&
            <div className="controls-toolbar-progress-bar-track">
              <div
                className="controls-toolbar-progress-bar-fill" style={{ width: `${normalizedPercentageRef.current}%` }}>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
