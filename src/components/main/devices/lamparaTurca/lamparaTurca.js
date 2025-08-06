import './lamparaTurca.css';

function LamparaTurca({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaTurca">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaTurca.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.lamparaTurca.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaTurca.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaTurca;
