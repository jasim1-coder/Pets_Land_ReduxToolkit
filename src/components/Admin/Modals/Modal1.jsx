import React from "react";
import "./Modal1.css"

const Modal = ({isOpen, onClose, children}) => {
    if(!isOpen) return null ;
    return(
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <button className="custom-modal-close" onClick={onClose}>
                &times;
                </button>
                {children}
            </div>
        </div>
    )
}
export default Modal;