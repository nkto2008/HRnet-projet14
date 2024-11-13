// Import des dépendances nécessaires
import React, { useMemo, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useEmployeeStore from '../store/employeeStore';
import '../assets/EmployeeList.css'; // Import du fichier CSS

const EmployeeList = () => {
    // État global des employés via le store
    const employees = useEmployeeStore(state => state.employees);

    // États locaux pour la gestion des filtres et de la pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    /**
     * Formate une date en string localisée
     * @param {string} dateString - Date au format ISO
     * @returns {string} Date formatée
     */
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    /**
     * Mémoisation du filtrage et du tri des employés
     * Cette fonction ne sera recalculée que si ses dépendances changent
     */
    const filteredAndSortedEmployees = useMemo(() => {
        // Copie des employés avec dates formatées
        let filtered = employees.map(employee => ({
            ...employee,
            startDate: formatDate(employee.startDate),
            dateOfBirth: formatDate(employee.dateOfBirth)
        }));

        // Application du filtre de recherche
        if (searchTerm) {
            filtered = filtered.filter(employee =>
                Object.values(employee).some(value =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Application du tri
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [employees, searchTerm, sortConfig]);

    // Calcul des variables de pagination
    const totalPages = Math.ceil(filteredAndSortedEmployees.length / entriesPerPage);
    const paginatedEmployees = filteredAndSortedEmployees.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    /**
     * Gère le tri des colonnes
     * @param {string} key - Clé de la colonne à trier
     */
    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    /**
     * Composant d'en-tête de colonne avec tri
     */
    const SortableHeader = ({ label, sortKey }) => (
        <th onClick={() => handleSort(sortKey)} className="sortable-header">
            {label}
            <span className="sort-indicator">
                {sortConfig.key === sortKey && (
                    sortConfig.direction === 'asc' ? '▲' : '▼'
                )}
            </span>
        </th>
    );

    return (
        <>
            <Helmet>
                <title>HRnet - Employee List</title>
                <meta name="description" content="View and manage your employees" />
            </Helmet>
            <div className="employee-container">
                <h1>Current Employees</h1>

                {/* Contrôles supérieurs */}
                <div className="controls">
                    <div className="entries-control">
                        <span>Show</span>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="search-control">
                        <span>Search:</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {/* Table des employés */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <SortableHeader label="First Name" sortKey="firstName" />
                                <SortableHeader label="Last Name" sortKey="lastName" />
                                <SortableHeader label="Start Date" sortKey="startDate" />
                                <SortableHeader label="Department" sortKey="department" />
                                <SortableHeader label="Date of Birth" sortKey="dateOfBirth" />
                                <SortableHeader label="Street" sortKey="street" />
                                <SortableHeader label="City" sortKey="city" />
                                <SortableHeader label="State" sortKey="state" />
                                <SortableHeader label="Zip Code" sortKey="zipCode" />
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEmployees.map((employee, index) => (
                                <tr key={index}>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.startDate}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.dateOfBirth}</td>
                                    <td>{employee.street}</td>
                                    <td>{employee.city}</td>
                                    <td>{employee.state}</td>
                                    <td>{employee.zipCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Contrôles de pagination */}
                <div className="pagination-controls">
                    <div className="entries-info">
                        Showing {((currentPage - 1) * entriesPerPage) + 1} to{' '}
                        {Math.min(currentPage * entriesPerPage, filteredAndSortedEmployees.length)} of{' '}
                        {filteredAndSortedEmployees.length} entries
                    </div>
                    <div className="pagination-buttons">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="page-button"
                        >
                            Previous
                        </button>
                        <span className="current-page">{currentPage}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="page-button"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Lien de retour */}
                <div className="home-link">
                    <Link to="/">Home</Link>
                </div>
            </div>
        </>
    );
};

// Mémoisation du composant pour éviter les re-renders inutiles
export default memo(EmployeeList);