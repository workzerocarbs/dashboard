/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import '../category/style.scss';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FaPencilAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { fetchCategories, addCategory, fetchCategoryById, patchCategoryById, deleteCategory } from '../../../utils/CategoryAPI';
import { useParams } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [addedCategoryList, setAddedCategoryList] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCategory, setEditedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iseDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingEditIndex, setPendingEditIndex] = useState(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    document.title = "ZeroCarbs | Menu";
  }, []);

  // Fetch Categories Method
  useEffect(() => {
    const getCategories = async () => {
      try {
        if (id) {
          // Fetch category by ID
          const fetchedCategoryById = await fetchCategoryById(id);
          setCategories([fetchedCategoryById.data]);
        } else {
          // Fetch all categories
          const fetchedCategories = await fetchCategories();
          setCategories(fetchedCategories.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    getCategories();
    setAddedCategoryList(false);
  }, [addedCategoryList, id]);

  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleEditInputChange = (e) => {
    setEditedCategory(e.target.value);
  };

  // Post category Method
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCategory.trim() !== '') {
      try {
        const newCategoryData = await addCategory(newCategory);
        if (newCategoryData && newCategoryData.data) {
          setAddedCategoryList(true);
          setNewCategory('');
        } else {
          console.error('Error: added category data is not in the expected format');
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleEdit = (index) => {
    setPendingEditIndex(index);
    setIsModalOpen(true);
  };

  const confirmEdit = () => {
    setEditingIndex(pendingEditIndex);
    setEditedCategory(categories[pendingEditIndex].name);
    setIsModalOpen(false);
    setPendingEditIndex(null);
  };

  const cancelEdit = () => {
    setIsModalOpen(false);
    setPendingEditIndex(null);
  };

  // Edit category Method
  const handleSaveEdit = async (index) => {
    try {
      const updatedCategory = await patchCategoryById(categories[index].id, { name: editedCategory });
      const updatedCategories = [...categories];
      updatedCategories[index] = updatedCategory.data;
      setCategories(updatedCategories);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving edited category:', error);
    }
  };

  const handleDelete = (index) => {
    setPendingDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPendingDeleteIndex(null)
  }

  const confirmDelete = async () => {
    try {
      const categoryId = categories[pendingDeleteIndex].id;
      await deleteCategory(categoryId);
      const updatedCategories = categories.filter((_, i) => i !== pendingDeleteIndex);
      setCategories(updatedCategories);
      setIsDeleteModalOpen(false);
      setPendingDeleteIndex(null);
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <div className='body-content'>
      <div className="card border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className='categoryForm'>
            <input
              type="text"
              value={newCategory}
              onChange={handleInputChange}
              placeholder="Enter new category"
            />
            <Button type="submit">Add</Button>
          </form>
          {categories && categories.length > 0 ? (
            <ul className='categoriesList'>
              {categories.map((category, index) => (
                <li key={index}>
                  {editingIndex === index ? (
                    <div className='editCategoryName'>
                      <input
                        className='form-control'
                        type="text"
                        value={editedCategory}
                        onChange={handleEditInputChange}
                      />
                      <Button onClick={() => handleSaveEdit(index)}>Save</Button>
                    </div>
                  ) : (
                    <>
                      <div className='categories-name'>{category.name}</div>
                      <div className="buttons-group">
                        <Button onClick={() => handleEdit(index)}><FaPencilAlt size={16} /></Button>
                        <Button className='deleteBtn' onClick={() => handleDelete(index)}><MdDeleteForever size={24} /></Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No categories added yet.</p>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onClose={cancelEdit}>
        <DialogTitle>Confirm Edit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to edit this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEdit} color="primary">
            No
          </Button>
          <Button onClick={confirmEdit} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={iseDeleteModalOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoryList;