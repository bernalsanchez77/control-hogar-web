import React from 'react';
import './toolbar.css';

function Toolbar({ devicesState, triggerControlParent }) {
  const triggerControl = (value) => {
    navigator.vibrate([200]);
    const device = 'rokuSala';
    triggerControlParent([device], ['command'], [value], false);
  }

  return (
    <div className='toolbar-levels'>
      <div className='toolbar-levels-row'>
        <div className='toolbar-levels-element toolbar-levels-element--left'>
          <button
            onContextMenu={(e) => e.preventDefault()}
            className='toolbar-levels-button'
            onClick={() => triggerControl('rewind')}>
            &#x23ee;
          </button>
        </div>
        <div className='toolbar-levels-element'>
            <button
                onContextMenu={(e) => e.preventDefault()}
                className={`toolbar-levels-button`}
                onClick={() => triggerControl('play')}>
                &#x23ef;
            </button>
        </div>
        <div className='toolbar-levels-element toolbar-levels-element--right'>
        <button
            onContextMenu={(e) => e.preventDefault()}
            className={'toolbar-levels-button'}
            onClick={() => triggerControl('forward')}>
            &#x23ed;
        </button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar;
