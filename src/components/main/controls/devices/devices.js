import { store } from "../../../../store/store";
import LuzCuarto from './luzCuarto/luzCuarto';
import './devices.css';

function Devices() {
  const devicesSt = store(v => v.devicesSt);
  const viewSt = store(v => v.viewSt);

  const luzCuarto = devicesSt.find(device => device.id === 'luzCuarto');

  return (
    <div>
      {viewSt.devices.device === 'luzCuarto' &&
        <LuzCuarto
          element={luzCuarto}>
        </LuzCuarto>
      }
    </div>
  )
}

export default Devices;
