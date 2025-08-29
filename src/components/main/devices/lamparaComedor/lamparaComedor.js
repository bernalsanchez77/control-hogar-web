import './lamparaComedor.css';

function LamparaComedor({element, changeControlParent}) {
  const changeControl = (device) => {
    if (element.state === 'on') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'off'}]});
    }
    if (element.state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
  }

  return (
    <button
      className={`devices-button ${element.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
      onTouchStart={() => changeControl(element.id)}>
      <img
        className='devices-button-img'
        src={element.img}
        alt="icono">
      </img>
      <div className='devices-led'></div>
    </button>
  );
}

export default LamparaComedor;
