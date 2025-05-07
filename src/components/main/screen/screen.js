import React from 'react';
import './screen.css';

function Screen() {
  return (
    <div>
      <div className='screen'>
        <div className='screen-row'>
          <div className='screen-element'>
            <button className='screen-button'>Cuarto</button>
          </div>
          <div className='screen-element'>
            <button className='screen-button'>Sala</button>
            </div>
          <div className='screen-element'>
            <button className='screen-button'>Proyector</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screen;
