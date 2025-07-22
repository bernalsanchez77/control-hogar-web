import './parlantesSala.css';

function ParlantesSala({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'off'}]]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'on'}]]});
    }
  }

  return (
    <div className="parlantesSala">
      <div>
        <button
          className={`devices-button ${devicesState.parlantesSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.parlantesSala.id)}>
          <img
            className='devices-button-img'
            src={devicesState.parlantesSala.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default ParlantesSala;
