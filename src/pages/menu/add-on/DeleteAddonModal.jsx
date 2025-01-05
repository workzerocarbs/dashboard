import React from "react";
import "./addOn.css";
const DeleteAddonModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
    <div className="custom-modal-container">
      <div style={{backgroundColor:"#B3DB5F"}}className="custom-modal-header">
        <h3>Delete Add-on</h3>
        <button className="custom-modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="custom-modal-body">
        <p>Are you sure you want to delete this add-on item?</p>
      </div>
      <div className="custom-modal-footer">
        <button className="custom-modal-cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button className="custom-modal-delete-button" onClick={ onDelete}>
          Delete
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default DeleteAddonModal;
