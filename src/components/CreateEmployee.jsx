/**
 * CreateEmployee.jsx
 * 
 * Ce fichier contient le formulaire de création d'employés.
 * C'est comme une fiche d'inscription numérique pour ajouter de nouveaux employés à l'entreprise.
 * 

 */

// ======= IMPORTS (chargement des outils nécessaires) =======
// Outils de base React pour créer notre interface
import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react';
// Outil pour la navigation entre les pages
import { Link } from 'react-router-dom';
// Outil pour gérer le titre de la page et les métadonnées
import { Helmet } from 'react-helmet-async';
// Notre système de stockage de données
import useEmployeeStore from '../store/employeeStore';
// Liste des états américains pour le menu déroulant
import states from '../data/states';
// Styles visuels de notre formulaire
import '../assets/CreateEmployee.css';
import '../assets/app.css';
import logo from '../assets/logo.png'

// Chargement intelligent des composants lourds
// Ces composants ne sont chargés que lorsqu'on en a besoin (comme charger une voiture seulement quand on veut conduire)
const Select = lazy(() => import('react-select'));               // Menu déroulant amélioré
const DatePicker = lazy(() => import('react-datepicker'));      // Sélecteur de date
const Modal = lazy(() => import('modal-ocr-yanis'));            // Fenêtre pop-up de confirmation

// Chargement du style du sélecteur de date
import('react-datepicker/dist/react-datepicker.css');

// ======= DONNÉES INITIALES =======
// Structure vide d'un nouvel employé (comme un formulaire vierge)
const INITIAL_EMPLOYEE = {
    firstName: '',          // Prénom
    lastName: '',           // Nom
    dateOfBirth: null,      // Date de naissance
    startDate: null,        // Date de début
    street: '',            // Rue
    city: '',              // Ville
    state: '',             // État/Région
    zipCode: '',           // Code postal
    department: 'Sales'     // Département (par défaut: Ventes)
};

// Liste des départements disponibles (comme une liste de services dans l'entreprise)
// Object.freeze empêche toute modification accidentelle de cette liste
const DEPARTMENT_OPTIONS = Object.freeze([
    { value: 'Sales', label: 'Sales' },                     // Ventes
    { value: 'Marketing', label: 'Marketing' },             // Marketing
    { value: 'Engineering', label: 'Engineering' },         // Ingénierie
    { value: 'Human Resources', label: 'Human Resources' }, // Ressources Humaines
    { value: 'Legal', label: 'Legal' }                      // Juridique
]);

// ======= COMPOSANTS RÉUTILISABLES =======

/**
 * FormField : Composant pour créer un champ de formulaire standard
 * C'est comme un moule pour créer des champs de saisie identiques
 * 
 * Props (paramètres):
 * - label: Le texte affiché au-dessus du champ
 * - id: Identifiant unique du champ
 * - type: Type de champ (texte, nombre, etc.)
 * - value: La valeur actuelle du champ
 * - onChange: Fonction qui gère les changements
 * - required: Si le champ est obligatoire
 */
const FormField = React.memo(({ label, id, type = 'text', value, onChange, required = true }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input
            type={type}
            id={id}
            className="form-input"
            value={value}
            onChange={onChange}
            required={required}
            aria-label={label}
        />
    </div>
));

/**
 * DatePickerField : Composant pour sélectionner une date
 * C'est un champ spécial qui affiche un calendrier pour choisir une date
 * 
 * Props:
 * - label: Texte affiché au-dessus du calendrier
 * - id: Identifiant unique
 * - selected: Date actuellement sélectionnée
 * - onChange: Fonction appelée quand on change la date
 */
const DatePickerField = React.memo(({ label, id, selected, onChange }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <div className="date-picker-container">
            <DatePicker
                id={id}
                selected={selected}
                onChange={onChange}
                className="date-picker-input"
                required
                placeholderText="Select date"
                aria-label={label}
            />
        </div>
    </div>
));

/**
 * CreateEmployee : Le composant principal qui gère tout le formulaire
 * C'est comme le chef d'orchestre qui coordonne tous les éléments
 */
