import { useRef } from 'react';
import { store } from "../../../../../store/store";
import utils from '../../../../../global/utils';
import requests from '../../../../../global/requests';
import viewRouter from '../../../../../global/view-router';
import './all.css';
function Apps() {
  const setRokuSearchModeSt = store(v => v.setRokuSearchModeSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const viewSt = store(v => v.viewSt);
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const changeControl = (value) => {
    const device = 'rokuSala';
    let app = rokuAppsSt.find(app => app.id === value);
    utils.triggerVibrate();
    setRokuSearchModeSt('roku');
    requests.sendIfttt({ device, key: 'app', value });
    requests.updateTable({
      current: { currentId: rokuAppsSt.find(app => app.state === 'selected').id, currentTable: 'rokuApps' },
      new: { newId: app.id, newTable: 'rokuApps' }
    });
    requests.fetchRoku({ key: 'launch', value: app.rokuId });
    if (app.id !== 'youtube') {
      clearYoutubeQueue();
    }
  }

  const clearYoutubeQueue = () => {
    const queueElements = youtubeVideosLizSt.filter(video => video.queue > 0);
    if (queueElements.length > 0) {
      queueElements.forEach(video => {
        requests.updateTable({
          new: { newId: video.id, newTable: 'youtubeVideosLiz', newQueue: 0 }
        });
      });
    }
  };

  const changeView = async (app) => {
    const newView = structuredClone(viewSt);
    newView.roku.apps.selected = app;
    await viewRouter.changeView(newView);
  }

  const onTouchStart = (e) => {
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 500);
  }
  const onTouchEnd = (e, app) => {
    e.preventDefault();
    clearTimeout(timeout3s.current);
    if (longClick.current) {
      changeView(app);
    } else {
      changeControl(app);
    }
    longClick.current = false;
  }

  return (
    <div className='controls-apps'>
      <ul className='controls-apps-wrapper'>
        {rokuAppsSt.map((app, key) => (
          <li key={key} className='controls-apps-li'>
            <div className='controls-apps-element'>
              <button
                className={`controls-apps-button ${app.state === 'selected' ? "controls-apps-button--on" : "controls-apps-button--off"}`}
                onTouchStart={(e) => onTouchStart(e, app.id)}
                onTouchEnd={(e) => onTouchEnd(e, app.id)}>
                <img
                  className='controls-apps-img controls-apps-img--button'
                  src={'https://control-hogar-psi.vercel.app/imgs/apps/' + app.id + '.png'}
                  alt="icono">
                </img>
              </button>
            </div>
          </li>
        ))
        }
      </ul>
    </div>
  )
}

export default Apps;
