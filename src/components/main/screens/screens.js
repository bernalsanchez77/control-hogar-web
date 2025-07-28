import './screens.css';

function Screens({credential, ownerCredential, devCredential, devicesState, screenSelected, userActive, changeScreenParent}) {
  const triggerScreen = (screen) => {
    if (screenSelected !== screen) {
      changeScreenParent(screen);
    }
  }
  return (
    <div>
      <div className='screens'>
        <div className='screens-row'>
          {(credential === ownerCredential || credential === devCredential) &&
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === devicesState.teleCuarto.id ? "flash-shadow" : "no-flash"}  ${screenSelected === devicesState.teleCuarto.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(devicesState.teleCuarto.id)}>
                {devicesState.teleCuarto.label}
              </button>
          </div>
          }
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === devicesState.teleSala.id ? "flash-shadow" : "no-flash"} ${screenSelected === devicesState.teleSala.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(devicesState.teleSala.id)}>
                {devicesState.teleSala.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === devicesState.teleCocina.id ? "flash-shadow" : "no-flash"} ${screenSelected === devicesState.teleCocina.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(devicesState.teleCocina.id)}>
                {devicesState.teleCocina.label}
            </button>
          </div>  
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === devicesState.proyectorSala.id ? "flash-shadow" : "no-flash"} ${screenSelected === devicesState.proyectorSala.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(devicesState.proyectorSala.id)}>
                {devicesState.proyectorSala.label}
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screens;
