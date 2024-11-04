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

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCategory, setEditedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingEditIndex, setPendingEditIndex] = useState(null);

  // Handle the input change for adding new category
  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Handle the input change for editing existing category
  const handleEditInputChange = (e) => {
    setEditedCategory(e.target.value);
  };

  // Handle the form submission for adding new category
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim() !== '') {
      setCategories([...categories, { name: newCategory, items: [] }]);
      setNewCategory('');
    }
  };

  // Handle editing of a category
  const handleEdit = (index) => {
    setPendingEditIndex(index);
    setIsModalOpen(true);
  };

  // Confirm editing
  const confirmEdit = () => {
    setEditingIndex(pendingEditIndex);
    setEditedCategory(categories[pendingEditIndex].name);
    setIsModalOpen(false);
    setPendingEditIndex(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsModalOpen(false);
    setPendingEditIndex(null);
  };

  // Handle saving the edited category
  const handleSaveEdit = (index) => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = editedCategory;
    setCategories(updatedCategories);
    setEditingIndex(null);
  };

  useEffect(() => {
    document.title = "ZeroCarbs | Menu"
  }, []);

  return (
    <div className='body-content'>
      <div className="card border-0 p-3">
        <h3 className="mb-0">List of Categories</h3>
      </div>
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
          {categories.length > 0 ? (
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
    </div>
  );
};

export default CategoryList;

// useEffect(() => {
//   const getCategoriesById  = async (id) => {
//     try {
//       const fetchedCategoriesById = await fetchCategoryById(id);
//       console.log('ID :', fetchedCategoriesById.data)
//       // setCategories(fetchedCategoriesById.data);
//     } catch (err) {
//       console.error("Error", err)
//     }
//   };
//   getCategoriesById(id);
//   setAddedCategoryList(false);

// }, [addedCategoryList])

// const confirmEdit = async () => {
//   try {
//     const categoryToEdit = await fetchCategoryById(categories[pendingEditIndex].id);
//     setEditingIndex(pendingEditIndex);
//     setEditedCategory(categoryToEdit.data.name);
//     setIsModalOpen(false);
//     setPendingEditIndex(null);
//   } catch (error) {
//     console.error('Error fetching category by ID:', error);
//     setIsModalOpen(false);
//     setPendingEditIndex(null);
//   }
// };

// // Fetch Categories by Id
// useEffect(() => {
//   const getCategoriesById = async () => {
//     try {
//       const fetchedCategoriesById = await fetchCategoryById(id);
//       console.log(fetchedCategoriesById.data.id);
//     } catch (err) {
//       console.log('Error fetching ID:', err)
//     }
//   }
//   getCategoriesById();
// }, [id])
//  useEffect(() => {
//     const getCategoriesById = async () => {
//       try {
//         if (id) {
//           const fetchedCategoriesById = await fetchCategoryById(id);
//           console.log(fetchedCategoriesById.data.id);
//           setCategories([fetchedCategoriesById.data]);
//         }
//       } catch (err) {
//         console.log('Error fetching ID:', err)
//       }
//     }
//     getCategoriesById();
//     // setAddedCategoryList(false);

//   }, [id])


// Delete Category Method
// const confirmDelete = async () => {
//   const index = pendingDeleteIndex;
//   const categoryId = categories[index].id;
//   try {
//     const response = await deleteCategory(categoryId);

//     if (response.data.success) {
//       const updatedCategories = categories.filter((_, i) => i !== index);
//       setCategories(updatedCategories);
//       setIsDeleteModalOpen(false);
//       setPendingDeleteIndex(null);
//     }
//   } catch (error) {
//     alert("Cannot delete category with associated items.");
//     setIsDeleteModalOpen(false);
//   }
// };
