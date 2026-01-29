function CalentadorBlanco({ element, onTouchStartParent, onTouchEndParent }) {
  return (
    <div className="calentadorBlanco">
      <div>
        <button
          className={`devices-button ${element.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={(e) => onTouchStartParent(element, e)}
          onTouchEnd={(e) => onTouchEndParent(element, e)}>
          <img
            className='devices-button-img'
            src={element.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}
export default CalentadorBlanco;
