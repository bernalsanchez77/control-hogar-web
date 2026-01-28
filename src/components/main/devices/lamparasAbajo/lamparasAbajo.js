import { useEffect, useState, useCallback, useMemo } from 'react';
import './lamparasAbajo.css';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';

function LamparasAbajo({ lamparaSala, lamparaComedor, chimeneaSala, lamparaTurca }) {
  const [state, setState] = useState('off');
  const lamparasOn = [
    lamparaComedor,
    lamparaSala,
    chimeneaSala,
    lamparaTurca,
  ];
  const lamparasOff = useMemo(() => [
    lamparaComedor,
    lamparaSala,
    chimeneaSala,
    lamparaTurca,
  ], [lamparaComedor, lamparaSala, lamparaTurca, chimeneaSala]);
  const setLamparasState = useCallback(async () => {
    let lamps = 0;
    lamparasOff.forEach(lampara => {
      if (lampara.state === 'on') {
        lamps++;
      }
    });
    if (lamps > 1) {
      setState('on');
    } else {
      setState('off');
    }
  }, [lamparasOff]);
  const changeControl = () => {
    utils.triggerVibrate();
    if (state === 'on') {
      lamparasOff.forEach(lampara => {
        if (lampara.state === 'on') {
          requests.sendIfttt({ device: lampara.id, key: 'state', value: 'off' });
          requests.updateTable({ id: lampara.id, table: 'devices', state: 'off' });
        }
      });
      setState('off');
    } else {
      lamparasOn.forEach(lampara => {
        if (lampara.state === 'off') {
          requests.sendIfttt({ device: lampara.id, key: 'state', value: 'on' });
          requests.updateTable({ id: lampara.id, table: 'devices', state: 'on' });
        }
      });
      setState('on');
    }
  }

  useEffect(() => {
    setLamparasState();
  }, [setLamparasState]);

  return (
    <div className="lamparasAbajo">
      <div>
        <button
          className={`devices-button ${state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl()}>
          <img
            className='devices-button-img'
            src='/imgs/devices/lamparasabajo.png'
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparasAbajo;
