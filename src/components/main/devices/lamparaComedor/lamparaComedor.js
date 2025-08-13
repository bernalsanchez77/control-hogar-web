import './lamparaComedor.css';

function LamparaComedor({deviceEl, changeControlParent}) {
  const changeControl = (device) => {
    if (deviceEl.state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (deviceEl.state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <div className="lamparaComedor">
      <div>
        <button
          className={`devices-button ${deviceEl.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => changeControl(deviceEl.id)}>
          <img
            className='devices-button-img'
            src={deviceEl.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default LamparaComedor;
