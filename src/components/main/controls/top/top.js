import './top.css';

function Controls({devicesState, view, screenSelected, changeControlParent}) {
  const changePower = () => {
    if (screenSelected === devicesState.proyectorSala.id) {
      if (devicesState[screenSelected].state === 'on') {
        changeControlParent({
          ifttt: [
            [{device: screenSelected, key: 'state', value: 'off'}],
            [{device: devicesState.parlantesSala.id, key: 'state', value: 'off'}],
            [{device: devicesState.lamparaSala.id, key: 'state', value: 'off'}],
            [{device: devicesState.lamparaComedor.id, key: 'state', value: 'off'}],
          ]
        });
        setTimeout(() => {
          changeControlParent({
            ifttt: [{device: devicesState.proyectorSwitchSala.id, key: 'state', value: 'off'}],
          });
        }, 60000);
      } else {
        changeControlParent({
          ifttt: [
            [{device: devicesState.proyectorSwitchSala.id, key: 'state', value: 'on'}],
            [{device: devicesState.parlantesSala.id, key: 'state', value: 'on'}],
            [{device: devicesState.lamparaSala.id, key: 'state', value: 'on'}],
            [{device: devicesState.lamparaComedor.id, key: 'state', value: 'on'}],
          ]
        });

        setTimeout(() => {
          changeControlParent({ifttt: [{device: screenSelected, key: 'state', value: 'on'}]});
        }, 5000);
      }
    } else {
      if (devicesState[screenSelected].state === 'on') {
        changeControlParent({ifttt: [{device: screenSelected, key: 'state', value: 'off'}]});
        setTimeout(() => {
          // changeControlParent({ifttt: [{device: screenSelected, key: 'mute', value: 'off'}]});
        }, 2000);
      } else {
        changeControlParent({ifttt: [{device: screenSelected, key: 'state', value: 'on'}]});
      }
    }
  }
  const changeHdmi = () => {
    const device = 'hdmiSala';
    if (view.selected === 'roku') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'cable'}]});
    }
    if (view.selected === 'cable') {
      changeControlParent({ifttt: [{device, key: 'state', value: 'roku'}]});
    }
  }
  const changeInput = () => {
    const device = devicesState[screenSelected].id;
    if (devicesState[screenSelected].input.state === 'hdmi1') {
      changeControlParent({
        ifttt: [{device: device, key: 'input', value: 'hdmi2'}],
        massMedia: [{device, key: ['input', 'state'], value: 'hdmi2'}]
      })
    } else {
      changeControlParent({
        ifttt: [{device, key: 'input', value: 'hdmi1'}],
        massMedia: [{device: device, key: ['input', 'state'], value: 'hdmi1'}]
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
            onTouchStart={() => changeHdmi()}>
              {view.selected === 'cable' &&
                <img
                  className='controls-top-img controls-top-img--roku'
                  src='/imgs/roku.png'
                  alt="icono">
                </img>
              }
              {view.selected === 'roku' &&
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
              {devicesState[screenSelected].input.label[devicesState[screenSelected].input.state]}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls;
