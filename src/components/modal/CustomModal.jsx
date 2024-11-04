/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import '../modal/style.scss'
import { MdClose } from "react-icons/md";


const Modal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}><MdClose size={30} /></button>
                {children}
            </div>
        </div>
    )
}

export default Modal