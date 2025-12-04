import { store } from "../../../../store/store";
import Requests from "../../../../global/requests";
import './top.css';

function Controls({ changeControlParent }) {
  const requests = new Requests(store(v => v.isPcSt));
  const screenSelectedSt = store(v => v.screenSelectedSt);
  const screensSt = store(v => v.screensSt);
  const viewSt = store(v => v.viewSt);
  const screen = screensSt.find(screen => screen.id === screenSelectedSt);
  const changePower = () => {
    if (screenSelectedSt === 'proyectorSala') {
      if (screen.state === 'on') {
        requests.sendIfttt({ device: screenSelectedSt, key: 'state', value: 'off' });
        requests.updateTableInSupabase({ new: { newId: screenSelectedSt, newTable: 'screens', newState: 'off' } });
        requests.sendIfttt({ device: 'parlantesSala', key: 'state', value: 'off' });
        requests.updateTableInSupabase({ new: { newId: 'parlantesSala', newTable: 'devices', newState: 'off' } });
        requests.sendIfttt({ device: 'lamparaSala', key: 'state', value: 'off' });
        requests.updateTableInSupabase({ new: { newId: 'lamparaSala', newTable: 'devices', newState: 'off' } });
        requests.sendIfttt({ device: 'lamparaComedor', key: 'state', value: 'off' });
        requests.updateTableInSupabase({ new: { newId: 'lamparaComedor', newTable: 'devices', newState: 'off' } });

        setTimeout(() => {
          requests.sendIfttt({ device: 'proyectorSalaSwitch', key: 'state', value: 'off' });
          requests.updateTableInSupabase({ new: { newId: 'proyectorSalaSwitch', newTable: 'devices', newState: 'off' } });
        }, 30000);
      } else {
        changeControlParent({
          ifttt: [
            { device: 'proyectorSalaSwitch', key: 'state', value: 'on' },
            { device: 'parlantesSala', key: 'state', value: 'on' },
            { device: 'lamparaSala', key: 'state', value: 'on' },
            { device: 'lamparaComedor', key: 'state', value: 'on' },
          ]
        });

        setTimeout(() => {
          changeControlParent({ ifttt: [{ device: screenSelectedSt, key: 'state', value: 'on' }] });
        }, 5000);
      }
    } else {
      if (screen.state === 'on') {
        changeControlParent({ ifttt: [{ device: screenSelectedSt, key: 'state', value: 'off' }] });
        setTimeout(() => {
          // changeControlParent({ifttt: [{device: screenSelectedSt, key: 'mute', value: 'off'}]});
        }, 2000);
      } else {
        changeControlParent({ ifttt: [{ device: screenSelectedSt, key: 'state', value: 'on' }] });
      }
    }
  }
  const changeHdmi = () => {
    const device = 'hdmiSala';
    if (viewSt.selected === 'roku') {
      changeControlParent({ ifttt: [{ device, key: 'state', value: 'cable' }] });
    }
    if (viewSt.selected === 'cable') {
      changeControlParent({ ifttt: [{ device, key: 'state', value: 'roku' }] });
    }
  }
  const changeInput = () => {
    const device = screenSelectedSt;
    if (screen.input === 'hdmi1') {
      changeControlParent({
        ifttt: [{ device: device, key: 'input', value: 'hdmi2' }],
        massMedia: [{ device, key: ['input', 'state'], value: 'hdmi2' }]
      })
    } else {
      changeControlParent({
        ifttt: [{ device, key: 'input', value: 'hdmi1' }],
        massMedia: [{ device: device, key: ['input', 'state'], value: 'hdmi1' }]
      })
    }
  }
  return (
    <div className='controls-top'>
      <div className='controls-top-row'>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => changePower()}>
            {screen.state === 'on' &&
              <img
                className='controls-top-img controls-top-img--button'
                src="/imgs/power-on-50.png"
                alt="icono">
              </img>
            }
            {screen.state === 'off' &&
              <img
                className='controls-top-img controls-top-img--button'
                src="/imgs/power-off-50.png"
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className="controls-top-button controls-top-button-off"
            onTouchStart={() => changeHdmi()}>
            {viewSt.selected === 'cable' &&
              <img
                className='controls-top-img controls-top-img--roku'
                src='/imgs/roku.png'
                alt="icono">
              </img>
            }
            {viewSt.selected === 'roku' &&
              <img
                className='controls-top-img controls-top-img--telecable'
                src='/imgs/telecable.png'
                alt="icono">
              </img>
            }
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => changeInput()}>
            {screen.inputLabel1}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
