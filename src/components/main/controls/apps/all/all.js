import { store } from "../../../../../store/store";
import utils from '../../../../../global/utils';
import requests from '../../../../../global/requests';
import viewRouter from '../../../../../global/view-router';
import youtube from '../../../../../global/youtube';
import { useTouch } from '../../../../../hooks/useTouch';
import './all.css';
function Apps() {
  const setRokuSearchModeSt = store(v => v.setRokuSearchModeSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const viewSt = store(v => v.viewSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const selectionsSt = store(v => v.selectionsSt);
  const rokuAppsSelectedRokuId = selectionsSt.find(el => el.table === 'rokuApps')?.id;

  const onShortClick = (e, value) => {
    utils.triggerVibrate();
    const device = 'rokuSala';
    const app = rokuAppsSt.find(app => app.id === value);
    setRokuSearchModeSt('roku');
    if (wifiNameSt === 'Noky') {
      requests.fetchRoku({ key: 'launch', value: app.rokuId });
    } else {
      requests.sendIfttt({ device, key: 'app', value });
    }
    requests.updateSelections({ table: 'rokuApps', id: app.rokuId });
    if (app.id !== 'youtube') {
      youtube.clearCurrentVideo();
      youtube.clearQueue();
    }
  }

  const onLongClick = async (e, value) => {
    utils.triggerVibrate();
    const newView = structuredClone(viewSt);
    newView.roku.apps.selected = value;
    await viewRouter.changeView(newView);
  }

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

  return (
    <div className='controls-apps'>
      <ul className='controls-apps-wrapper'>
        {rokuAppsSt.map((app, key) => (
          <li key={key} className='controls-apps-li'>
            <div className='controls-apps-element'>
              <button
                className={`controls-apps-button ${app.rokuId === rokuAppsSelectedRokuId ? "controls-apps-button--on" : "controls-apps-button--off"}`}
                onTouchStart={(e) => onTouchStart(e)}
                onTouchMove={(e) => onTouchMove(e)}
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
