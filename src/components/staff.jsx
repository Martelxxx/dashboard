import React, { useState } from 'react';
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

  // Handle changes to staff input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Add a new staff member
  const addStaff = () => {
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email) {
      alert('Please fill out all required fields (First Name, Last Name, Email).');
      return;
    }

    setStaffList([...staffList, newStaff]);
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
  };

  // Calculate duty distribution
  const totalStaff = staffList.length;
  const microInternshipCount = staffList.filter((staff) => staff.duty === 'Micro Internship').length;
  const prospectingCount = staffList.filter((staff) => staff.duty === 'Prospecting').length;
  const noneCount = staffList.filter((staff) => staff.duty === 'None').length;  // Count for "None" duty

  const chartData = {
    labels: ['Micro Internship', 'Prospecting', 'None'],  // Include 'None' as a label
    datasets: [
      {
        data: [microInternshipCount, prospectingCount, noneCount],  // Add the "None" count here
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],  // Color for the "None" section
        hoverBackgroundColor: ['#36A2EBAA', '#FF6384AA', '#FFCD56AA'],  // Hover color for the "None" section
      },
    ],
  };

  // Function to determine the status emoji
  const getStatus = (staff) => {
    const { employeeAgreement, weeklyOrientation, onboardingDocs, duty } = staff;

    if (employeeAgreement && weeklyOrientation && onboardingDocs) {
      if (duty === 'None') {
        return '⭐'; // Star emoji for all boxes checked and duty is 'None'
      } else if (duty === 'Prospecting') {
        return '⏳'; // Loading emoji for Prospecting duty
      } else if (duty === 'Micro Internship') {
        return '💰💰'; // Micro Internship emoji
      }
    }

    if (!employeeAgreement && !weeklyOrientation && !onboardingDocs) {
      return '⚠️'; // Warning emoji if none of the boxes are checked
    }

    return '⚠️'; // Default warning if conditions aren't met
  };

  const toggleCheckbox = (index, field) => {
    const updatedStaffList = staffList.map((staff, i) => {
      if (i === index) {
        return { ...staff, [field]: !staff[field] };
      }
      return staff;
    });
    setStaffList(updatedStaffList);
  };

  const handleDutyChange = (index, newDuty) => {
    const updatedStaffList = staffList.map((staff, i) => {
      if (i === index) {
        return { ...staff, duty: newDuty };
      }
      return staff;
    });
    setStaffList(updatedStaffList);
  };

  const handleNotesChange = (index, notes) => {
    const updatedStaffList = staffList.map((staff, i) => {
      if (i === index) {
        return { ...staff, notes };
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
          <div>
            <label>
              <input
                type="checkbox"
                name="employeeAgreement"
                checked={newStaff.employeeAgreement}
                onChange={handleInputChange}
              />
              Received and Signed Employee Agreement
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="weeklyOrientation"
                checked={newStaff.weeklyOrientation}
                onChange={handleInputChange}
              />
              Scheduled for Weekly Orientation
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="onboardingDocs"
                checked={newStaff.onboardingDocs}
                onChange={handleInputChange}
              />
              Sent Onboarding and Welcome Docs
            </label>
          </div>
          <div>
            <label>
              Duty:
              <select name="duty" value={newStaff.duty} onChange={handleInputChange}>
                <option value="None">None</option>
                <option value="Micro Internship">Micro Internship</option>
                <option value="Prospecting">Prospecting</option>
              </select>
            </label>
          </div>
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
                <th>Status</th> {/* Added Status Column */}
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
                    <td>{staff.email}</td>
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
                      </select>
                    </td>
                    <td>{getStatus(staff)}</td> {/* Display status emoji */}
                  </tr>
                  {expandedStaffIndex === index && (
                    <tr>
                      <td colSpan="8">
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