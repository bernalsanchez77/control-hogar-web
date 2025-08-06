import './chimeneaSala.css';

function ChimeneaSala({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="chimenea">
      <div>
        <button
          className={`devices-button ${devicesState.chimeneaSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.chimeneaSala.id)}>
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
