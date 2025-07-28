import './lamparaComedor.css';

function LamparaComedor({devicesState, triggerControlParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (devicesState[device].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaComedor">
      <div>
        <button
          className={`devices-button ${devicesState.lamparaComedor.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.lamparaComedor.id)}>
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
