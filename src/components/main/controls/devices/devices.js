import LuzCuarto from './luzCuarto/luzCuarto';
import './devices.css';

function Devices({devicesState, view, changeControlParent}) {
  const changeControl = (value) => {
    changeControlParent(value);
  };
  return (
    <div>
      {view.devices.device === 'luzCuarto' && 
      <LuzCuarto
        devicesState={devicesState}
        changeControlParent={changeControl}>
      </LuzCuarto>
      }
    </div>
  )
}

export default Devices;
