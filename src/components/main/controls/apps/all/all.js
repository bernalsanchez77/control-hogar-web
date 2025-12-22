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

  const onShortClick = (keyup, value) => {
    if (keyup) {
      utils.triggerVibrate();
      const device = 'rokuSala';
      let app = rokuAppsSt.find(app => app.id === value);
      setRokuSearchModeSt('roku');
      if (wifiNameSt === 'Noky') {
        requests.fetchRoku({ key: 'launch', value: app.rokuId });
      } else {
        requests.sendIfttt({ device, key: 'app', value });
      }
      requests.updateTable({
        current: { currentId: rokuAppsSt.find(app => app.state === 'selected').id, currentTable: 'rokuApps' },
        new: { newId: app.id, newTable: 'rokuApps' }
      });
      if (app.id !== 'youtube') {
        youtube.clearCurrentVideo();
        youtube.clearQueue();
      }
    }
  }

  const onLongClick = async (app) => {
    utils.triggerVibrate();
    const newView = structuredClone(viewSt);
    newView.roku.apps.selected = app;
    await viewRouter.changeView(newView);
  }

  const onTouchStart = (value, e) => {
    utils.onTouchStart(value, e, onShortClick);
  }
  const onTouchEnd = (value, e) => {
    utils.onTouchEnd(value, e, onShortClick, onLongClick);
  }

  return (
    <div className='controls-apps'>
      <ul className='controls-apps-wrapper'>
        {rokuAppsSt.map((app, key) => (
          <li key={key} className='controls-apps-li'>
            <div className='controls-apps-element'>
              <button
                className={`controls-apps-button ${app.state === 'selected' ? "controls-apps-button--on" : "controls-apps-button--off"}`}
                onTouchStart={(e) => onTouchStart(app.id, e)}
                onTouchEnd={(e) => onTouchEnd(app.id, e)}>
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
