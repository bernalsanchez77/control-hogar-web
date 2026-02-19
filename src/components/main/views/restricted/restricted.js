import { useRestricted } from './useRestricted';
import './restricted.css';

function Restricted() {
  useRestricted();

  return (
    <div className="views-restricted">
      <div className='views-restricted-text'>
        <p className='views-restricted-text-title'>Error en la aplicacion, acceso restringido.</p>
        <p className='views-restricted-text-description'>La aplicacion no tiene permisos de acceso.</p>
      </div>
    </div>
  );
}

export default Restricted;
