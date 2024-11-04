/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useRef } from 'react';
import '../item/style.scss';
import Button from '@mui/material/Button';
import { MdDeleteForever } from "react-icons/md";
import { fetchCategories } from '../../../utils/CategoryAPI';
import { addItem, addNutritionValue, deleteNutritionValue } from '../../../utils/MenuAPI';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const AddItem = () => {
  const location = useLocation();
  const [options, setOptions] = useState([]);
  const [response, setResponse] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    type: '',
    image: null,
    image_external_url: '',
    description: '',
    price: ''
  });

  const [nutriValues, setNutriValues] = useState([{
    type: '',
    value: '',
    category: ''
  }]);

  const [errors, setErrors] = useState({});
  const refs = {
    name: useRef(null),
    category_id: useRef(null),
    image: useRef(null),
    description: useRef(null),
    price: useRef(null),
    type: useRef(null)
  };

  const isEdit = location.state?.isEdit || false;

  useEffect(() => {
    document.title = "ZeroCarbs | Menu";

    // Fetch Categories for Select Category
    const getCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setOptions(fetchedCategories.data);
      } catch (err) {
        console.log('Err', err);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (location.state && location.state.itemData) {
      setFormData(location.state.itemData);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setErrors({ ...errors, image: '' });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
    setErrors({ ...errors, type: '' });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.category_id) newErrors.category_id = "Category is required.";
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.type) newErrors.type = "Please select a type (Veg/Non-Veg).";
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (refs[firstErrorField] && refs[firstErrorField].current) {
        refs[firstErrorField].current.focus();
      }
      return;
    }

    try {
      const response = await addItem(formData);
      console.log(response.data.id);
      setItemId(response.data.id);
      setResponse(response);
      setFormData({
        name: '',
        category_id: '',
        type: '',
        image: null,
        image_external_url: '',
        description: '',
        price: ''
      });

      if (refs.image.current) {
        refs.image.current.value = null;
      }

    } catch (error) {
      console.log('Err', error.response?.data || error.message);
    }
  };

  const handleTypeValueChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'value' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const values = [...nutriValues];
    values[index][name] = value;
    setNutriValues(values);
    setErrors({ ...errors, nutriValues: '' });
  };

  const handleAddTypeValue = () => {
    setNutriValues([...nutriValues, { type: '', value: '', category: '' }]);
  };

  const handleRemoveTypeValue = async (index) => {
    const values = [...nutriValues];
    const nutritionId = values[index].id;

    if (nutritionId) {
      try {
        await deleteNutritionValue(nutritionId);
        toast.success('Nutrition value deleted successfully');
      } catch (error) {
        toast.error('Failed to delete nutrition value');
        return;
      }
    }
    values.splice(index, 1);
    setNutriValues(values);
  };

  const validateNutritionForm = () => {
    let newErrors = {};
    nutriValues.forEach((nutriValue, index) => {
      if (!nutriValue.type) newErrors[`nutriValues-${index}-type`] = "Type is required.";
      if (!nutriValue.value) newErrors[`nutriValues-${index}-value`] = "Value is required.";
      if (!nutriValue.category) newErrors[`nutriValues-${index}-category`] = "Category is required.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNutritionSubmit = async (e) => {
    e.preventDefault();

    if (!itemId) {
      toast.error("Please fill out the item form first!");
      return;
    }

    if (!validateNutritionForm()) {
      return;
    }

    try {
      const payload = {
        item_id: itemId,
        nutritions: nutriValues.map((nutriValue) => ({
          type: nutriValue.type,
          value: nutriValue.value,
          category: nutriValue.category,
        })),
      };

      const response = await addNutritionValue(payload);
      console.log(response);
      if (response.success) {
        setItemId(null);
      }
      setNutrition(response);
      setNutriValues([{
        type: '',
        value: '',
        category: ''
      }]);
    } catch (error) {
      console.log('Err', error);
    }
  };

  return (
    <div className='body-content'>
      <ToastContainer />
      <div className="card border-0 p-3">
        <h3 className="mb-0">Add New Item</h3>
      </div>

      <div className="add-menu-item">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="fields">
              <div className="inputFields">
                <label>Name</label>
                <input ref={refs.name} type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Enter item name' />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              <div className='inputFields'>
                <label>Category</label>
                <select ref={refs.category_id} name="category_id" value={formData.category_id} onChange={handleChange}>
                  <option value="select">Select Category</option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="error">{errors.category_id}</p>}
              </div>
            </div>
            <div className="fields">
              <div className='inputFields'>
                <label>Choose Image</label>
                <input ref={refs.image} type="file" name="image" onChange={handleFileChange} />
                {errors.image && <p className="error">{errors.image}</p>}
              </div>
              <div className='inputFields'>
                <label>Image Url <span>(If Any)</span></label>
                <input type="text" name="image_external_url" value={formData.image_external_url} onChange={handleChange} placeholder='Enter image url' />
              </div>
            </div>
            <div className='descBox'>
              <label>Description</label>
              <textarea ref={refs.description} name="description" value={formData.description} onChange={handleChange} placeholder='Enter item description' />
              {errors.description && <p className="error">{errors.description}</p>}
            </div>
            <div className="fields">
              <div className='inputFields'>
                <label>Price</label>
                <input ref={refs.price} type="text" name="price" value={formData.price} onChange={handleChange} placeholder='Enter item price' />
                {errors.price && <p className="error">{errors.price}</p>}
              </div>
              <div className='inputFields'>
                <label>Discount <span>(If Any)</span></label>
                <select>
                  <option value="">Select Category</option>
                  <option value="category1">Voucher</option>
                  <option value="category2">Voucher</option>
                </select>
              </div>
            </div>
            <div className="checkboxField">
              <div className='inputFields'>
                <input ref={refs.type} type="checkbox" name="type" value="veg" checked={formData.type === 'veg'} onChange={() => handleTypeChange('veg')} />
                <p>Is Veg?</p>
              </div>
              <div className='inputFields'>
                <input ref={refs.type} type="checkbox" name="type" value="non-veg" checked={formData.type === 'non-veg'} onChange={() => handleTypeChange('non-veg')} />
                <p>Is Non-Veg?</p>
              </div>
              {errors.type && <p className="error">{errors.type}</p>}
            </div>
            <div className="submit-button">
              <Button type="submit">
                {isEdit ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </form>

        {itemId !== null && (
          <form onSubmit={handleNutritionSubmit}>
            <div className="form-section nutrition-form">
              <div className="type-section">
                <h4>Nutrition Values</h4>
                {nutriValues.map((nutriValue, index) => (
                  <div key={index} className="type-value">
                    <div className="inputFields">
                      <label>Type</label>
                      <select
                        name="type"
                        value={nutriValue.type}
                        onChange={(e) => handleTypeValueChange(e, index)}
                      >
                        <option value="select">Select Type</option>
                        <option value="Kcal">Kcal</option>
                        <option value="Protein">Protein</option>
                        <option value="Carbs">Carbs</option>
                        <option value="Fats">Fats</option>
                      </select>
                      {errors[`nutriValues-${index}-type`] && <p className="error">{errors[`nutriValues-${index}-type`]}</p>}
                    </div>
                    <div className="inputFields">
                      <label>Value</label>
                      <input
                        type="text"
                        name="value"
                        placeholder="Enter nutrition value"
                        value={nutriValue.value}
                        onChange={(e) => handleTypeValueChange(e, index)}
                      />
                      {errors[`nutriValues-${index}-value`] && <p className="error">{errors[`nutriValues-${index}-value`]}</p>}
                    </div>
                    <div className="inputFields">
                      <label>Category</label>
                      <select
                        name="category"
                        value={nutriValue.category}
                        onChange={(e) => handleTypeValueChange(e, index)}
                      >
                        <option value="Select">Select Category</option>
                        <option value="category1">None</option>
                        <option value="category2">Grams</option>
                      </select>
                      {errors[`nutriValues-${index}-category`] && <p className="error">{errors[`nutriValues-${index}-category`]}</p>}
                    </div>
                    <Button className='deleteBtn' onClick={() => handleRemoveTypeValue(index)}>
                      <MdDeleteForever size={30} style={{ color: 'red' }} />
                    </Button>
                  </div>
                ))}
                <div className='addNewTypeBtn'>
                  <Button type="button" onClick={handleAddTypeValue}>Add New</Button>
                </div>
              </div>
              <div className="submit-button">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddItem;