import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import Modal from './Modal';
import useEmployeeStore from '../store/employeeStore';
import states from '../data/states';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/app.css';
//Commenter ./Modal et décommenter ceci
//import Modal from 'modal-ocr-yanis';

function CreateEmployee() {
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

    const [modals, setModals] = useState({
        success: false,
        details: false,
        confirmation: false,
        customStyle: false
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const addEmployee = useEmployeeStore(state => state.addEmployee);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEmployee(prev => ({ ...prev, [id]: value }));
    };
    const handleStateChange = (selectedOption) => {
        setEmployee(prev => ({ ...prev, state: selectedOption.value }));
    };

    const handleDateChange = (date, field) => {
        setEmployee(prev => ({ ...prev, [field]: date }));
    };


    const stateOptions = states.map(state => ({
        value: state.abbreviation,
        label: state.name
    }));

    const departmentOptions = [
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Human Resources', label: 'Human Resources' },
        { value: 'Legal', label: 'Legal' }
    ];

    const handleSelectChange = (selectedOption, { name }) => {
        setEmployee(prev => ({ ...prev, [name]: selectedOption.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addEmployee(employee);
        setIsModalOpen(true);
        setModals({
            success: true,
            details: true,
            confirmation: true,
            customStyle: true
        });
        // Reset form after submission
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

    const closeModal = (modalName) => {
        setModals(prev => ({ ...prev, [modalName]: false }));
    };

    return (
        <>
            <div className="title">
                <h1>HRnet</h1>
            </div>
            <div className="container">
                <Link to="/employee-list">View Current Employees</Link>
                <h2>Create Employee</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={employee.firstName}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={employee.lastName}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <DatePicker
                        id="dateOfBirth"
                        selected={employee.dateOfBirth}
                        onChange={(date) => handleDateChange(date, 'dateOfBirth')}
                        required
                    />

                    <label htmlFor="startDate">Start Date</label>
                    <DatePicker
                        id="startDate"
                        selected={employee.startDate}
                        onChange={(date) => handleDateChange(date, 'startDate')}
                        required
                    />

                    <fieldset className="address">
                        <legend>Address</legend>

                        <label htmlFor="street">Street</label>
                        <input
                            type="text"
                            id="street"
                            value={employee.street}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            value={employee.city}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="state">State</label>
                        <Select
                            id="state"
                            options={stateOptions}
                            value={stateOptions.find(option => option.value === employee.state)}
                            onChange={handleStateChange}
                            placeholder="Select State"
                            required
                        />

                        <label htmlFor="zipCode">Zip Code</label>
                        <input
                            type="number"
                            id="zipCode"
                            value={employee.zipCode}
                            onChange={handleInputChange}
                            required
                        />
                    </fieldset>

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

                <Modal
                    isOpen={modals.customStyle}
                    onClose={() => closeModal('customStyle')}
                    title="Custom Styled Modal"
                    className="custom-modal"
                >
                    <p style={{ color: 'green', fontSize: '18px' }}>This modal has custom styling!</p>
                    <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                        <p>You can customize the content and style of each modal individually.</p>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default CreateEmployee;