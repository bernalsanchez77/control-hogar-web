import React from 'react';
import './devices.css';

function Devices({ devices, onCambiarNombre }) {
  const triggerDevice = () => {
    onCambiarNombre();
  }

  return (
    <div className="main">
      <div>
      <button onClick={() => triggerDevice(devices.lamparaComedor.id)}>{devices.lamparaComedor.label} {devices.lamparaComedor.state}</button>
      </div>
      <div>
      <button onClick={() => triggerDevice(devices.lamparaTurca.id)}>{devices.lamparaTurca.label} {devices.lamparaTurca.state}</button>
      </div>
    </div>
  );
}

export default Devices;
