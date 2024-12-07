import React, { useState, useEffect } from 'react';
import './leads.css';

const Leads = () => {
  const [leadList, setLeadList] = useState([]);
  const [newLead, setNewLead] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    revenue: '',
    pointOfContact: '',
    role: '',
    email: '',
    icpMatch: '',
    workshop: false,
    accelerator: false,
    internship: false,
  });
  const [expandedLeadIndex, setExpandedLeadIndex] = useState(null);

  // Fetch existing leads from the backend
  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/leads');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeadList(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle changes to lead input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLead({
      ...newLead,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Add a new lead
  const addLead = async () => {
    if (!newLead.companyName || !newLead.website || !newLead.industry) {
      alert('Please fill out all required fields (Company Name, Website, Industry).');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLead),
      });

      if (!response.ok) {
        throw new Error('Failed to add lead');
      }

      const savedLead = await response.json();
      setLeadList((prevLeadList) => [...prevLeadList, savedLead]);
      setNewLead({
        companyName: '',
        website: '',
        industry: '',
        companySize: '',
        revenue: '',
        pointOfContact: '',
        role: '',
        email: '',
        icpMatch: '',
        workshop: false,
        accelerator: false,
        internship: false,
      });
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('There was an error adding the lead. Please try again.');
    }
  };

  // Update a lead
  const updateLead = async (id, updatedFields) => {
    try {
      const response = await fetch(`http://localhost:3000/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      const updatedLead = await response.json();
      setLeadList((prevLeadList) =>
        prevLeadList.map((lead) => (lead._id === id ? updatedLead : lead))
      );
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('There was an error updating the lead. Please try again.');
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (index, field) => {
    const updatedLeadList = leadList.map((lead, i) => {
      if (i === index) {
        const updatedLead = { ...lead, [field]: !lead[field] };
        updateLead(lead._id, { [field]: updatedLead[field] });
        return updatedLead;
      }
      return lead;
    });
    setLeadList(updatedLeadList);
  };

  // Delete a lead
  const deleteLead = async (id) => {
    const password = prompt('Enter password to delete:');
    if (password !== 'Delete') {
      alert('Incorrect password. Deletion cancelled.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      setLeadList((prevLeadList) => prevLeadList.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('There was an error deleting the lead. Please try again.');
    }
  };

  return (
    <div className="leads-container">
      <h1>Lead Management</h1>
      <div className="main-content1">
        <div className="add-lead-form">
          <h2>Add New Lead</h2>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={newLead.companyName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="website"
            placeholder="Website"
            value={newLead.website}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry"
            value={newLead.industry}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="companySize"
            placeholder="Company Size"
            value={newLead.companySize}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="revenue"
            placeholder="Revenue"
            value={newLead.revenue}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="pointOfContact"
            placeholder="Point of Contact"
            value={newLead.pointOfContact}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={newLead.role}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newLead.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="icpMatch"
            placeholder="ICP Match"
            value={newLead.icpMatch}
            onChange={handleInputChange}
          />
          <div>
            <label>
              <input
                type="checkbox"
                name="workshop"
                checked={newLead.workshop}
                onChange={handleInputChange}
              />
              Workshop
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="accelerator"
                checked={newLead.accelerator}
                onChange={handleInputChange}
              />
              Accelerator
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="internship"
                checked={newLead.internship}
                onChange={handleInputChange}
              />
              Internship
            </label>
          </div>
          <button onClick={addLead}>Add Lead</button>
        </div>

        <div className="leads-list">
          <h2>Lead List</h2>
          {leadList.length === 0 ? (
            <p>No leads added yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Website</th>
                  <th>Industry</th>
                  <th>Company Size</th>
                  <th>Revenue</th>
                  <th>Point of Contact</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>ICP Match</th>
                  <th>Workshop</th>
                  <th>Accelerator</th>
                  <th>Internship</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadList.map((lead, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td onClick={() => setExpandedLeadIndex(expandedLeadIndex === index ? null : index)}>
                        {lead.companyName}
                      </td>
                      <td>{lead.website}</td>
                      <td>{lead.industry}</td>
                      <td>{lead.companySize}</td>
                      <td>{lead.revenue}</td>
                      <td>{lead.pointOfContact}</td>
                      <td>{lead.role}</td>
                      <td>{lead.email}</td>
                      <td>{lead.icpMatch}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={lead.workshop}
                          onChange={() => handleCheckboxChange(index, 'workshop')}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={lead.accelerator}
                          onChange={() => handleCheckboxChange(index, 'accelerator')}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={lead.internship}
                          onChange={() => handleCheckboxChange(index, 'internship')}
                        />
                      </td>
                      <td>
                        <button onClick={() => deleteLead(lead._id)}>Delete</button>
                      </td>
                    </tr>
                    {expandedLeadIndex === index && (
                      <tr>
                        <td colSpan="13">
                          <div className="expanded-details">
                            <p><strong>Company Name:</strong> {lead.companyName}</p>
                            <p><strong>Website:</strong> {lead.website}</p>
                            <p><strong>Industry:</strong> {lead.industry}</p>
                            <p><strong>Company Size:</strong> {lead.companySize}</p>
                            <p><strong>Revenue:</strong> {lead.revenue}</p>
                            <p><strong>Point of Contact:</strong> {lead.pointOfContact}</p>
                            <p><strong>Role:</strong> {lead.role}</p>
                            <p><strong>Email:</strong> {lead.email}</p>
                            <p><strong>ICP Match:</strong> {lead.icpMatch}</p>
                            <p><strong>Workshop:</strong> {lead.workshop ? 'Yes' : 'No'}</p>
                            <p><strong>Accelerator:</strong> {lead.accelerator ? 'Yes' : 'No'}</p>
                            <p><strong>Internship:</strong> {lead.internship ? 'Yes' : 'No'}</p>
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
    </div>
  );
};

export default Leads;