import { store } from "../../../store/store";
import utils from '../../../global/utils';
import CordovaPlugins from '../../../global/cordova-plugins';
import './screens.css';
function Screens({ changeScreenParent }) {
  const isInForegroundSt = store(v => v.isInForegroundSt);
  const userTypeSt = store(v => v.userTypeSt);
  const screenSelectedSt = store(v => v.screenSelectedSt);
  const setScreenSelectedSt = store(v => v.setScreenSelectedSt);
  const screensSt = store(v => v.screensSt);
  const isAppSt = store(v => v.isAppSt);
  const teleSalaScreen = screensSt.find(screen => screen.id === 'teleSala');
  const teleCuartoScreen = screensSt.find(screen => screen.id === 'teleCuarto');
  const teleCocinaScreen = screensSt.find(screen => screen.id === 'teleCocina');
  const proyectorSalaScreen = screensSt.find(screen => screen.id === 'proyectorSala');

  const onScreenChanged = (screen) => {
    if (screenSelectedSt !== screen.id) {
      utils.triggerVibrate();
      setScreenSelectedSt(screen.id);
      localStorage.setItem('screen-id', screen.id);
      if (isAppSt) {
        CordovaPlugins.updateScreenSelected(screen.label + ' ' + screen.state.toUpperCase());
        CordovaPlugins.updateScreenState(screen.state);
        CordovaPlugins.updateMuteState(screen.mute);
      }
    }
  };
  return (
    <div>
      <div className='screens'>
        <div className='screens-row'>
          {(userTypeSt === 'owner' || userTypeSt === 'dev' || userTypeSt === '') &&
            <div className='screens-element'>
              <button
                className={`screens-button ${isInForegroundSt && screenSelectedSt === teleCuartoScreen.id ? "flash-shadow" : "no-flash"}  ${screenSelectedSt === teleCuartoScreen.id ? "screens-button--on" : "screens-button--off"}`}
                onTouchStart={() => onScreenChanged(teleCuartoScreen)}>
                {teleCuartoScreen.label}
              </button>
            </div>
          }
          <div className='screens-element'>
            <button
              className={`screens-button ${isInForegroundSt && screenSelectedSt === teleSalaScreen.id ? "flash-shadow" : "no-flash"} ${screenSelectedSt === teleSalaScreen.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => onScreenChanged(teleSalaScreen)}>
              {teleSalaScreen.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={`screens-button ${isInForegroundSt && screenSelectedSt === teleCocinaScreen.id ? "flash-shadow" : "no-flash"} ${screenSelectedSt === teleCocinaScreen.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => onScreenChanged(teleCocinaScreen)}>
              {teleCocinaScreen.label}
            </button>
          </div>
          <div className='screens-element'>
            <button
              className={`screens-button ${isInForegroundSt && screenSelectedSt === proyectorSalaScreen.id ? "flash-shadow" : "no-flash"} ${screenSelectedSt === proyectorSalaScreen.id ? "screens-button--on" : "screens-button--off"}`}
              onTouchStart={() => onScreenChanged(proyectorSalaScreen)}>
              {proyectorSalaScreen.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screens;
