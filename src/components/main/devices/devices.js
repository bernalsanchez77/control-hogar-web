import { useEffect, useCallback, useMemo } from 'react';
import { store } from "../../../store/store";
import viewRouter from '../../../global/view-router';
import utils from '../../../global/utils';
import requests from '../../../global/requests';
import './devices.css';


function Devices() {
  const userTypeSt = store(v => v.userTypeSt);
  const devicesSt = store(v => v.devicesSt);
  const allDevices = useMemo(() => devicesSt.length ? [
    ...devicesSt,
    {
      id: 'lamparasAbajo',
      label: 'Lamparas Abajo',
      img: '/imgs/devices/lamparasabajo.png',
      state: 'off',
      order: 13,
      public: true,
    }
  ] : [], [devicesSt]);
  const viewSt = store(v => v.viewSt);
  const lamparasOn = [
    devicesSt.find(device => device.id === 'lamparaComedor'),
    devicesSt.find(device => device.id === 'lamparaSala'),
    devicesSt.find(device => device.id === 'chimeneaSala'),
    devicesSt.find(device => device.id === 'lamparaTurca'),
  ];
  const lamparasOff = useMemo(() => [
    devicesSt.find(device => device.id === 'lamparaComedor'),
    devicesSt.find(device => device.id === 'lamparaSala'),
    devicesSt.find(device => device.id === 'chimeneaSala'),
    devicesSt.find(device => device.id === 'lamparaTurca'),
  ], [devicesSt]);

  const setLamparasState = useCallback(async () => {
    let lamps = 0;
    lamparasOff.forEach(lampara => {
      if (lampara.state === 'on') {
        lamps++;
      }
    });
    if (lamps > 1) {
      allDevices.find(device => device.id === 'lamparasAbajo').state = 'on';
    } else {
      allDevices.find(device => device.id === 'lamparasAbajo').state = 'off';
    }
  }, [lamparasOff, allDevices]);

  const changeView = async (device) => {
    const newView = structuredClone(viewSt);
    newView.devices.device = device.id;
    await viewRouter.changeView(newView);
  }

  const onDevicesShortClick = (keyup, device) => {
    if (keyup) {
      if (device.state === 'on') {
        if (device.id === 'lamparasAbajo') {
          lamparasOff.forEach(lampara => {
            if (lampara.state === 'on') {
              requests.sendIfttt({ device: lampara.id, key: 'state', value: 'off' });
              requests.updateTable({ id: lampara.id, table: 'devices', state: 'off' });
            }
          });
        } else {
          requests.sendIfttt({ device: device.id, key: 'state', value: 'off' });
          requests.updateTable({ id: device.id, table: 'devices', state: 'off' });
        }

      }
      if (device.state === 'off') {
        if (device.id === 'lamparasAbajo') {
          lamparasOn.forEach(lampara => {
            if (lampara.state === 'off') {
              requests.sendIfttt({ device: lampara.id, key: 'state', value: 'on' });
              requests.updateTable({ id: lampara.id, table: 'devices', state: 'on' });
            }
          });
        } else {
          requests.sendIfttt({ device: device.id, key: 'state', value: 'on' });
          requests.updateTable({ id: device.id, table: 'devices', state: 'on' });
        }
      }
    }
  }

  const onDevicesLongClick = (device) => {
    changeView(device);
  }

  const onTouchStart = (device, e) => {
    utils.onTouchStart(device, e, onDevicesShortClick)
  }

  const onTouchEnd = (device, e) => {
    utils.onTouchEnd(device, e, onDevicesShortClick, onDevicesLongClick)
  }

  const onTouchMove = (e) => {
    utils.onTouchMove(e)
  }

  useEffect(() => {
    setLamparasState();
  }, [setLamparasState]);


  return (
    <div className="devices">
      <ul className='devices-ul'>
        {
          allDevices.filter(device => device.order !== 0).sort((a, b) => a.order - b.order).map((device, key) => (
            (userTypeSt === 'owner' || userTypeSt === 'dev' || device.public) &&
            <li key={key} className='devices-element'>
              <button
                className={`devices-button ${device.state === 'on' || (device.id === 'lamparasAbajo' && device.state === 'on') ? "devices-button--on" : "devices-button-off"}`}
                onTouchStart={(e) => onTouchStart(device, e)}
                onTouchEnd={(e) => onTouchEnd(device, e)}
                onTouchMove={(e) => onTouchMove(e)}>
                <img
                  className='devices-button-img'
                  src={device.img}
                  alt="icono">
                </img>
                <div className='devices-led'></div>
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default Devices;
