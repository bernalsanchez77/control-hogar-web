import './dev.css';

function Dev({sendDisabled, updatesDisabled, changeDevParent}) {
  const changeDev = (fn) => {
    navigator.vibrate([100]);
    changeDevParent(fn);
  }

  return (
    <div className='dev'>
      <div className='dev-row'>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={() => changeDev('resetDevices')}>
            Reset Devices
          </button>
        </div>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button ${sendDisabled ? "dev-button--on" : "dev-button-off"}`}
            onClick={() => changeDev('disableIfttt')}>
              Disable Changes
            </button>
        </div>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button`}
            onClick={() => changeDev('removeStorage')}>
              Remove Storage
            </button>
        </div>
      </div>
      <div className='dev-row'>
        <div className='dev-element'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`dev-button ${updatesDisabled ? "dev-button--on" : "dev-button-off"}`}
            onClick={() => changeDev('disableUpdates')}>
              Disable Updates
            </button>
        </div>
      </div>
    </div>
  )
}

export default Dev;
