import { useEffect, useCallback } from 'react';
import { store } from "../../../../store/store";
import requests from "../../../../global/requests";
import utils from '../../../../global/utils';
import './top.css';

function Controls() {
  const screenSelectedSt = store(v => v.screenSelectedSt);
  const screensSt = store(v => v.screensSt);
  const viewSt = store(v => v.viewSt);
  const screen = screensSt.find(screen => screen.id === screenSelectedSt);
  const changePower = useCallback(() => {
    utils.triggerVibrate();
    const device = screenSelectedSt;
    const newState = screen.state === 'on' ? 'off' : 'on';
    const value = newState;
    if (device === 'proyectorSala') {
      const devices = ['parlantesSala', 'lamparaSala', 'lamparaComedor'];
      devices.forEach(device => {
        requests.sendIfttt({ device, value });
        requests.updateTable({ id: device, table: 'devices', state: newState });
      });
      if (screen.state === 'on') {
        requests.sendIfttt({ device, value });
        requests.updateTable({ id: device, table: 'screens', state: newState });
        setTimeout(() => {
          requests.sendIfttt({ device: 'proyectorSwitchSala', value });
          requests.updateTable({ id: 'proyectorSwitchSala', table: 'devices', state: newState });
        }, 30000);
      } else {
        requests.sendIfttt({ device: 'proyectorSwitchSala', value });
        requests.updateTable({ id: 'proyectorSwitchSala', table: 'devices', state: newState });
        setTimeout(() => {
          requests.sendIfttt({ device, value });
          requests.updateTable({ id: device, table: 'screens', state: newState });
        }, 5000);
      }
    } else {
      requests.sendIfttt({ device, value });
      requests.updateTable({ id: device, table: 'screens', state: newState });
    }
  }, [screen, screenSelectedSt]);
  const changeHdmi = () => {
    utils.triggerVibrate();
    const device = 'hdmiSala';
    if (viewSt.selected === 'roku') {
      const newId = 'cable';
      requests.sendIfttt({ device, value: newId });
      requests.updateSelections({ table: 'hdmiSala', id: newId });
    }
    if (viewSt.selected === 'cable') {
      const newId = 'roku';
      requests.sendIfttt({ device, value: newId });
      requests.updateSelections({ table: 'hdmiSala', id: newId });
    }
  };
  const changeInput = () => {
    utils.triggerVibrate();
    const device = screenSelectedSt;
    if (screen.input === 'hdmi1') {
      requests.sendIfttt({ device, key: 'input', value: 'hdmi2' });
    } else {
      requests.sendIfttt({ device, key: 'input', value: 'hdmi1' });
    }
  };

  useEffect(() => {
    const performChangePower = () => {
      changePower();
    };
    window.addEventListener('screen-state-change', performChangePower);
    return () => window.removeEventListener('screen-state-change', performChangePower);
  }, [changePower]);

  return (
    <div className='controls-top'>
      <div className='controls-top-row'>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => changePower()}>
            {screen.state === 'on' &&
              <img
                className='controls-top-img controls-top-img--button'
                src="/imgs/power-on-50.png"
                alt="icono">
              </img>
            }
            {screen.state === 'off' &&
              <img
                className='controls-top-img controls-top-img--button'
                src="/imgs/power-off-50.png"
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className="controls-top-button controls-top-button-off"
            onTouchStart={() => changeHdmi()}>
            {viewSt.selected === 'cable' &&
              <img
                className='controls-top-img controls-top-img--roku'
                src='/imgs/roku.png'
                alt="icono">
              </img>
            }
            {viewSt.selected === 'roku' &&
              <img
                className='controls-top-img controls-top-img--telecable'
                src='/imgs/telecable.png'
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => changeInput()}>
            {screen.inputLabel1}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
