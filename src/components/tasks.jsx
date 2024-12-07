import React, { useState, useEffect } from 'react';
import './tasks.css';

const Tasks = () => {
  const [taskList, setTaskList] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    completed: false,
    createdAt: null,
    completionDate: null,
    timeToComplete: null,
  });
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [averageCompletionTime, setAverageCompletionTime] = useState('No data available');

  // Fetch existing tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTaskList(data);
      calculateAverageCompletionTime(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle changes to task input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask({
      ...newTask,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.title || !newTask.description) {
      alert('Please fill out all required fields (Title, Description).');
      return;
    }

    const taskWithTimestamp = { ...newTask, createdAt: new Date() };

    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskWithTimestamp),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const savedTask = await response.json();
      setTaskList((prevTaskList) => {
        const updatedTaskList = [...prevTaskList, savedTask];
        calculateAverageCompletionTime(updatedTaskList);
        return updatedTaskList;
      });

      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Low',
        completed: false,
        createdAt: null,
        completionDate: null,
        timeToComplete: null,
      });
    } catch (error) {
      console.error('Error adding task:', error);
      alert('There was an error adding the task. Please try again.');
    }
  };

  // Update a task
  const updateTask = async (id, updatedFields) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to update task. Status: ${response.status}, Message: ${errorResponse.message}`);
      }

      const updatedTask = await response.json();
      setTaskList((prevTaskList) => {
        const updatedTaskList = prevTaskList.map((task) => (task._id === id ? updatedTask : task));
        calculateAverageCompletionTime(updatedTaskList);
        return updatedTaskList;
      });
    } catch (error) {
      console.error('Error updating task:', error);
      alert('There was an error updating the task. Please try again.');
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = async (index, field) => {
    const updatedTaskList = [...taskList];
    const taskToUpdate = updatedTaskList[index];
    taskToUpdate[field] = !taskToUpdate[field];

    if (field === 'completed' && taskToUpdate[field]) {
      const completionDate = new Date();
      const timeToComplete = Math.ceil((completionDate - new Date(taskToUpdate.createdAt)) / (1000 * 60 * 60 * 24));
      taskToUpdate.completionDate = completionDate;
      taskToUpdate.timeToComplete = timeToComplete;

      await updateTask(taskToUpdate._id, {
        completed: taskToUpdate.completed,
        completionDate,
        timeToComplete,
      });
    } else {
      await updateTask(taskToUpdate._id, { completed: taskToUpdate.completed });
    }

    setTaskList(updatedTaskList);
  };

  // Delete a task
  const deleteTask = async (id) => {
    const password = prompt('Enter password to delete:');
    if (password !== 'Delete') {
      alert('Incorrect password. Deletion cancelled.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTaskList((prevTaskList) => {
        const updatedTaskList = prevTaskList.filter((task) => task._id !== id);
        calculateAverageCompletionTime(updatedTaskList);
        return updatedTaskList;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('There was an error deleting the task. Please try again.');
    }
  };

  // Handle notes change
  const handleNotesChange = (index, notes) => {
    const updatedTaskList = [...taskList];
    const taskToUpdate = updatedTaskList[index];
    taskToUpdate.notes = notes;

    updateTask(taskToUpdate._id, { notes });
    setTaskList(updatedTaskList);
  };

  // Calculate average completion time
  const calculateAverageCompletionTime = (tasks) => {
    const completedTasks = tasks.filter((task) => task.completed && task.timeToComplete !== null);

    if (completedTasks.length === 0) {
      setAverageCompletionTime('No data available');
      return;
    }

    const totalCompletionTime = completedTasks.reduce((total, task) => total + task.timeToComplete, 0);
    const averageTime = (totalCompletionTime / completedTasks.length).toFixed(2);
    setAverageCompletionTime(`${averageTime} days`);
  };

  return (
    <div className="tasks-container">
      <h1>Task Management</h1>
      <div className="main-content">
        <div className="add-task-form">
          <h2>Add New Task</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newTask.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={handleInputChange}
          />
          <div>
            <label>
              Due Date:
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Priority:
              <select name="priority" value={newTask.priority} onChange={handleInputChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="average-completion-time">
          <h2>Average Completion Time</h2>
          <p>{averageCompletionTime}</p>
        </div>
      </div>

      <div className="tasks-list">
        <h2>Task List</h2>
        {taskList.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskList.map((task, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td onClick={() => setExpandedTaskIndex(expandedTaskIndex === index ? null : index)}>
                      {task.title}
                    </td>
                    <td>{task.description}</td>
                    <td>{task.dueDate}</td>
                    <td className={task.priority === 'High' ? 'high-priority' : ''}>{task.priority}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleCheckboxChange(index, 'completed')}
                      />
                    </td>
                    <td>
                      <button onClick={() => deleteTask(task._id)}>Delete</button>
                    </td>
                  </tr>
                  {expandedTaskIndex === index && (
                    <tr>
                      <td colSpan="6">
                        <div className="expanded-details">
                          <p><strong>Description:</strong> {task.description}</p>
                          <p><strong>Due Date:</strong> {task.dueDate}</p>
                          <p><strong>Priority:</strong> {task.priority}</p>
                          <p><strong>Time to Complete:</strong> {task.timeToComplete} days</p>
                          <textarea
                            placeholder="Add notes here..."
                            value={task.notes}
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

export default Tasks;