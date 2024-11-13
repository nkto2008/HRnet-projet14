/**
 * employeeStore.js
 * Store global pour la gestion des employés utilisant Zustand
 * avec persistance des données dans le localStorage
 */

// Import des dépendances nécessaires de Zustand
import { create } from 'zustand'                // Fonction principale pour créer un store
import { persist } from 'zustand/middleware'    // Middleware pour la persistance des données

/**
 * Création du store employés avec persistance
 * Utilise le middleware 'persist' pour sauvegarder automatiquement
 * l'état dans le localStorage
 */
const useEmployeeStore = create(
    persist(
        /**
         * Configuration principale du store
         * @param {Function} set - Fonction pour mettre à jour l'état
         * @returns {Object} - Les méthodes et l'état initial du store
         */
        (set) => ({
            // État initial : tableau vide d'employés
            employees: [],

            /**
             * Ajoute un nouvel employé au store
             * @param {Object} employee - Données du nouvel employé
             * @property {string} employee.firstName - Prénom de l'employé
             * @property {string} employee.lastName - Nom de l'employé
             * @property {Date} employee.dateOfBirth - Date de naissance
             * @property {Date} employee.startDate - Date de début
             * @property {string} employee.street - Rue
             * @property {string} employee.city - Ville
             * @property {string} employee.state - État/Région
             * @property {string} employee.zipCode - Code postal
             * @property {string} employee.department - Département
             */
            addEmployee: (employee) => set((state) => ({
                employees: [...state.employees, { ...employee, id: Date.now() }]
                // Ajoute un ID unique basé sur le timestamp
            })),

            /**
             * Récupère la liste complète des employés
             * Cette méthode est utilisée pour forcer une mise à jour du state si nécessaire
             * @returns {void} - Met à jour l'état avec la liste actuelle des employés
             */
            getEmployees: () => set((state) => ({ employees: state.employees })),
        }),
        {
            /**
             * Configuration du middleware persist
             * Définit comment et où les données sont persistées
             */
            name: 'employee-storage',     // Clé utilisée dans le localStorage
            getStorage: () => localStorage // Utilise le localStorage du navigateur
        }
    )
)

// Export du hook personnalisé pour utiliser le store
export default useEmployeeStore;