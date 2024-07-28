import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, onConfirm }){
    if(!isOpen){ 
        return null;
    }

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Navigation</h2>
                <p>Are you sure you want to leave this page? Any unsaved changes will be lost.</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Yes, go back</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
