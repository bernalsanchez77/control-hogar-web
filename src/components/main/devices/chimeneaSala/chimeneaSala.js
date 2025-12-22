import './chimeneaSala.css';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';

function ChimeneaSala({ element }) {
  const changeControl = (device) => {
    utils.triggerVibrate();
    if (element.state === 'on') {
      requests.sendIfttt({ device, key: 'state', value: 'off' });
      requests.updateTable({
        new: { newId: device, newTable: 'devices', newState: 'off' }
      });
    }
    if (element.state === 'off') {
      requests.sendIfttt({ device, key: 'state', value: 'on' });
      requests.updateTable({
        new: { newId: device, newTable: 'devices', newState: 'on' }
      });
    }
  }

  return (
    <div className="chimenea">
      <div>
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
      </div>
    </div>
  );
}

export default ChimeneaSala;
