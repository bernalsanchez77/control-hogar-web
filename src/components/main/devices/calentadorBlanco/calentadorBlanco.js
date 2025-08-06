import './calentadorBlanco.css';

function CalentadorBlanco({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="calentadorBlanco">
      <div>
        <button
          className={`devices-button ${devicesState.calentadorBlanco.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.calentadorBlanco.id)}>
          <img
            className='devices-button-img'
            src={devicesState.calentadorBlanco.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default CalentadorBlanco;
