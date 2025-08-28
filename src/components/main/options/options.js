import './options.css';

function Options({sendEnabled, enableSendParent}) {
  const removeStorage = () => {
    removeStorage();
  }

  const enableSend = () => {
    enableSendParent();
  }

  return (
    <div className='options'>
      <div className='options-row'>
        <div className='options-element options-element--send'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className={`options-button ${sendEnabled ? "options-button--on" : "options-button-off"}`}
            onClick={() => enableSend()}>
            Temas
          </button>
        </div>
      </div>
    </div>
  )
}

export default Options;
