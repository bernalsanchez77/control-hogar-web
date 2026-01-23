import { store } from "../../../../../store/store";
import utils from '../../../../../global/utils';
import requests from '../../../../../global/requests';
import viewRouter from '../../../../../global/view-router';
import youtube from '../../../../../global/youtube';
import './all.css';
function Apps() {
  const setRokuSearchModeSt = store(v => v.setRokuSearchModeSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const viewSt = store(v => v.viewSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);

  const onShortClick = (keyup, value) => {
    if (keyup) {
      utils.triggerVibrate();
      const device = 'rokuSala';
      const app = rokuAppsSt.find(app => app.id === value);
      const currentId = rokuAppsSt.find(app => app.state === 'selected').id;
      setRokuSearchModeSt('roku');
      if (wifiNameSt === 'Noky') {
        requests.fetchRoku({ key: 'launch', value: app.rokuId });
      } else {
        requests.sendIfttt({ device, key: 'app', value });
      }
      requests.updateTable({
        current: { currentId, currentTable: 'rokuApps' },
        new: { newId: app.id, newTable: 'rokuApps' }
      });
      if (app.id !== 'youtube' && youtubeVideosLizSt.find(video => video.state === 'selected')) {
        requests.updateTable({
          current: { currentId: youtubeVideosLizSt.find(video => video.state === 'selected').id, currentTable: 'youtubeVideosLiz', currentState: '' }
        });
      }
      if (app.id !== 'youtube') {
        youtube.clearCurrentVideo();
        youtube.clearQueue();
      }
    }
  }

  const onLongClick = async (value) => {
    utils.triggerVibrate();
    const newView = structuredClone(viewSt);
    newView.roku.apps.selected = value;
    await viewRouter.changeView(newView);
  }

  return (
    <div className='controls-apps'>
      <ul className='controls-apps-wrapper'>
        {rokuAppsSt.map((app, key) => (
          <li key={key} className='controls-apps-li'>
            <div className='controls-apps-element'>
              <button
                className={`controls-apps-button ${app.state === 'selected' ? "controls-apps-button--on" : "controls-apps-button--off"}`}
                onTouchStart={(e) => utils.onTouchStart(app.id, e, onShortClick)}
                onTouchEnd={(e) => utils.onTouchEnd(app.id, e, onShortClick, onLongClick)}>
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
