import {useRef} from 'react';
import './all.css';

function Apps({view, rokuApps, rokuSearchMode, changeControlParent, changeRokuSearchModeParent, changeViewParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const changeControl = (value) => {
    const device = 'rokuSala';
    let app = rokuApps.find(app => app.id === value);
    if (app.id === 'home') {
      changeRokuSearchModeParent('default');
    } else {
      changeRokuSearchModeParent('roku');
    }
    changeControlParent({
      ifttt: [{device, key: 'app', value}],
      roku: [{device, key: 'launch', value: app.rokuId}],
    });
  }

  const changeView = (app) => {
    const newView = structuredClone(view);
    newView.roku.apps.selected = app;
    changeViewParent(newView);
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
        {rokuApps.map((app, key) => (
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
