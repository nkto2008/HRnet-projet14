import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../assets/Modal.css';

/**
 * Composant Modal réutilisable
 * Affiche une fenêtre modale avec un fond semi-transparent et gère sa fermeture
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.isOpen - État d'ouverture de la modale
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 * @param {ReactNode} props.children - Contenu de la modale
 * @param {string} props.className - Classes CSS additionnelles (optionnel)
 * @param {string} props.closeText - Texte du bouton de fermeture (optionnel)
 */
const Modal = ({ isOpen, onClose, children, className = '', closeText = 'Close' }) => {
    // Référence vers l'élément DOM de la modale pour gérer les clics extérieurs
    const modalRef = useRef(null);

    /**
     * Effect pour gérer les événements clavier et le scroll du body
     * - Ajoute la gestion de la touche Escape
     * - Bloque le scroll du body quand la modale est ouverte
     */
    useEffect(() => {
        // Gestionnaire pour la touche Escape
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Si la modale est ouverte, on ajoute les listeners et classes nécessaires
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.classList.add('react-modal-open');
        }

        // Nettoyage lors du démontage du composant
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.classList.remove('react-modal-open');
        };
    }, [isOpen, onClose]);

    /**
     * Gère le clic sur le fond de la modale
     * Ferme la modale uniquement si le clic est sur le fond (pas sur le contenu)
     * 
     * @param {React.MouseEvent} event - L'événement de clic
     */
    const handleOverlayClick = (event) => {
        if (event.target === modalRef.current) {
            onClose();
        }
    };

    // Si la modale n'est pas ouverte, on ne rend rien
    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className={`react-modal ${className}`}
            onClick={handleOverlayClick}
        >
            <div className="react-modal-content">
                {children}
                <a
                    href="#close-modal"
                    rel="modal:close"
                    className="close-modal"
                    onClick={onClose}
                >
                    {closeText}
                </a>
            </div>
        </div>
    );
};

// Validation des props avec PropTypes
Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,      // État d'ouverture de la modale
    onClose: PropTypes.func.isRequired,     // Fonction de fermeture
    children: PropTypes.node.isRequired,    // Contenu de la modale
    className: PropTypes.string,            // Classes CSS additionnelles
    closeText: PropTypes.string,            // Texte du bouton de fermeture
};

export default Modal;