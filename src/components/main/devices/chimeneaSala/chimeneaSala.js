import './chimeneaSala.css';

function ChimeneaSala({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'off'}]]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'on'}]]});
    }
  }

  return (
    <div className="chimenea">
      <div>
        <button
          className={`devices-button ${devicesState.chimeneaSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.chimeneaSala.id)}>
          <img
            className='devices-button-img'
            src={devicesState.chimeneaSala.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default ChimeneaSala;
