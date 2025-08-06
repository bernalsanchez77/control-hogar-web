import './luzCuarto.css';

function LuzCuarto({devicesState, changeControlParent}) {
  const changeControl = (color) => {
    const device = devicesState.luzCuarto.id;
    if (devicesState.luzCuarto.state === 'off') {
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
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--white ${devicesState.luzCuarto.color === 'white' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={() => changeControl('white')}>
            </button>
          </li>
          <li className='controls-device-luzcuarto'>
            <button
              className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--red ${devicesState.luzCuarto.color === 'red' ? 'controls-device-luzcuarto-button--selected' : ''}`}
              onTouchStart={() => changeControl('red')}>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LuzCuarto;
