/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './style.scss';
import Button from '@mui/material/Button';

const AddNew = () => {
  const [isCategoryFormVisible, setIsCategoryFormVisible] = useState(false);
  const [isEmployeeFormVisible, setIsEmployeeFormVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [newEmployee, setNewEmployee] = useState('');
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    document.title = "ZeroCarbs | Expenses";
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleAddCategoryClick = () => {
    setIsCategoryFormVisible(!isCategoryFormVisible);
    setIsEmployeeFormVisible(false)
  };

  const handleAddEmployeeClick = () => {
    setIsEmployeeFormVisible(!isEmployeeFormVisible);
    setIsCategoryFormVisible(false)
  }

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleEmployeeChannge = (e) => {
    setNewEmployee(e.target.value);
  }

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setIsCategoryFormVisible(false);
    }
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (newEmployee)
      setEmployee([...employee, newEmployee]);
    setNewEmployee('');
    setIsEmployeeFormVisible(false);
  }

  return (
    <div className='body-content'>
      <div className="card border-0 p-3">
        <h3 className="mb-0">Add Expenses</h3>
      </div>

      <div className="add-expense-container">
        <div className="category-section">
          <div className="buttons">
            <Button onClick={handleAddCategoryClick}>Add Purpose</Button>
            <Button onClick={handleAddEmployeeClick}>Add Employee</Button>
          </div>

          {isCategoryFormVisible && (
            <form className='form' onSubmit={handleAddCategory}>
              <label>New Purpose</label>
              <input type="text" value={newCategory} onChange={handleNewCategoryChange} />
              <Button type="submit">Add</Button>
            </form>
          )}
          {isEmployeeFormVisible && (
            <form className='form' onSubmit={handleAddEmployee}>
              <label>New Employee</label>
              <input type="text" value={newEmployee} onChange={handleEmployeeChannge} />
              <Button type="submit">Add</Button>
            </form>
          )}
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="expense-form">
            <div className="input-field">
              <label>Date</label>
              <input type="date" />
            </div>
            <div className="input-field">
              <label>Purpose</label>
              <select className="form-select" defaultValue="select">
                <option value="select">Select Purpose</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="input-field">
              <label>Amount</label>
              <input type="text" />
            </div>
            <div className="input-field">
              <label>Payment method</label>
              <select className='form-select' defaultValue="Cash">
                <option value="cash">Cash</option>
                <option value="upi">UPI/Card</option>
              </select>
            </div>
            <div className="input-field">
              <label>Employee</label>
              <select className='form-select' defaultValue="select">
                <option value="select">Select Employee</option>
                {employee.map((employee, index) => (
                  <option key={index} value={employee}>{employee}</option>
                ))}
              </select>
            </div>
            <div className="input-field">
              <label>Explanation </label>
              <textarea></textarea>
            </div>
          </div>
          <div className="submit-btn">
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNew;