/**
 * CreateEmployee.jsx
 * Composant de création d'un nouvel employé avec formulaire complet
 * et feedback utilisateur via des modales
 */

// Imports des dépendances et ressources nécessaires
import states from '../data/states';                                   // Liste des états pour le select
import 'react-datepicker/dist/react-datepicker.css';                  // Styles du date picker
import '../assets/app.css';                                           // Styles personnalisés
import React, { useState, lazy, Suspense, memo } from 'react';        // Hooks et composants React
import { Link } from 'react-router-dom';                              // Navigation
import { Helmet } from 'react-helmet-async';                          // Gestion du head HTML
import useEmployeeStore from '../store/employeeStore';                // Store global des employés

// Chargement paresseux (lazy loading) des composants lourds
// Permet d'optimiser le temps de chargement initial de l'application
const DatePicker = lazy(() => import('react-datepicker'));           // Composant de sélection de date
const Select = lazy(() => import('react-select'));                    // Composant de sélection
const Modal = lazy(() => import('modal-ocr-yanis'));                 // Composant modal personnalisé

// Mémoisation des composants de formulaire pour éviter les re-renders inutiles
const MemoizedSelect = memo(Select);
const MemoizedDatePicker = memo(DatePicker);

/**
 * Composant principal de création d'employé
 * Gère un formulaire complet avec validation et retour utilisateur via des modales
 */
function CreateEmployee() {
    // État pour stocker les données de l'employé
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        startDate: null,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        department: 'Sales'
    });

    // État pour gérer l'affichage des différentes modales
    const [modals, setModals] = useState({
        success: false,        // Modale de succès
        details: false,        // Modale affichant les détails
        confirmation: false,   // Modale de confirmation
        customStyle: false     // Modale avec style personnalisé
    });

    // État pour gérer l'ouverture/fermeture globale des modales
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Récupération de la fonction d'ajout d'employé depuis le store global
    const addEmployee = useEmployeeStore(state => state.addEmployee);

    /**
     * Gère les changements dans les champs input texte et nombre
     * @param {React.ChangeEvent} e - Événement de changement
     */
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEmployee(prev => ({ ...prev, [id]: value }));
    };

    /**
     * Gère le changement de l'état/région sélectionné
     * @param {Object} selectedOption - Option sélectionnée dans le composant Select
     */
    const handleStateChange = (selectedOption) => {
        setEmployee(prev => ({ ...prev, state: selectedOption.value }));
    };

    /**
     * Gère les changements de date (naissance et début)
     * @param {Date} date - Date sélectionnée
     * @param {string} field - Champ à mettre à jour ('dateOfBirth' ou 'startDate')
     */
    const handleDateChange = (date, field) => {
        setEmployee(prev => ({ ...prev, [field]: date }));
    };

    // Options pour le sélecteur d'état/région
    // Conversion du tableau d'états en format attendu par react-select
    const stateOptions = states.map(state => ({
        value: state.abbreviation,
        label: state.name
    }));

    // Options pour le sélecteur de département
    const departmentOptions = [
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Human Resources', label: 'Human Resources' },
        { value: 'Legal', label: 'Legal' }
    ];

    /**
     * Gère les changements dans le sélecteur de département
     * @param {Object} selectedOption - Option sélectionnée
     * @param {Object} meta - Métadonnées du changement incluant le nom du champ
     */
    const handleSelectChange = (selectedOption, { name }) => {
        setEmployee(prev => ({ ...prev, [name]: selectedOption.value }));
    };

    /**
     * Gère la soumission du formulaire
     * Ajoute l'employé et affiche les modales de confirmation
     * @param {React.FormEvent} e - Événement de soumission
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        // Ajout de l'employé au store
        addEmployee(employee);
        setIsModalOpen(true);

        // Affichage de toutes les modales de confirmation
        setModals({
            success: true,
            details: true,
            confirmation: true,
            customStyle: true
        });

        // Réinitialisation du formulaire après soumission
        setEmployee({
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            startDate: null,
            street: '',
            city: '',
            state: '',
            zipCode: '',
            department: 'Sales'
        });
    };

    /**
     * Ferme une modale spécifique
     * @param {string} modalName - Nom de la modale à fermer
     */
    const closeModal = (modalName) => {
        setModals(prev => ({ ...prev, [modalName]: false }));
    };

    return (
        <>
            {/* Gestion du SEO et des métadonnées */}
            <Helmet>
                <title>HRnet - Create New Employee</title>
                <meta name="description" content="Create a new employee. Enter employee details." />
            </Helmet>

            {/* En-tête de la page */}
            <div className="title">
                <h1>HRnet</h1>
            </div>

            <div className="container">
                {/* Lien de navigation vers la liste des employés */}
                <Link to="/employee-list" prefetch="true">View Current Employees</Link>
                <h2>Create Employee</h2>

                {/* Formulaire avec gestion du chargement asynchrone */}
                <Suspense fallback={<div>Loading form...</div>}>
                    <form onSubmit={handleSubmit}>
                        {/* Champs d'informations personnelles */}
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={employee.firstName}
                            onChange={handleInputChange}
                            required
                        />

                        {/* Autres champs de formulaire similaires... */}

                        {/* Section adresse groupée dans un fieldset */}
                        <fieldset className="address">
                            <legend>Address</legend>
                            {/* Champs d'adresse... */}
                        </fieldset>

                        {/* Sélection du département */}
                        <label htmlFor="department">Department</label>
                        <Select
                            id="department"
                            name="department"
                            options={departmentOptions}
                            value={departmentOptions.find(option => option.value === employee.department)}
                            onChange={handleSelectChange}
                            placeholder="Select Department"
                            required
                        />

                        <button type="submit">Save</button>
                    </form>
                </Suspense>

                {/* Modales de feedback utilisateur */}
                {/* Modale de succès */}
                <Modal
                    isOpen={modals.success}
                    onClose={() => closeModal('success')}
                    title="Success"
                >
                    <p>Employee Created Successfully! :p</p>
                </Modal>

                {/* Modale de détails de l'employé créé */}
                <Modal
                    isOpen={modals.details}
                    onClose={() => closeModal('details')}
                    title="Employee Details"
                >
                    <h3>New Employee Added: </h3>
                    <p>Name: {employee.firstName} {employee.lastName}</p>
                    <p>Department: {employee.department}</p>
                    <p>Start Date: {employee.startDate && employee.startDate.toDateString()}</p>
                </Modal>

                {/* Modale de confirmation */}
                <Modal
                    isOpen={modals.confirmation}
                    onClose={() => closeModal('confirmation')}
                    title="Confirm Action"
                    className="confirmation-modal"
                >
                    <p>Are you sure you want to add this employee?</p>
                    <button onClick={() => closeModal('confirmation')}>Yes</button>
                    <button onClick={() => closeModal('confirmation')}>No</button>
                </Modal>

                {/* Modale avec style personnalisé */}
                <Modal
                    isOpen={modals.customStyle}
                    onClose={() => closeModal('customStyle')}
                    title="Custom Styled Modal"
                    className="custom-modal"
                >
                    <p style={{ color: 'green', fontSize: '18px' }}>This modal has custom styling!</p>
                    <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                        <p>You can customize the content and style of each modal individually!</p>
                    </div>
                </Modal>
            </div>
        </>
    );
}

// Export du composant avec mémoisation pour optimiser les performances
export default memo(CreateEmployee);