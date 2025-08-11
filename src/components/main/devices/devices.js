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

function Devices({credential, ownerCredential, devCredential, view, devicesState, changeViewParent, changeControlParent}) {
  const changeControl = (params) => {
    changeControlParent(params);
  }
  const changeView = (device) => {
    const newView = structuredClone(view);
    newView.devices.device = device;
    changeViewParent(newView);
  }

  return (
    <div className="devices">
      <div className='devices-row'>
        <div className='devices-element'>
          <LamparaComedor
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </LamparaComedor>
        </div>
        <div className='devices-element'>
          <LamparaTurca
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </LamparaTurca>
        </div>
        <div className='devices-element'>
          <LamparaSala
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </LamparaSala>
        </div>
        <div className='devices-element'>
          <LamparaRotatoria
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </LamparaRotatoria>
        </div>
        <div className='devices-element'>
          <ChimeneaSala
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </ChimeneaSala>
        </div>
        <div className='devices-element'>
          <ParlantesSala
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </ParlantesSala>
        </div> 
      </div>
      <div className='devices-row'>
        <div className='devices-element'>
          <VentiladorSala
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </VentiladorSala>
        </div>
        {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <CalentadorNegro
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </CalentadorNegro>
        </div>
        }
        {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <CalentadorBlanco
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </CalentadorBlanco>
        </div>
        }
        <div className='devices-element'>
          <LamparasAbajo
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </LamparasAbajo>
        </div>
          {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <LuzCuarto
            devicesState={devicesState}
            changeViewParent={changeView}
            changeControlParent={changeControl}>
          </LuzCuarto>
        </div>
        }
        {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <LuzEscalera
            devicesState={devicesState}
            changeControlParent={changeControl}>
          </LuzEscalera>
        </div>
        }
      </div>
    </div>
  );
}

export default Devices;
