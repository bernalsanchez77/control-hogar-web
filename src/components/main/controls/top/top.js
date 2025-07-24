import './top.css';

function Controls({devicesState, screenSelected, triggerControlParent}) {
  const triggerPower = () => {
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent({
          ifttt: [
            [{device: screenSelected, key: 'state', value: 'off'}],
            [{device: devicesState.parlantesSala.id, key: 'state', value: 'off'}],
            [{device: devicesState.lamparaSala.id, key: 'state', value: 'off'}],
            [{device: devicesState.lamparaComedor.id, key: 'state', value: 'off'}],
          ]
        });
        setTimeout(() => {
          triggerControlParent({
            ifttt: [[{device: devicesState.proyectorSwitchSala.id, key: 'state', value: 'off'}]],
          });
        }, 60000);
      } else {
        triggerControlParent({
          ifttt: [
            [{device: devicesState.proyectorSwitchSala.id, key: 'state', value: 'on'}],
            [{device: devicesState.parlantesSala.id, key: 'state', value: 'on'}],
            [{device: devicesState.lamparaSala.id, key: 'state', value: 'on'}],
            [{device: devicesState.lamparaComedor.id, key: 'state', value: 'on'}],
          ]
        });

        setTimeout(() => {
          triggerControlParent({ifttt: [[{device: screenSelected, key: 'state', value: 'on'}]]});
        }, 5000);
      }
    } else {
      if (devicesState[screenSelected].state === 'on') {
        triggerControlParent({ifttt: [[{device: screenSelected, key: 'state', value: 'off'}]]});
        setTimeout(() => {
          // triggerControlParent({ifttt: [[{device: screenSelected, key: 'mute', value: 'off'}]]});
        }, 2000);
      } else {
        triggerControlParent({ifttt: [[{device: screenSelected, key: 'state', value: 'on'}]]});
      }
    }
  }
  const triggerHdmi = () => {
    const device = devicesState.hdmiSala.id;
    if (devicesState[devicesState.hdmiSala.id].state === 'roku') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'cable'}]]});
    }
    if (devicesState[devicesState.hdmiSala.id].state === 'cable') {
      triggerControlParent({ifttt: [[{device, key: 'state', value: 'roku'}]]});
    }
  }
  const triggerInput = () => {
    const device = devicesState[screenSelected].id;
    if (devicesState[screenSelected].input.state === 'hdmi1') {
      triggerControlParent({
        ifttt: [[{device: device, key: 'input', value: 'hdmi2'}]],
        massMedia: [[{device, key: ['input', 'state'], value: 'hdmi2'}]]
      })
    } else {
      triggerControlParent({
        ifttt: [[{device, key: 'input', value: 'hdmi1'}]],
        massMedia: [[{device: device, key: ['input', 'state'], value: 'hdmi1'}]]
      })
    }
  }
  return (
    <div className='controls-top'>
      <div className='controls-top-row'>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => triggerPower()}>
              {devicesState[screenSelected].state === 'on' &&
                <img
                  className='controls-top-img controls-top-img--button'
                  src="/imgs/power-on-50.png"
                  alt="icono">
                </img>
              }
              {devicesState[screenSelected].state === 'off' &&
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
            onTouchStart={() => triggerHdmi()}>
              {devicesState.hdmiSala.label[devicesState.hdmiSala.state]}
          </button>
        </div>
        <div className='controls-top-element'>
          <button
            className={`controls-top-button`}
            onTouchStart={() => triggerInput()}>
              {devicesState[screenSelected].input.label[devicesState[screenSelected].input.state]}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
