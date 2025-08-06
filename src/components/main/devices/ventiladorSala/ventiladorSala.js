import './ventiladorSala.css';

function VentiladorSala({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="ventiladorSala">
      <div>
        <button
          className={`devices-button ${devicesState.ventiladorSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.ventiladorSala.id)}>
          <img
            className='devices-button-img'
            src={devicesState.ventiladorSala.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default VentiladorSala;
