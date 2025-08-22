import {useEffect, useState, useCallback, useMemo} from 'react';
import './lamparasAbajo.css';

function LamparasAbajo({lamparaSala, lamparaComedor, chimeneaSala, lamparaTurca, changeControlParent}) {
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
    let ifttt = [];
    if (state === 'on') {
      lamparasOff.forEach(lampara => {
        if (lampara.state === 'on') {
          ifttt.push({device: lampara.id, key: 'state', value: 'off'});
        }
      });
      changeControlParent({ifttt});
      setState('off');
    } else {
      lamparasOn.forEach(lampara => {
        if (lampara.state === 'off') {
          ifttt.push({device: lampara.id, key: 'state', value: 'on'});
        }
      });
      changeControlParent({ifttt});
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
