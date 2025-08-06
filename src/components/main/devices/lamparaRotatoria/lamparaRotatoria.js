import './lamparaRotatoria.css';

function LamparaRotatoria({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaRotatoria">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaRotatoria.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.lamparaRotatoria.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaRotatoria.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaRotatoria;
