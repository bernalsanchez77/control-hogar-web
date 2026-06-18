import { useInternet } from './useInternet';
import './internet.css';

function Internet() {
  useInternet();

  return (
    <div className="views-internet">
      <div className='views-internet-text'>
        <p className='views-internet-text-title'>Sin conexion a Internet</p>
        <p className='views-internet-text-description'>Reconectando...</p>
      </div>
    </div>
  );
}

export default Internet;
