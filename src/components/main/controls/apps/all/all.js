import React from 'react';
import { useAllApps } from './useAllApps';
import './all.css';

function Apps() {
  const {
    rokuAppsSt,
    rokuAppsSelectedRokuId,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = useAllApps();

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
