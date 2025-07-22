import './calentadorNegro.css';

function CalentadorNegro({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'off'}]]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'on'}]]});
    }
  }

  return (
    <div className="calentadorNegro">
      <div>
        <button
          className={`devices-button ${devicesState.calentadorNegro.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.calentadorNegro.id)}>
          <img
            className='devices-button-img'
            src={devicesState.calentadorNegro.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default CalentadorNegro;
