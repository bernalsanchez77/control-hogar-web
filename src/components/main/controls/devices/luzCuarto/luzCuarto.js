import './luzCuarto.css';

function LuzCuarto({element, changeControlParent}) {
  const changeControl = (color) => {
    const device = element.id;
    if (element.state === 'off') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
    setTimeout(() => {
      changeControlParent({ifttt: [{device, key: 'color', value: color}]});
    }, 1000);
  };

  return (
    <div>
      <div className='controls-devices-luzcuarto'>
        <ul className='controls-devices-luzcuarto-ul'>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--white ${element.color === 'white' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={() => changeControl('white')}>
            </button>
          </li>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--red ${element.color === 'red' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={() => changeControl('red')}>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LuzCuarto;
