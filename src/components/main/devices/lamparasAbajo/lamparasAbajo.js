import React, {useEffect, useState, useCallback} from 'react';
import './lamparasAbajo.css';

function LamparasAbajo({devicesState, triggerDeviceParent}) {
  const [state, setState] = useState('off');
  const lamparasOn = [
    devicesState.lamparaComedor.id,
    devicesState.lamparaSala.id,
    devicesState.chimeneaSala.id
  ];
  const lamparasOff = [
    devicesState.lamparaComedor.id,
    devicesState.lamparaSala.id,
    devicesState.lamparaTurca.id,
    devicesState.lamparaRotatoria.id,
    devicesState.chimeneaSala.id,
  ];
  const setLamparasState = useCallback(async () => {
    let lamps = 0;
    lamparasOff.forEach(lampara => {
      if (devicesState[lampara].state === 'on') {
        lamps++;
      }
    });
    if (lamps > 0) {
      setState('on');
    } else {
      setState('off');
    }
  }, [devicesState]);
  const triggerDevice = () => {
    let lamp = [];
    if (state === 'on') {
      lamparasOff.forEach(lampara => {
        if (devicesState[lampara].state === 'on') {
          lamp.push(devicesState[lampara].id);
        }
      });
      triggerDeviceParent(lamp, 'off');
      setState('off');
    } else {
      lamparasOn.forEach(lampara => {
        if (devicesState[lampara].state === 'off') {
          lamp.push(devicesState[lampara].id);
        }
      });
      triggerDeviceParent(lamp, 'on');
      setState('on');
    }
  }

  useEffect(() => {
    setLamparasState();
  }, [setLamparasState]);

  return (
    <div className="lamparasAbajo">
      <div>
        <button className={`devices-button ${state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice()}>Lamparas Abajo</button>
      </div>
    </div>
  );
}

export default LamparasAbajo;
