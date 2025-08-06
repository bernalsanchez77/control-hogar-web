import './calentadorNegro.css';

function CalentadorNegro({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="calentadorNegro">
      <div>
        <button
          className={`devices-button ${devicesState.calentadorNegro.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.calentadorNegro.id)}>
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
