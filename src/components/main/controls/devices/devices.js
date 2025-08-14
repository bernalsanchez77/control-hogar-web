import LuzCuarto from './luzCuarto/luzCuarto';
import './devices.css';

function Devices({devices, view, changeControlParent}) {
  const changeControl = (value) => {
    changeControlParent(value);
  };

  const luzCuarto = devices.find(device => device.id === 'luzCuarto');

  return (
    <div>
      {view.devices.device === 'luzCuarto' && 
      <LuzCuarto
        element={luzCuarto}
        changeControlParent={changeControl}>
      </LuzCuarto>
      }
    </div>
  )
}

export default Devices;
