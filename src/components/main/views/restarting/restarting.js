import { useRestarting } from './useRestarting';
import './restarting.css';

function Restarting() {
  useRestarting();

  return (
    <div className="views-restarting">
      <div className='views-restarting-text'>
        <p className='views-restarting-text-title'>Reiniciando aplicacion...</p>
        <p className='views-restarting-text-description'>La aplicacion se reiniciara en unos momentos.</p>
      </div>
    </div>
  );
}

export default Restarting;
