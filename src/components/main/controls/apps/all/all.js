import { store } from "../../../../../store/store";
import utils from '../../../../../global/utils';
import requests from '../../../../../global/requests';
import viewRouter from '../../../../../global/view-router';
import { useTouch } from '../../../../../hooks/useTouch';
import './all.css';
function Apps() {
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const selectionsSt = store(v => v.selectionsSt);
  const rokuAppsSelectedRokuId = selectionsSt.find(el => el.table === 'rokuApps')?.id;

  const onShortClick = (e, value) => {
    utils.triggerVibrate();
    const app = rokuAppsSt.find(app => app.id === value);
    requests.updateSelections({ table: 'rokuApps', id: app.rokuId });
  }

  const onLongClick = async (e, value) => {
    utils.triggerVibrate();
    await viewRouter.navigateToRokuApp(value);
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
