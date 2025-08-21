import './dev.css';

function Dev({sendEnabled, changeDevParent, enableSendParent, removeStorageParent}) {
  const removeStorage = () => {
    removeStorage();
  }

  const enableSend = () => {
    enableSendParent();
  }

  return (
    <div className='dev'>
      <div className='dev-row'>
        <div className='dev-element dev-element--send'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button ${sendEnabled ? "dev-button--on" : "dev-button-off"}`}
            onClick={() => enableSend()}>
              Enable Changes
            </button>
        </div>
        <div className='dev-element dev-element--remove'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={() => removeStorage()}>
              Remove Storage
            </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
