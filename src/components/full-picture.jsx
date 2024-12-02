import React, { useState, useEffect } from 'react';
import './full-picture.css';
import bsc from '../assets/bsc.png';

const FullPicture = () => {
  const [staffList, setStaffList] = useState([]);
  const [staffBreakdown, setStaffBreakdown] = useState({
    total: 0,
    microInternship: 0,
    prospecting: 0,
    none: 0,
    awol: 0,
  });

  const [taskList, setTaskList] = useState([]);
  const [taskBreakdown, setTaskBreakdown] = useState({
    dueSoon: 0,
    highPriority: 0,
  });

  // Fetch existing staff from the backend
  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await response.json();
      setStaffList(data);
      calculateBreakdown(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Fetch existing tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTaskList(data);
      calculateTaskBreakdown(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchTasks();
  }, []);

  // Calculate the percentage breakdown of staff duty
  const calculateBreakdown = (staffList) => {
    const total = staffList.length;
    const microInternshipCount = staffList.filter((staff) => staff.duty === 'Micro Internship').length;
    const prospectingCount = staffList.filter((staff) => staff.duty === 'Prospecting').length;
    const noneCount = staffList.filter((staff) => staff.duty === 'None').length;
    const awolCount = staffList.filter((staff) => staff.duty === 'AWOL').length;

    setStaffBreakdown({
      total,
      microInternship: ((microInternshipCount / total) * 100).toFixed(2),
      prospecting: ((prospectingCount / total) * 100).toFixed(2),
      none: ((noneCount / total) * 100).toFixed(2),
      awol: ((awolCount / total) * 100).toFixed(2),
    });
  };


  // Calculate the breakdown of tasks
  const calculateTaskBreakdown = (taskList) => {
    const now = new Date();
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(now.getDate() + 2);

    const dueSoonCount = taskList.filter((task) => new Date(task.dueDate) <= twoDaysFromNow).length;
    const highPriorityCount = taskList.filter((task) => task.priority === 'High').length;

    setTaskBreakdown({
      dueSoon: dueSoonCount,
      highPriority: highPriorityCount,
    });
  };

  return (
    <>
      <h1>At A Glance</h1>
      <div className='tileContainer'>
        <div>
          <div className='dashboard'>
            <div className='tile'>
              <h3>Staff</h3>
              <p>Total Staff: {staffBreakdown.total}</p>
              <p>Micro Internship: {staffBreakdown.microInternship}%</p>
              <p>Prospecting: {staffBreakdown.prospecting}%</p>
              <p>None: {staffBreakdown.none}%</p>
              <p>AWOL: {staffBreakdown.awol}%</p>
            </div>
           
            <div className='tile'>Clients</div>
            <div className='tile'>Leads</div>
          </div>

          <div className='dashboard'>
            <div className='tile'>Email</div>
            <div className='tile'>Calendar</div>
            <div className='tile'>
            <h3>Tasks</h3>
              <p>Due Soon: {taskBreakdown.dueSoon}</p>
              <p>High Priority: {taskBreakdown.highPriority}</p>
            </div>
          </div>

          <div className='dashboard'>
            <div className='tile'>Anticipated Revenue</div>
            <div className='tile'>Revenue</div>
            <div className='tile'>Expenses</div>
          </div>
        </div>
      </div>

      <div className='logo'>
        <img src={bsc} alt="BSC Logo" />
      </div>
    </>
  );
};

export default FullPicture;