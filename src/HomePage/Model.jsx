import React from 'react';
import './Model.css'; // Import your custom styles

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;