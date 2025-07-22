import './lamparaRotatoria.css';

function LamparaRotatoria({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'off'}]]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'on'}]]});
    }
  }

  return (
    <div className="lamparaRotatoria">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaRotatoria.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.lamparaRotatoria.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaRotatoria.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaRotatoria;