function CreateEmployee() {
    // ======= ÉTATS (comme la mémoire du formulaire) =======
    // employee : Stocke toutes les informations de l'employé qu'on est en train de créer
    const [employee, setEmployee] = useState(INITIAL_EMPLOYEE);

    // modals : Gère l'affichage des fenêtres pop-up de confirmation
    const [modals, setModals] = useState({ success: false, details: false });

    // addEmployee : Fonction pour ajouter un nouvel employé dans notre base
    const addEmployee = useEmployeeStore(state => state.addEmployee);

    // ======= GESTIONNAIRES D'ÉVÉNEMENTS =======
    /**
     * handleInputChange : Gère les changements dans les champs texte
     * C'est comme un secrétaire qui note chaque modification
     */
    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setEmployee(prev => ({ ...prev, [id]: value }));
    }, []);

    /**
     * handleStateChange : Gère la sélection de l'état/région
     * S'active quand on choisit un état dans le menu déroulant
     */
    const handleStateChange = useCallback((selectedOption) => {
        setEmployee(prev => ({ ...prev, state: selectedOption.value }));
    }, []);

    /**
     * handleDateChange : Gère les changements de date
     * S'active quand on choisit une date dans le calendrier
     */
    const handleDateChange = useCallback((date, field) => {
        setEmployee(prev => ({ ...prev, [field]: date }));
    }, []);

    /**
     * handleDepartmentChange : Gère le changement de département
     * S'active quand on choisit un nouveau département
     */
    const handleDepartmentChange = useCallback((selectedOption, { name }) => {
        setEmployee(prev => ({ ...prev, [name]: selectedOption.value }));
    }, []);

    /**
     * closeModal : Ferme une fenêtre pop-up
     * Comme fermer une notification après l'avoir lue
     */
    const closeModal = useCallback((modalName) => {
        setModals(prev => ({ ...prev, [modalName]: false }));
    }, []);

    /**
     * handleSubmit : Gère l'envoi du formulaire
     * C'est l'action finale quand on clique sur "Sauvegarder"
     */
    const handleSubmit = useCallback((e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        addEmployee(employee); // Sauvegarde l'employé
        setModals({ success: true, details: true }); // Affiche les confirmations
        setEmployee(INITIAL_EMPLOYEE); // Réinitialise le formulaire
    }, [employee, addEmployee]);

    // Prépare la liste des états pour le menu déroulant
    const stateOptions = useMemo(() =>
        states.map(state => ({
            value: state.abbreviation,
            label: state.name
        })),
        []
    );

    // ======= RENDU DE L'INTERFACE =======
    // C'est la partie qui décrit ce qu'on voit à l'écran
    return (
        <>
            {/* Gestion du titre de la page et des métadonnées */}
            <Helmet>
                <title>HRnet - Create Employee</title>
                <meta name="description" content="Create a new employee. Enter employee details." />
                <link rel="preload" href="/assets/form-styles.css" as="style" />
            </Helmet>

            <div className="employee-container">
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="Logo WealthHealth"
                    />
                </div>
                {/* Titre principal */}
                <h1>HRnet</h1>

                {/* Lien vers la liste des employés */}
                <div className="navigation">
                    <Link to="/employee-list" className="nav-link">
                        View Current Employees
                    </Link>
                </div>

                {/* Section du formulaire */}
                <div className="form-section">
                    {/* Zone d'attente pendant le chargement */}
                    <Suspense fallback={
                        <div className="loading-container" role="alert" aria-busy="true">
                            <div className="loading-spinner" />
                        </div>
                    }>
                        {/* Le formulaire lui-même */}
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-grid">
                                {/* Champs d'informations personnelles */}
                                <FormField
                                    label="First Name"
                                    id="firstName"
                                    value={employee.firstName}
                                    onChange={handleInputChange}
                                />

                                <FormField
                                    label="Last Name"
                                    id="lastName"
                                    value={employee.lastName}
                                    onChange={handleInputChange}
                                />

                                {/* Sélecteurs de date */}
                                <DatePickerField
                                    label="Date of Birth"
                                    id="dateOfBirth"
                                    selected={employee.dateOfBirth}
                                    onChange={(date) => handleDateChange(date, 'dateOfBirth')}
                                />

                                <DatePickerField
                                    label="Start Date"
                                    id="startDate"
                                    selected={employee.startDate}
                                    onChange={(date) => handleDateChange(date, 'startDate')}
                                />

                                {/* Champs d'adresse */}
                                <FormField
                                    label="Street"
                                    id="street"
                                    value={employee.street}
                                    onChange={handleInputChange}
                                />

                                <FormField
                                    label="City"
                                    id="city"
                                    value={employee.city}
                                    onChange={handleInputChange}
                                />

                                {/* Menu déroulant pour l'état */}
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <Select
                                        inputId="state"
                                        options={stateOptions}
                                        value={stateOptions.find(option => option.value === employee.state)}
                                        onChange={handleStateChange}
                                        className="custom-select"
                                        classNamePrefix="react-select"
                                        aria-label="State"
                                        required
                                    />
                                </div>

                                <FormField
                                    label="Zip Code"
                                    id="zipCode"
                                    type="number"
                                    value={employee.zipCode}
                                    onChange={handleInputChange}
                                />

                                {/* Menu déroulant pour le département */}
                                <div className="form-group">
                                    <label htmlFor="department">Department</label>
                                    <Select
                                        inputId="department"
                                        name="department"
                                        options={DEPARTMENT_OPTIONS}
                                        value={DEPARTMENT_OPTIONS.find(option => option.value === employee.department)}
                                        onChange={handleDepartmentChange}
                                        className="custom-select"
                                        classNamePrefix="react-select"
                                        aria-label="Department"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bouton de sauvegarde */}
                            <div className="submit-container">
                                <button type="submit" className="submit-button">
                                    Save
                                </button>
                            </div>
                        </form>
                    </Suspense>
                </div>

                {/* Fenêtres pop-up de confirmation */}
                <Suspense fallback={null}>
                    {/* Message de succès */}
                    {modals.success && (
                        <Modal
                            isOpen={true}
                            onClose={() => closeModal('success')}
                            title="Success"
                        >
                            <p>Employee Created Successfully!</p>
                        </Modal>
                    )}

                    {/* Détails de l'employé créé */}
                    {modals.details && (
                        <Modal
                            isOpen={true}
                            onClose={() => closeModal('details')}
                            title="Employee Details"
                        >
                            <h3>New Employee Added:</h3>
                            <p>Name: {employee.firstName} {employee.lastName}</p>
                            <p>Department: {employee.department}</p>
                            <p>Start Date: {employee.startDate && employee.startDate.toDateString()}</p>
                        </Modal>
                    )}
                </Suspense>
            </div>
        </>
    );
}

// Exporte le composant pour l'utiliser ailleurs
// React.memo évite les re-rendus inutiles
export default React.memo(CreateEmployee);