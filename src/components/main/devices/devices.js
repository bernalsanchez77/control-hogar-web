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

function Devices({credential, ownerCredential, devCredential, devicesState, deviceState, changeDeviceStateParent, changeControlParent}) {
  const triggerControl = (params) => {
    changeControlParent(params);
  }
  const triggerDeviceState = (state) => {
    changeDeviceStateParent(state);
  }

  return (
    <div className="devices">
      <div className='devices-row'>
        <div className='devices-element'>
          <LamparaComedor
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </LamparaComedor>
        </div>
        <div className='devices-element'>
          <LamparaTurca
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </LamparaTurca>
        </div>
        <div className='devices-element'>
          <LamparaSala
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </LamparaSala>
        </div>
        <div className='devices-element'>
          <LamparaRotatoria
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </LamparaRotatoria>
        </div>
        <div className='devices-element'>
          <ChimeneaSala
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </ChimeneaSala>
        </div>
        <div className='devices-element'>
          <ParlantesSala
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </ParlantesSala>
        </div> 
      </div>
      <div className='devices-row'>
        <div className='devices-element'>
          <VentiladorSala
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </VentiladorSala>
        </div>
        {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <CalentadorNegro
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </CalentadorNegro>
        </div>
        }
        {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <CalentadorBlanco
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </CalentadorBlanco>
        </div>
        }
        <div className='devices-element'>
          <LamparasAbajo
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </LamparasAbajo>
        </div>
          {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <LuzCuarto
            devicesState={devicesState}
            deviceState={deviceState}
            triggerDeviceStateParent={triggerDeviceState}
            triggerControlParent={triggerControl}>
          </LuzCuarto>
        </div>
        }
        {(credential === ownerCredential || credential === devCredential) &&
        <div className='devices-element'>
          <LuzEscalera
            devicesState={devicesState}
            triggerControlParent={triggerControl}>
          </LuzEscalera>
        </div>
        }
      </div>
    </div>
  );
}

export default Devices;
