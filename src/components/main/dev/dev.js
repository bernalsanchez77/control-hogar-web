import './dev.css';
import { store } from "../../../store/store";

function Dev() {
  const sendEnabledSt = store(v => v.sendEnabledSt);
  const setSendEnabledSt = store(v => v.setSendEnabledSt);

  const onEnableSend = () => {
    if (sendEnabledSt === true) {
      setSendEnabledSt(false);
    } else {
      setSendEnabledSt(true);
    }
  };

  const onRemoveStorage = () => {
    localStorage.setItem('user', '');
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
        <div className='dev-element dev-element--remove'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={() => onRemoveStorage()}>
            Remove Storage
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
