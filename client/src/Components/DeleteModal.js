import React from 'react';
import './DeleteModal.css';

function DeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen){
        return null;
    } 

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this book? This action cannot be undone.</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Yes, delete</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
