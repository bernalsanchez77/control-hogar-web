import './luzEscalera.css';

function LuzEscalera({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="luzEscalera">
      <div>
        <button
          className={`devices-button ${devicesState.luzEscalera.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.luzEscalera.id)}>
          <img
            className='devices-button-img'
            src={devicesState.luzEscalera.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LuzEscalera;
