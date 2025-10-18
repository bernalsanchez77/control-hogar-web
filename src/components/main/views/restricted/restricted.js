import './restricted.css';

function Restricted() {
  return (
    <div className="views-restricted">
      <div className='views-restricted-text'>
        <p className='views-restricted-text-title'>Error en la aplicacion, acceso restringido.</p>
        <p className='views-restricted-text-description'>La aplicacion no tiene permisos de acceso.</p>
      </div>
      {/* <div className='views-internet-button'>
        <button
          onTouchStart={() => restart()}>
            Reintentar
        </button>
      </div> */}
    </div>
  );
}

export default Restricted;
