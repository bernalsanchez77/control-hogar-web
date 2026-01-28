import './lamparaComedor.css';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';

function LamparaComedor({ element }) {
  const changeControl = (device) => {
    utils.triggerVibrate();
    if (element.state === 'on') {
      requests.sendIfttt({ device, key: 'state', value: 'off' });
      requests.updateTable({ id: device, table: 'devices', state: 'off' });
    }
    if (element.state === 'off') {
      requests.sendIfttt({ device, key: 'state', value: 'on' });
      requests.updateTable({ id: device, table: 'devices', state: 'on' });
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
