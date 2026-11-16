import { useScreens } from './useScreens';
import './screens.css';

function Screens() {
  const {
    isInForegroundSt,
    userTypeSt,
    screenSelectedSt,
    teleSalaScreen,
    teleCuartoScreen,
    teleCocinaScreen,
    proyectorSalaScreen,
    onScreenChanged
  } = useScreens();

  const getButtonClass = (screenId) => {
    const isSelected = screenSelectedSt === screenId;
    const flashClass = (isInForegroundSt && isSelected) ? "flash-shadow" : "no-flash";
    const onOffClass = isSelected ? "screens-button--on" : "screens-button--off";
    return `screens-button ${flashClass} ${onOffClass}`;
  };

  return (
    <div>
      <div className='screens'>
        <div className='screens-row'>
          {(userTypeSt === 'owner' || userTypeSt === 'dev' || userTypeSt === '') &&
            <div className='screens-element'>
              <button
                className={getButtonClass(teleCuartoScreen.id)}
                onTouchStart={() => onScreenChanged(teleCuartoScreen)}>
                {teleCuartoScreen.label}
              </button>
            </div>
          }
          <div className='screens-element'>
            <button
              className={getButtonClass(teleSalaScreen.id)}
              onTouchStart={() => onScreenChanged(teleSalaScreen)}>
              {teleSalaScreen.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={getButtonClass(teleCocinaScreen.id)}
              onTouchStart={() => onScreenChanged(teleCocinaScreen)}>
              {teleCocinaScreen.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={getButtonClass(proyectorSalaScreen.id)}
              onTouchStart={() => onScreenChanged(proyectorSalaScreen)}>
              {proyectorSalaScreen.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Screens;
