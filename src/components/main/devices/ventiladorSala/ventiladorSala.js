import './ventiladorSala.css';

function VentiladorSala({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="ventiladorSala">
      <div>
        <button
          className={`devices-button ${devicesState.ventiladorSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.ventiladorSala.id)}>
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
