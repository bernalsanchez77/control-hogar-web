import './internet.css';

function Internet({restartParent}) {
  return (
    <div className="views-internet">
      <div className='views-internet-text'>
        <p className='views-internet-text-title'>Error en la aplicacion, no hay conexion a Internet.</p>
        <p className='views-internet-text-description'>La aplicacion no tiene conexion a Internet. Reconectando</p>
      </div>
    </div>
  );
}

export default Internet;
