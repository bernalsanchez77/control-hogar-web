import './options.css';

function Options({sendEnabled, enableOptionsParent}) {
  const removeStorage = () => {
    removeStorage();
  }

  const enableOptions = () => {
    enableOptionsParent();
  }

  return (
    <div className='options'>
      <div className='options-row'>
        <div className='options-element options-element--send'>
            <button
                className={`options-button`}
                onTouchStart={() => enableOptions()}>
                <img
                className='options-img options-img--button'
                src="/imgs/options.png"
                alt="icono">
                </img>
            </button>
        </div>
      </div>
    </div>
  )
}

export default Options;
