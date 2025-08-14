import LamparaComedor from './lamparaComedor/lamparaComedor';
import LamparaTurca from './lamparaTurca/lamparaTurca';
import LamparaSala from './lamparaSala/lamparaSala';
import LamparaRotatoria from './lamparaRotatoria/lamparaRotatoria';
import LuzCuarto from './luzCuarto/luzCuarto';
import LuzEscalera from './luzEscalera/luzEscalera';
import ChimeneaSala from './chimeneaSala/chimeneaSala';
import ParlantesSala from './parlantesSala/parlantesSala';
import VentiladorSala from './ventiladorSala/ventiladorSala';
import CalentadorNegro from './calentadorNegro/calentadorNegro';
import CalentadorBlanco from './calentadorBlanco/calentadorBlanco';
import LamparasAbajo from './lamparasAbajo/lamparasAbajo';
import './devices.css';

function Devices({credential, view, devices, changeViewParent, changeControlParent}) {
  const changeControl = (params) => {
    changeControlParent(params);
  }
  const changeView = (device) => {
    const newView = structuredClone(view);
    newView.devices.device = device;
    changeViewParent(newView);
  }
  const lamparaComedor = devices.find(device => device.id === 'lamparaComedor');
  const lamparaTurca = devices.find(device => device.id === 'lamparaTurca');
  const lamparaSala = devices.find(device => device.id === 'lamparaSala');
  const lamparaRotatoria = devices.find(device => device.id === 'lamparaRotatoria');
  const chimeneaSala = devices.find(device => device.id === 'chimeneaSala');
  const parlantesSala = devices.find(device => device.id === 'parlantesSala');
  const ventiladorSala = devices.find(device => device.id === 'ventiladorSala');
  const calentadorNegro = devices.find(device => device.id === 'calentadorNegro');
  const calentadorBlanco = devices.find(device => device.id === 'calentadorBlanco');
  const luzCuarto = devices.find(device => device.id === 'luzCuarto');
  const luzEscalera = devices.find(device => device.id === 'luzEscalera');

  return (
    <div className="devices">
      <div className='devices-row'>
        <div className='devices-element'>
          <LamparaComedor
            element={lamparaComedor}
            changeControlParent={changeControl}>
          </LamparaComedor>
        </div>
        <div className='devices-element'>
          <LamparaTurca
            element={lamparaTurca}
            changeControlParent={changeControl}>
          </LamparaTurca>
        </div>
        <div className='devices-element'>
          <LamparaSala
            element={lamparaSala}
            changeControlParent={changeControl}>
          </LamparaSala>
        </div>
        <div className='devices-element'>
          <LamparaRotatoria
            element={lamparaRotatoria}
            changeControlParent={changeControl}>
          </LamparaRotatoria>
        </div>
        <div className='devices-element'>
          <ChimeneaSala
            element={chimeneaSala}
            changeControlParent={changeControl}>
          </ChimeneaSala>
        </div>
        <div className='devices-element'>
          <ParlantesSala
            element={parlantesSala}
            changeControlParent={changeControl}>
          </ParlantesSala>
        </div> 
      </div>
      <div className='devices-row'>
        <div className='devices-element'>
          <VentiladorSala
            element={ventiladorSala}
            changeControlParent={changeControl}>
          </VentiladorSala>
        </div>
        {(credential === 'owner' || credential === 'dev') &&
        <div className='devices-element'>
          <CalentadorNegro
            element={calentadorNegro}
            changeControlParent={changeControl}>
          </CalentadorNegro>
        </div>
        }
        {(credential === 'owner' || credential === 'dev') &&
        <div className='devices-element'>
          <CalentadorBlanco
            element={calentadorBlanco}
            changeControlParent={changeControl}>
          </CalentadorBlanco>
        </div>
        }
        {/* <div className='devices-element'>
          <LamparasAbajo
            changeControlParent={changeControl}>
          </LamparasAbajo>
        </div> */}
        {(credential === 'owner' || credential === 'dev') &&
        <div className='devices-element'>
          <LuzCuarto
            element={luzCuarto}
            changeViewParent={changeView}
            changeControlParent={changeControl}>
          </LuzCuarto>
        </div>
        }
        {(credential === 'owner' || credential === 'dev') &&
        <div className='devices-element'>
          <LuzEscalera
            element={luzEscalera}
            changeControlParent={changeControl}>
          </LuzEscalera>
        </div>
        }
      </div>
    </div>
  );
}

export default Devices;
