import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../assets/Modal.css';

const Modal = ({ isOpen, onClose, children, className = '', closeText = 'Close' }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.classList.add('react-modal-open');
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.classList.remove('react-modal-open');
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (event) => {
        if (event.target === modalRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className={`react-modal ${className}`}
            onClick={handleOverlayClick}
        >
            <div className="react-modal-content">
                {children}
                <a href="#close-modal" rel="modal:close" className="close-modal" onClick={onClose}>
                    {closeText}
                </a>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    closeText: PropTypes.string,
};

export default Modal;