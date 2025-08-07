import {useRef} from 'react';
import './all.css';

function Apps({devicesState, view, rokuApps, changeControlParent, changeViewParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const changeControl = (value) => {
    const device = 'rokuSala';
    let rokuValue = rokuApps.find(app => app.id === value).rokuId;
    rokuValue = rokuValue.charAt(0).toUpperCase() + rokuValue.slice(1);
    changeControlParent({
      ifttt: [{device, key: 'app', value}],
      roku: [{device, key: 'launch', value: rokuValue}],
    });
  }

  const changeView = (app) => {
    const newView = {...view};
    newView.apps.selected = app;
    changeViewParent(newView);
  }

  const changeControlStart = (e) => {
    e.preventDefault();
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 500);
  }
  const changeControlEnd = (e, app) => {
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
              className={`controls-apps-button ${app.id === devicesState.rokuSala.app ? "controls-apps-button--on" : "controls-apps-button--off"}`}
              onTouchStart={(e) => changeControlStart(e, app.id)}
              onTouchEnd={(e) => changeControlEnd(e, app.id)}>
                <img
                  className='controls-apps-img controls-apps-img--button'
                  src={app.img}
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
