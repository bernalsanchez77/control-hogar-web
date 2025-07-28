import React, {useEffect, useState, useCallback, useMemo} from 'react';
import './lamparasAbajo.css';

function LamparasAbajo({devicesState, triggerControlParent}) {
  const [state, setState] = useState('off');
  const lamparasOn = [
    devicesState.lamparaComedor.id,
    devicesState.lamparaSala.id,
    devicesState.chimeneaSala.id
  ];
  const lamparasOff = useMemo(() => [
    devicesState.lamparaComedor.id,
    devicesState.lamparaSala.id,
    devicesState.lamparaTurca.id,
    devicesState.lamparaRotatoria.id,
    devicesState.chimeneaSala.id,
  ], [devicesState]);
  const setLamparasState = useCallback(async () => {
    let lamps = 0;
    lamparasOff.forEach(lampara => {
      if (devicesState[lampara].state === 'on') {
        lamps++;
      }
    });
    if (lamps > 1) {
      setState('on');
    } else {
      setState('off');
    }
  }, [devicesState, lamparasOff]);
  const triggerDevice = () => {
    let ifttt = [];
    if (state === 'on') {
      lamparasOff.forEach(lampara => {
        if (devicesState[lampara].state === 'on') {
          ifttt.push({device: lampara, key: 'state', value: 'off'});
        }
      });
      triggerControlParent({ifttt});
      setState('off');
    } else {
      lamparasOn.forEach(lampara => {
        if (devicesState[lampara].state === 'off') {
          ifttt.push({device: lampara, key: 'state', value: 'on'});
        }
      });
      triggerControlParent({ifttt});
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
          onTouchStart={() => triggerDevice()}>
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
