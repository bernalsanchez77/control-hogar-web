import { useDevicesControls } from './useDevicesControls';
import LuzCuarto from './luzCuarto/luzCuarto';
import './devices.css';

function Devices() {
  const { viewSt, luzCuarto } = useDevicesControls();

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
