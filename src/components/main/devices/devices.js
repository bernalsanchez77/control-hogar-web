import { store } from "../../../store/store";
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
import viewRouter from '../../../global/view-router';
import './devices.css';


function Devices() {
  const userCredentialSt = store(v => v.userCredentialSt);
  const devicesSt = store(v => v.devicesSt);
  const viewSt = store(v => v.viewSt);
  const changeView = async (device) => {
    const newView = structuredClone(viewSt);
    newView.devices.device = device;
    await viewRouter.changeView(newView);
  }
  const lamparaComedor = devicesSt.find(device => device.id === 'lamparaComedor');
  const lamparaTurca = devicesSt.find(device => device.id === 'lamparaTurca');
  const lamparaSala = devicesSt.find(device => device.id === 'lamparaSala');
  const lamparaRotatoria = devicesSt.find(device => device.id === 'lamparaRotatoria');
  const chimeneaSala = devicesSt.find(device => device.id === 'chimeneaSala');
  const parlantesSala = devicesSt.find(device => device.id === 'parlantesSala');
  const ventiladorSala = devicesSt.find(device => device.id === 'ventiladorSala');
  const calentadorNegro = devicesSt.find(device => device.id === 'calentadorNegro');
  const calentadorBlanco = devicesSt.find(device => device.id === 'calentadorBlanco');
  const luzCuarto = devicesSt.find(device => device.id === 'luzCuarto');
  const luzEscalera = devicesSt.find(device => device.id === 'luzEscalera');

  return (
    <div className="devices">
      <div className='devices-row'>
        <div className='devices-element'>
          <LamparaComedor
            element={lamparaComedor}>
          </LamparaComedor>
        </div>
        <div className='devices-element'>
          <LamparaTurca
            element={lamparaTurca}>
          </LamparaTurca>
        </div>
        <div className='devices-element'>
          <LamparaSala
            element={lamparaSala}>
          </LamparaSala>
        </div>
        <div className='devices-element'>
          <LamparaRotatoria
            element={lamparaRotatoria}>
          </LamparaRotatoria>
        </div>
        <div className='devices-element'>
          <ChimeneaSala
            element={chimeneaSala}>
          </ChimeneaSala>
        </div>
        <div className='devices-element'>
          <ParlantesSala
            element={parlantesSala}>
          </ParlantesSala>
        </div>
      </div>
      <div className='devices-row'>
        <div className='devices-element'>
          <VentiladorSala
            element={ventiladorSala}>
          </VentiladorSala>
        </div>
        {(userCredentialSt === 'owner' || userCredentialSt === 'dev') &&
          <div className='devices-element'>
            <CalentadorNegro
              element={calentadorNegro}>
            </CalentadorNegro>
          </div>
        }
        {(userCredentialSt === 'owner' || userCredentialSt === 'dev') &&
          <div className='devices-element'>
            <CalentadorBlanco
              element={calentadorBlanco}>
            </CalentadorBlanco>
          </div>
        }
        <div className='devices-element'>
          <LamparasAbajo
            chimeneaSala={chimeneaSala}
            lamparaTurca={lamparaTurca}
            lamparaSala={lamparaSala}
            lamparaComedor={lamparaComedor}>
          </LamparasAbajo>
        </div>
        {(userCredentialSt === 'owner' || userCredentialSt === 'dev') &&
          <div className='devices-element'>
            <LuzCuarto
              element={luzCuarto}
              changeViewParent={changeView}>
            </LuzCuarto>
          </div>
        }
        {(userCredentialSt === 'owner' || userCredentialSt === 'dev') &&
          <div className='devices-element'>
            <LuzEscalera
              element={luzEscalera}>
            </LuzEscalera>
          </div>
        }
      </div>
    </div>
  );
}

export default Devices;
