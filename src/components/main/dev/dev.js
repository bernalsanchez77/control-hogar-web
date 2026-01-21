import './dev.css';
import { store } from "../../../store/store";
import connection from '../../../global/connection';

function Dev() {
  const sendEnabledSt = store(v => v.sendEnabledSt);
  const setSendEnabledSt = store(v => v.setSendEnabledSt);
  const wifiNameSt = store(v => v.wifiNameSt);

  const onEnableSend = () => {
    if (sendEnabledSt === true) {
      setSendEnabledSt(false);
    } else {
      setSendEnabledSt(true);
    }
  };

  const onWifiChange = () => {
    if (wifiNameSt === 'Noky') {
      connection.onWifiNameChange('Cometa');
    } else {
      connection.onWifiNameChange('Noky');
    }
  };

  return (
    <div className='dev'>
      <div className='dev-row'>
        <div className='dev-element dev-element--send'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button ${sendEnabledSt ? "dev-button--on" : "dev-button-off"}`}
            onClick={() => onEnableSend()}>
            Enable Changes
          </button>
        </div>
        <div className='dev-element dev-element--wifi'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={() => onWifiChange()}>
            Wifi: {wifiNameSt}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
