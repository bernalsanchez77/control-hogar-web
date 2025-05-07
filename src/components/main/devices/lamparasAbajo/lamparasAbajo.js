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
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'on');
    }
  }

  const getLamparasAbajoState = () => {
    return devicesState.lamparaSala.state === "on" &&
      devicesState.lamparaComedor.state === "on";
  }

  useEffect(() => {
    setLamparasState();
  }, [setLamparasState]);

  return (
    <div className="lamparasAbajo">
      <div>
        <button className={`devices-button ${getLamparasAbajoState() ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice()}>Lamparas Abajo</button>
      </div>
    </div>
  );
}

export default LamparasAbajo;
