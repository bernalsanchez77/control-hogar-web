import './screens.css';

function Screens({credential, screens, screenSelected, userActive, changeScreenParent}) {
  const teleSalaScreen = screens.find(screen => screen.id === 'teleSala');
  const teleCuartoScreen = screens.find(screen => screen.id === 'teleCuarto');
  const teleCocinaScreen = screens.find(screen => screen.id === 'teleCocina');
  const proyectorSalaScreen = screens.find(screen => screen.id === 'proyectorSala');
  const triggerScreen = (screen) => {
    if (screenSelected !== screen) {
      changeScreenParent(screen);
    }
  }
  return (
    <div>
      <div className='screens'>
        <div className='screens-row'>
          {(credential === 'owner' || credential === 'dev' || credential === '') &&
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === teleCuartoScreen.id ? "flash-shadow" : "no-flash"}  ${screenSelected === teleCuartoScreen.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(teleCuartoScreen.id)}>
                {teleCuartoScreen.label}
            </button>
          </div>
          }
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === teleSalaScreen.id ? "flash-shadow" : "no-flash"} ${screenSelected === teleSalaScreen.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(teleSalaScreen.id)}>
                {teleSalaScreen.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === teleCocinaScreen.id ? "flash-shadow" : "no-flash"} ${screenSelected === teleCocinaScreen.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(teleCocinaScreen.id)}>
                {teleCocinaScreen.label}
            </button>
          </div>  
          <div className='screens-element'>
            <button
              className={`screens-button ${userActive && screenSelected === proyectorSalaScreen.id ? "flash-shadow" : "no-flash"} ${screenSelected === proyectorSalaScreen.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => triggerScreen(proyectorSalaScreen.id)}>
                {proyectorSalaScreen.label}
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screens;
