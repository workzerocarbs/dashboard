/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import '../add-item/style.scss'
import Button from '@mui/material/Button';
import { MdDeleteForever } from "react-icons/md";

const AddItem = () => {

  useEffect(() => {
    document.title = "ZeroCarbs | Menu"
  })
  const [isVeg, setIsVeg] = useState(false);
  const [isNonVeg, setIsNonVeg] = useState(false);
  const [menuItem, setMenuItem] = useState({
    name: '',
    category: '',
    image: null,
    description: '',
    price: ''
  });

  const [typeValues, setTypeValues] = useState([
    { type: '', value: '', category: '' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuItem({ ...menuItem, [name]: value });
  };

  const handleImageChange = (e) => {
    setMenuItem({ ...menuItem, image: e.target.files[0] });
  };

  const handleTypeValueChange = (index, event) => {
    const values = [...typeValues];
    values[index][event.target.name] = event.target.value;
    setTypeValues(values);
  };

  const handleAddTypeValue = () => {
    setTypeValues([...typeValues, { type: '', value: '', category: '' }]);
  };

  const handleRemoveTypeValue = (index) => {
    const values = [...typeValues];
    values.splice(index, 1);
    setTypeValues(values);
  };

  const handleVegChange = () => {
    setIsVeg(true);
    setIsNonVeg(false);
  };

  const handleNonVegChange = () => {
    setIsVeg(false);
    setIsNonVeg(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(menuItem, typeValues);
  };

  const handleNutritionSubmit = (e) => {
    e.preventDefault();
  }


  return (
    <div className='body-content'>
      <div className="card border-0 p-3">
        <h3 className="mb-0">Add New Item</h3>
      </div>

      <div className="add-menu-item">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="fields">
              <div className="inputFields">
                <label>Name</label>
                <input type="text" name="name" value={menuItem.name} onChange={handleInputChange} required />
              </div>
              <div className='inputFields'>
                <label>Category</label>
                <select
                  name="category"
                  value={menuItem.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="category1">Salads</option>
                  <option value="category2">Bowls</option>
                </select>
              </div>
            </div>
            <div className="fields">
              <div className='inputFields'>
                <label>Choose Image</label>
                <input type="file" name="image" onChange={handleImageChange} required />
              </div>
              <div className='inputFields'>
                <label>Image Url <span>(If Any)</span></label>
                <input type="text" />
              </div>
            </div>
            <div className='descBox'>
              <label>Description</label>
              <textarea name="description" value={menuItem.description} onChange={handleInputChange} required />
            </div>
            <div className="fields">
              <div className='inputFields'>
                <label>Price</label>
                <input type="number" name="price" value={menuItem.price} onChange={handleInputChange} required />
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
                <input type="checkbox" checked={isVeg} onChange={handleVegChange}/>
                <p>Is Veg?</p>
              </div>
              <div className='inputFields'>
                <input type="checkbox" checked={isNonVeg} onChange={handleNonVegChange}/>
                <p>Is Nov-Veg?</p>
              </div>
            </div>
            {/* <div className="fields fieldBackgorund">
              <div className='inputFields'>
                <label>Discount Name</label>
                <input type="text" />
              </div>
              <div className='inputFields'>
                <label>Discount Amount</label>
                <input type="text" />
              </div>
              <div className='inputFields'>
                <label>Actual Amount</label>
                <input type="text" />
              </div>
            </div> */}
            <div className="submit-button">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>

        <form onSubmit={handleNutritionSubmit}>
          <div className="form-section nutrition-form">
            <div className="type-section">
              <h4>Nutrition Values</h4>
              {typeValues.map((typeValue, index) => (
                <div key={index} className="type-value">
                  <div className="inputFields">
                    <label>Type</label>
                    <select
                      name="type"
                      value={typeValue.type}
                      onChange={(event) => handleTypeValueChange(index, event)}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Kcal">Kcal</option>
                      <option value="Protein">Protein</option>
                      <option value="Carbs">Carbs</option>
                      <option value="Fats">Fats</option>
                    </select>
                  </div>
                  <div className="inputFields">
                    <label>Value</label>
                    <input
                      type="text"
                      name="value"
                      placeholder="Value"
                      value={typeValue.value}
                      onChange={(event) => handleTypeValueChange(index, event)}
                      required
                    />
                  </div>
                  <div className="inputFields">
                    <label>Category</label>
                    <select
                      name="category"
                      value={typeValue.category}
                      onChange={(event) => handleTypeValueChange(index, event)}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="category1">None</option>
                      <option value="category2">Grams</option>
                    </select>
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
      </div>
    </div>
  )
}

export default AddItem;

  

  


  


// const [typeValues, setTypeValues] = useState(
//     { type: '', value: '', category: '' }
//   );
// const handleTypeValueChange = (e) => {
//     const { name, value } = e.target;
//     setTypeValues({ ...typeValues, [name]: value });
//   };

//   const handleRemoveTypeValue = (index) => {
//     const values = [...typeValues];
//     values.splice(index, 1);
//     setTypeValues(values);
//   };

//   const handleNutritionSubmit = async (e) => {
//     e.preventDefault();

//     const apiUrl = 'https://zerocarbs.in/api/menu/nutrition';
//     const token = localStorage.getItem('authToken');

//     const data = new FormData();
//     data.append('type', typeValues.type);
//     data.append('value', typeValues.value);
//     data.append('category', typeValues.category);

//     try {
//       const response = await axios.post(apiUrl, data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       console.log(response.data);
//       setResponse(response.data);
//     } catch (err) {
//       console.log('Error', err);
//     }
//   }

//   <form onSubmit={handleNutritionSubmit}>
//           <div className="form-section nutrition-form">
//             <div className="type-section">
//               <h4>Nutrition Values</h4>
//               <div className="type-value">
//                 <div className="inputFields">
//                   <label>Type</label>
//                   <select
//                     name="type"
//                     value={typeValues.type}
//                     onChange={handleTypeValueChange}
//                     required>
//                     <option value="">Select Type</option>
//                     <option value="Kcal">Kcal</option>
//                     <option value="Protein">Protein</option>
//                     <option value="Carbs">Carbs</option>
//                     <option value="Fats">Fats</option>
//                   </select>
//                 </div>
//                 <div className="inputFields">
//                   <label>Value</label>
//                   <input
//                     type="text"
//                     name="value"
//                     placeholder="Value"
//                     value={typeValues.value}
//                     onChange={handleTypeValueChange}
//                     required />
//                 </div>
//                 <div className="inputFields">
//                   <label>Category</label>
//                   <select
//                     name="category"
//                     value={typeValues.category}
//                     onChange={handleTypeValueChange}
//                     required>
//                     <option value="">Select Category</option>
//                     <option value="category1">None</option>
//                     <option value="category2">Grams</option>
//                   </select>
//                 </div>
//                 <Button className='deleteBtn' onClick={handleRemoveTypeValue}>
//                   <MdDeleteForever size={30} style={{ color: 'red' }} />
//                 </Button>
//               </div>
//               <div className='addNewTypeBtn'>
//                 <Button type="button">Add New</Button>
//               </div>
//             </div>
//             <div className="submit-button">
//               <Button type="submit">Submit</Button>
//             </div>
//           </div>
//         </form>