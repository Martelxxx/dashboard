import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './staff.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    collegeCampus: '',
    major: '',
    role: '',
    employeeAgreement: false,
    weeklyOrientation: false,
    onboardingDocs: false,
    duty: 'None',
    notes: '',
  });
  const [expandedStaffIndex, setExpandedStaffIndex] = useState(null);

  // Fetch existing staff from the backend
  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle changes to staff input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Add a new staff member
  const addStaff = async () => {
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email) {
      alert('Please fill out all required fields (First Name, Last Name, Email).');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/staff', { // Ensure the URL matches your backend route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff),
      });

      if (!response.ok) {
        throw new Error('Failed to add staff');
      }

      const savedStaff = await response.json();
      setStaffList((prevStaffList) => [...prevStaffList, savedStaff]); // Add new staff to the list
      setNewStaff({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        collegeCampus: '',
        major: '',
        role: '',
        employeeAgreement: false,
        weeklyOrientation: false,
        onboardingDocs: false,
        duty: 'None',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('There was an error adding the staff. Please try again.');
    }
  };

  // Update a staff member
  const updateStaff = async (id, updatedFields) => {
    try {
      const response = await fetch(`http://localhost:3000/api/staff/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff');
      }

      const updatedStaff = await response.json();
      setStaffList((prevStaffList) =>
        prevStaffList.map((staff) => (staff._id === id ? updatedStaff : staff))
      );
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('There was an error updating the staff. Please try again.');
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (index, field) => {
    const updatedStaffList = staffList.map((staff, i) => {
      if (i === index) {
        const updatedStaff = { ...staff, [field]: !staff[field] };
        updateStaff(staff._id, { [field]: updatedStaff[field] });
        return updatedStaff;
      }
      return staff;
    });
    setStaffList(updatedStaffList);
  };

  // Delete a staff member
  const deleteStaff = async (id) => {
    const password = prompt('Enter password to delete:');
    if (password !== 'Delete') {
      alert('Incorrect password. Deletion cancelled.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/staff/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff');
      }

      setStaffList((prevStaffList) => prevStaffList.filter((staff) => staff._id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('There was an error deleting the staff. Please try again.');
    }
  };

  // Calculate duty distribution
  const totalStaff = staffList.length;
  const microInternshipCount = staffList.filter((staff) => staff.duty === 'Micro Internship').length;
  const prospectingCount = staffList.filter((staff) => staff.duty === 'Prospecting').length;
  const noneCount = staffList.filter((staff) => staff.duty === 'None').length;
  const AWOLCount = staffList.filter((staff) => staff.duty === 'AWOL').length;

  const chartData = {
    labels: ['Micro Internship', 'Prospecting', 'None', 'AWOL'],
    datasets: [
      {
        data: [microInternshipCount, prospectingCount, noneCount, AWOLCount],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56', 'red'],
        hoverBackgroundColor: ['#36A2EBAA', '#FF6384AA', '#FFCD56AA', 'red'],
      },
    ],
  };

  const getStatus = (staff) => {
    const { employeeAgreement, weeklyOrientation, onboardingDocs, duty } = staff;

    if (employeeAgreement && weeklyOrientation && onboardingDocs) {
      if (duty === 'None') {
        return '⭐';
      } else if (duty === 'Prospecting') {
        return '⏳';
      } else if (duty === 'Micro Internship') {
        return '💰💰';
      }
    }

    if (!employeeAgreement && !weeklyOrientation && !onboardingDocs) {
      return '⚠️';
    }

    return '⚠️';
  };

  const toggleCheckbox = (index, field) => {
    const updatedStaffList = staffList.map((staff, i) => {
      if (i === index) {
        const updatedStaff = { ...staff, [field]: !staff[field] };
        updateStaff(staff._id, { [field]: updatedStaff[field] });
        return updatedStaff;
      }
      return staff;
    });
    setStaffList(updatedStaffList);
  };

  const handleDutyChange = (index, newDuty) => {
    const updatedStaffList = staffList.map((staff, i) => {
      if (i === index) {
        const updatedStaff = { ...staff, duty: newDuty };
        updateStaff(staff._id, { duty: newDuty });
        return updatedStaff;
      }
      return staff;
    });
    setStaffList(updatedStaffList);
  };

  const handleNotesChange = (index, notes) => {
    const updatedStaffList = staffList.map((staff, i) => {
      if (i === index) {
        const updatedStaff = { ...staff, notes };
        updateStaff(staff._id, { notes });
        return updatedStaff;
      }
      return staff;
    });
    setStaffList(updatedStaffList);
  };

  return (
    <div className="staff-container">
      <h1>Staff Management</h1>
      <div className="main-content">
        <div className="add-staff-form">
          <h2>Add New Staff</h2>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={newStaff.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={newStaff.lastName}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newStaff.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newStaff.phone}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="collegeCampus"
            placeholder="College Campus"
            value={newStaff.collegeCampus}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="major"
            placeholder="Major"
            value={newStaff.major}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Position/Role"
            value={newStaff.role}
            onChange={handleInputChange}
          />
          
          <button onClick={addStaff}>Add Staff</button>
        </div>

        <div className="chart-container">
          <h2>Duty Distribution</h2>
          {totalStaff === 0 ? (
            <p>No data to display.</p>
          ) : (
            <Pie data={chartData} />
          )}
        </div>
      </div>

      <div className="staff-list">
        <h2>Staff List</h2>
        {staffList.length === 0 ? (
          <p>No staff added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Employee Agreement</th>
                <th>Weekly Orientation</th>
                <th>Onboarding Docs</th>
                <th>Duty</th>
                <th>Status</th>
                <th>Actions</th> {/* Added Actions Column */}
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td onClick={() => setExpandedStaffIndex(expandedStaffIndex === index ? null : index)}>
                      {staff.firstName}
                    </td>
                    <td>{staff.lastName}</td>
                    <td>
                      <a href={`mailto:${staff.email}`}>{staff.email}</a> {/* Email link */}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={staff.employeeAgreement}
                        onChange={() => toggleCheckbox(index, 'employeeAgreement')}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={staff.weeklyOrientation}
                        onChange={() => toggleCheckbox(index, 'weeklyOrientation')}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={staff.onboardingDocs}
                        onChange={() => toggleCheckbox(index, 'onboardingDocs')}
                      />
                    </td>
                    <td>
                      <select
                        value={staff.duty}
                        onChange={(e) => handleDutyChange(index, e.target.value)}
                      >
                        <option value="None">None</option>
                        <option value="Micro Internship">Micro Internship</option>
                        <option value="Prospecting">Prospecting</option>
                        <option value="AWOL">AWOL</option>
                      </select>
                    </td>
                    <td>{getStatus(staff)}</td>
                    <td>
                      <button onClick={() => deleteStaff(staff._id)}>Delete</button>
                    </td>
                  </tr>
                  {expandedStaffIndex === index && (
                    <tr>
                      <td colSpan="9">
                        <div className="expanded-details">
                          <p><strong>Phone:</strong> {staff.phone}</p>
                          <p><strong>College Campus:</strong> {staff.collegeCampus}</p>
                          <p><strong>Major:</strong> {staff.major}</p>
                          <textarea
                            placeholder="Add notes here..."
                            value={staff.notes}
                            onChange={(e) => handleNotesChange(index, e.target.value)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Staff;