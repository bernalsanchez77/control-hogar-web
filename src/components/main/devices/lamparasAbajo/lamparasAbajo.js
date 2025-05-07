import React, {useEffect, useState, useCallback} from 'react';
import './lamparasAbajo.css';

function LamparasAbajo({devicesState, triggerDeviceParent}) {
  const [state, setState] = useState('off');
  const setLamparasState = useCallback(async () => {
    if (
      devicesState.lamparaSala.state === "on" &&
      devicesState.lamparaComedor.state === "on"
      ) {
      setState('on');
    } else {
      setState('off');
    }
  }, [devicesState]);
  const triggerDevice = () => {
    if (
      devicesState.lamparaComedor.state === 'on' &&
      devicesState.lamparaSala.state === 'on'
    ) {
      triggerDeviceParent(devicesState.lamparaComedor.id, 'off');
      triggerDeviceParent(devicesState.lamparaSala.id, 'off');
    }
    if (devicesState.lamparaSala.state === 'off') {
      triggerDeviceParent(devicesState.lamparaSala.id, 'on');
    }
    if (devicesState.lamparaComedor.state === 'off') {
      triggerDeviceParent(devicesState.lamparaComedor.id, 'on');
    }
  }

  useEffect(() => {
    setLamparasState();
  }, [setLamparasState]);

  return (
    <div className="lamparasAbajo">
      <div>
        <button className={`devices-button ${state ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice()}>Lamparas Abajo</button>
      </div>
    </div>
  );
}

export default LamparasAbajo;
