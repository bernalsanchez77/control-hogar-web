import './lamparaComedor.css';

function LamparaComedor({devicesState, changeControlParent}) {
  const changeControl = (device) => {
    if (devicesState[device].state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaComedor">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaComedor.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(devicesState.lamparaComedor.id)}>
          <img
            className='devices-button-img'
            src={devicesState.lamparaComedor.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaComedor;
