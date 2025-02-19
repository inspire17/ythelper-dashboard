// MinimizedModalStack.js
import React from 'react';

const MinimizedModalStack = ({ minimizedModals, onRestoreModal }) => {
  return (
    <div className="minimized-modal-stack">
      {minimizedModals.map((modal, index) => (
        <div
          key={index}
          className="minimized-modal"
          onClick={() => onRestoreModal(modal.id)}
        >
          <span>Upload {modal.id}</span>
          <div className="progress-bar">
            <div style={{ width: `${modal.progress}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MinimizedModalStack;
