import './lamparaSala.css';

function LamparaSala({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaSala">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.lamparaSala.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaSala.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaSala;
