import {store} from "../../../../store/store";
import LuzCuarto from './luzCuarto/luzCuarto';
import './devices.css';

function Devices({changeControlParent}) {
  const devicesSt = store(v => v.devicesSt);
  const viewSt = store(v => v.viewSt);
  const changeControl = (value) => {
    changeControlParent(value);
  };

  const luzCuarto = devicesSt.find(device => device.id === 'luzCuarto');

  return (
    <div>
      {viewSt.devices.device === 'luzCuarto' && 
      <LuzCuarto
        element={luzCuarto}
        changeControlParent={changeControl}>
      </LuzCuarto>
      }
    </div>
  )
}

export default Devices;
