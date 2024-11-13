/**
 * CreateEmployee.jsx
 * Composant principal pour la création d'employés
 * Style harmonisé avec EmployeeList et design moderne
 */

// Imports des dépendances et ressources nécessaires
import states from '../data/states';                                   // Liste des états pour le select
import 'react-datepicker/dist/react-datepicker.css';                  // Styles du date picker
import '../assets/CreateEmployee.css';                                         // Styles personnalisés
import '../assets/app.css'
import React, { useState, lazy, Suspense, memo } from 'react';        // Hooks et composants React
import { Link } from 'react-router-dom';                              // Navigation
import { Helmet } from 'react-helmet-async';                          // Gestion du head HTML
import useEmployeeStore from '../store/employeeStore';                // Store global des employés

// Chargement paresseux des composants lourds
const DatePicker = lazy(() => import('react-datepicker'));           // Sélecteur de date
const Select = lazy(() => import('react-select'));                    // Menu déroulant amélioré
const Modal = lazy(() => import('modal-ocr-yanis'));                 // Modal personnalisée

// Mémoisation des composants de formulaire pour éviter les re-renders inutiles
const MemoizedSelect = memo(Select);
const MemoizedDatePicker = memo(DatePicker);

/**
 * Configuration des options de département
 * Liste statique des départements disponibles
 */
const DEPARTMENT_OPTIONS = [
    { value: 'Sales', label: 'Sales' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Legal', label: 'Legal' }
];

/**
 * Composant CreateEmployee
 * Gère le formulaire de création d'employé avec validation et retour utilisateur
 */
function CreateEmployee() {
    // État initial de l'employé
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

    // État des modales
    const [modals, setModals] = useState({
        success: false,        // Modal de confirmation de création
        details: false,        // Modal affichant les détails de l'employé créé
    });

    // Accès à la fonction d'ajout d'employé du store
    const addEmployee = useEmployeeStore(state => state.addEmployee);

    /**
     * Gère les changements dans les champs input
     * @param {React.ChangeEvent} e - Événement de changement
     */
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEmployee(prev => ({ ...prev, [id]: value }));
    };

    /**
     * Gère la sélection d'état/région
     * @param {Object} selectedOption - Option sélectionnée dans le Select
     */
    const handleStateChange = (selectedOption) => {
        setEmployee(prev => ({ ...prev, state: selectedOption.value }));
    };

    /**
     * Gère les changements de date
     * @param {Date} date - Date sélectionnée
     * @param {string} field - Champ à mettre à jour ('dateOfBirth' ou 'startDate')
     */
    const handleDateChange = (date, field) => {
        setEmployee(prev => ({ ...prev, [field]: date }));
    };

    /**
     * Configuration des options d'états pour le Select
     * Conversion du format pour react-select
     */
    const stateOptions = states.map(state => ({
        value: state.abbreviation,
        label: state.name
    }));

    /**
     * Gère la sélection du département
     * @param {Object} selectedOption - Option sélectionnée
     * @param {Object} meta - Métadonnées incluant le nom du champ
     */
    const handleDepartmentChange = (selectedOption, { name }) => {
        setEmployee(prev => ({ ...prev, [name]: selectedOption.value }));
    };

    /**
     * Gère la soumission du formulaire
     * @param {React.FormEvent} e - Événement de soumission
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Ajout de l'employé au store
        addEmployee(employee);

        // Affichage des modales de confirmation
        setModals({
            success: true,
            details: true
        });

        // Réinitialisation du formulaire
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
            {/* SEO et métadonnées */}
            <Helmet>
                <title>HRnet - Create New Employee</title>
                <meta name="description" content="Create a new employee. Enter employee details." />
            </Helmet>

            <div className="employee-container">
                {/* Titre principal */}
                <h1>HRnet Employee Creation</h1>

                {/* Navigation */}
                <div className="navigation">
                    <Link to="/employee-list" className="nav-link">
                        View Current Employees
                    </Link>
                </div>

                {/* Section du formulaire */}
                <div className="form-section">
                    <Suspense fallback={
                        <div className="loading-container">
                            <div className="loading-spinner" />
                        </div>
                    }>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                {/* Informations personnelles */}
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="form-input"
                                        value={employee.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="form-input"
                                        value={employee.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Sélecteurs de date */}
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <div className="date-picker-container">
                                        <DatePicker
                                            id="dateOfBirth"
                                            selected={employee.dateOfBirth}
                                            onChange={(date) => handleDateChange(date, 'dateOfBirth')}
                                            className="date-picker-input"
                                            required
                                            placeholderText="Select date"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date</label>
                                    <div className="date-picker-container">
                                        <DatePicker
                                            id="startDate"
                                            selected={employee.startDate}
                                            onChange={(date) => handleDateChange(date, 'startDate')}
                                            className="date-picker-input"
                                            required
                                            placeholderText="Select date"
                                        />
                                    </div>
                                </div>

                                {/* Informations d'adresse */}
                                <div className="form-group">
                                    <label htmlFor="street">Street</label>
                                    <input
                                        type="text"
                                        id="street"
                                        className="form-input"
                                        value={employee.street}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        className="form-input"
                                        value={employee.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <Select
                                        id="state"
                                        options={stateOptions}
                                        value={stateOptions.find(option => option.value === employee.state)}
                                        onChange={handleStateChange}
                                        className="custom-select"
                                        classNamePrefix="react-select"
                                        placeholder="Select State"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="zipCode">Zip Code</label>
                                    <input
                                        type="number"
                                        id="zipCode"
                                        className="form-input"
                                        value={employee.zipCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Sélection du département */}
                                <div className="form-group">
                                    <label htmlFor="department">Department</label>
                                    <Select
                                        id="department"
                                        name="department"
                                        options={DEPARTMENT_OPTIONS}
                                        value={DEPARTMENT_OPTIONS.find(option => option.value === employee.department)}
                                        onChange={handleDepartmentChange}
                                        className="custom-select"
                                        classNamePrefix="react-select"
                                        placeholder="Select Department"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="submit-container">
                                <button type="submit" className="submit-button">
                                    Create Employee
                                </button>
                            </div>
                        </form>
                    </Suspense>
                </div>

                {/* Modales de feedback */}
                <Modal
                    isOpen={modals.success}
                    onClose={() => closeModal('success')}
                    title="Success"
                >
                    <p>Employee Created Successfully!</p>
                </Modal>

                <Modal
                    isOpen={modals.details}
                    onClose={() => closeModal('details')}
                    title="Employee Details"
                >
                    <h3>New Employee Added:</h3>
                    <p>Name: {employee.firstName} {employee.lastName}</p>
                    <p>Department: {employee.department}</p>
                    <p>Start Date: {employee.startDate && employee.startDate.toDateString()}</p>
                </Modal>
            </div>
        </>
    );
}

// Export avec mémoisation pour optimiser les performances
export default memo(CreateEmployee);