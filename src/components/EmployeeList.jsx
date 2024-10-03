import React from 'react';
import { Link } from 'react-router-dom';
import useEmployeeStore from '../store/employeeStore';
import '../assets/EmployeeList.css';

const EmployeeList = () => {
    const employees = useEmployeeStore(state => state.employees);

    //Formater les dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="container">
            <h1>Current Employees</h1>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Start Date</th>
                        <th>Department</th>
                        <th>Date of Birth</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Zip Code</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{formatDate(employee.startDate)}</td>
                            <td>{employee.department}</td>
                            <td>{formatDate(employee.dateOfBirth)}</td>
                            <td>{employee.street}</td>
                            <td>{employee.city}</td>
                            <td>{employee.state}</td>
                            <td>{employee.zipCode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/">Home</Link>
        </div>
    );
};

export default EmployeeList;