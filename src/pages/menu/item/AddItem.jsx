/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useRef } from "react";
import "../item/style.scss";
import Button from "@mui/material/Button";
import { MdDeleteForever } from "react-icons/md";
import { fetchCategories } from "../../../utils/CategoryAPI";
import { RiDeleteBin6Line } from "react-icons/ri";
import { createAddOn, getAllAddOns, addAddon , removeAddOn } from "../../../utils/AddOnAPI";
import { fetchMenuItemById, getAllMenu } from "../../../utils/MenuAPI";

import {
  addItem,
  addNutritionValue,
  deleteNutritionValue,
} from "../../../utils/MenuAPI";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./addOn.css";
import "./createAddOn.css";

const AddItem = () => {
  // AddON constant

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (id) => {
    setActiveIndex((prevIndex) => (prevIndex === id ? null : id));
  };

  // adon constants end

  const [groupName, setGroupName] = useState("");
  const [maxQuantity, setMaxQuantity] = useState(0);
  const location = useLocation();
  const [options, setOptions] = useState([]);
  const [response, setResponse] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    type: "",
    image: null,
    image_external_url: "",
    description: "",
    price: "",
  });

  const [nutriValues, setNutriValues] = useState([
    {
      type: "",
      value: "",
      category: "",
    },
  ]);

  const [errors, setErrors] = useState({});
  const refs = {
    name: useRef(null),
    category_id: useRef(null),
    image: useRef(null),
    description: useRef(null),
    price: useRef(null),
    type: useRef(null),
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
        console.log("Err", err);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (location.state && location.state.itemData) {
      setFormData(location.state.itemData);
      setItemId(location.state.itemData.id); // Access id from itemData
      if (location?.state?.isEdit === true) {
        setShowAddOn(true);
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setErrors({ ...errors, image: "" });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
    setErrors({ ...errors, type: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.category_id) newErrors.category_id = "Category is required.";
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.description)
      newErrors.description = "Description is required.";
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
        name: "",
        category_id: "",
        type: "",
        image: null,
        image_external_url: "",
        description: "",
        price: "",
      });
      if (response.data.id) {
        setShowAddOn(true);
      }
      if (refs.image.current) {
        refs.image.current.value = null;
      }
    } catch (error) {
      console.log("Err", error.response?.data || error.message);
    }
  };

  const handleTypeValueChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "value" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const values = [...nutriValues];
    values[index][name] = value;
    setNutriValues(values);
    setErrors({ ...errors, nutriValues: "" });
  };

  const handleAddTypeValue = () => {
    setNutriValues([...nutriValues, { type: "", value: "", category: "" }]);
  };

  const handleRemoveTypeValue = async (index) => {
    const values = [...nutriValues];
    const nutritionId = values[index].id;

    if (nutritionId) {
      try {
        await deleteNutritionValue(nutritionId);
        toast.success("Nutrition value deleted successfully");
      } catch (error) {
        toast.error("Failed to delete nutrition value");
        return;
      }
    }
    values.splice(index, 1);
    setNutriValues(values);
  };

  const validateNutritionForm = () => {
    let newErrors = {};
    nutriValues.forEach((nutriValue, index) => {
      if (!nutriValue.type)
        newErrors[`nutriValues-${index}-type`] = "Type is required.";
      if (!nutriValue.value)
        newErrors[`nutriValues-${index}-value`] = "Value is required.";
      if (!nutriValue.category)
        newErrors[`nutriValues-${index}-category`] = "Category is required.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNutritionSubmit = async (e) => {
    e.preventDefault();

    // for now if isEdit is true just set SetNutrients to false and return if later if editing nutri value API is available change it

    if (isEdit == true) {
      setShowNutrients(false);
      setSowSelectedAddOns(false);
      return;
    }
    setSowSelectedAddOns(false);

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
      setNutriValues([
        {
          type: "",
          value: "",
          category: "",
        },
      ]);
    } catch (error) {
      console.log("Err", error);
    }
  };

  // handle create add on group

  const [addOnFormValidation, setAddOnFormValidation] = useState({
    group_name: false,
    quantity: false,
  });

  const [addOnsItem, setAddOnsItem] = useState([]);
  const [addOnErrors, setAddOnErrors] = useState([]);
  const [addonFormDataStore, setAddonFormDataStore] = useState([]);
  const [addOnGroups, setAddOnGroups] = useState([]);
  const [checkedAddons, setCheckedAddons] = useState([]);
  const [showNutrients, setShowNutrients] = useState(false);
  const [showAddOn, setShowAddOn] = useState(false);

  const [addOnFormData, setAddOnFormData] = useState({
    group_name: "",
    quantity: 0,
    image: "",
    add_on_name: "",
    add_on_type: "veg",
    price: 0.0,
  });

  // const [addOnFormDataToSend, setAddOnFormDataToSend] = useState([]);

  const [isShowCreateAddOn, setIsShowCreateAddOn] = useState(false);

  const [addOnImageFile, setAddOnImageFile] = useState(null);

  const handleGroupNameChange = (e) => {
    const newValue = e.target.value;
    setAddOnFormData((prev) => {
      return { ...prev, group_name: newValue };
    });
    // console.log("Group Name:", addOnFormData);
  };

  function handleQuantityChange(e) {
    const newValue = e.target.value;

    // Allow empty or numeric values only
    if (newValue === "" || /^[0-9]+$/.test(newValue)) {
      setAddOnFormData((prev) => ({
        ...prev,
        quantity: newValue === "" ? "" : parseInt(newValue), // Handle empty case
      }));
    }
  }

  // Handler to add a new addon
  const handleAddAddon = () => {
    setAddOnsItem((prevAddons) => [
      ...prevAddons,
      {
        file: "",
        add_on_name: "",
        add_on_type: "veg",
        add_on_price: "0",
        group_name: addOnFormData.group_name,
        quantity: addOnFormData.quantity,
      },
    ]);
    setAddOnErrors((prevErrors) => [
      ...prevErrors,
      {
        file: false,
        add_on_name: false,
        add_on_type: false,
        add_on_price: false,
      },
    ]);
  };

  function handleCreateAddOn() {
    if (addOnFormData.group_name == "") {
      setAddOnFormValidation((prev) => ({ ...prev, group_name: true }));

      return;
    }
    if (addOnFormData.quantity == "") {
      setAddOnFormValidation((prev) => ({ ...prev, quantity: true }));

      return;
    }

    setAddOnFormValidation((prevState) => {
      const resetValidation = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      return resetValidation;
    });

    handleAddAddon();

    setAddOnFormData((prev) => {
      return {
        ...prev,
        image: "",
        add_on_name: "",
        price: "0",
      };
    });

    setAddOnImageFile(null);
  }

  // Handler to update a specific addon field
  const handleInputChange = (index, field, value) => {
    setAddOnsItem((prevAddons) =>
      prevAddons.map((addon, i) =>
        i === index ? { ...addon, [field]: value } : addon
      )
    );

    setAddOnErrors((prevErrors) =>
      prevErrors.map((error, i) =>
        i === index ? { ...error, [field]: !value } : error
      )
    );
  };

  // Handler to delete a specific addon
  const handleAddOnDeleteButton = (index) => {
    setAddOnsItem((prevAddons) => prevAddons.filter((_, i) => i !== index));
    setAddOnErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  // Handler for "Next" button to validate and save the addon data
  const handleAddOnSave = async () => {
    const newErrors = addOnsItem.map((addon) => ({
      add_on_name: !addon.add_on_name,
      add_on_price: !addon.add_on_price,
    }));
    if (addOnFormData.group_name == "") {
      setAddOnFormValidation((prev) => ({ ...prev, group_name: true }));

      return;
    }
    if (addOnFormData.quantity == "") {
      setAddOnFormValidation((prev) => ({ ...prev, quantity: true }));

      return;
    }
    if (addOnsItem.length == 0) {
      return;
    }

    setAddOnErrors(newErrors);

    const hasError = newErrors.some(
      (error) => error.add_on_name || error.add_on_price
    );

    if (!hasError) {
      const updatedStore = addOnsItem;
      setAddonFormDataStore(updatedStore);

      // Directly call createAddOn with the latest addOnFormData
      const response = await createAddOn(
        updatedStore,
        addOnFormData.group_name,
        addOnFormData.quantity
      );
      if (response == "ok") {
        setAddOnsItem([]);
        setAddonFormDataStore([]);
        setAddOnFormData({
          group_name: "",
          quantity: 0,
          image: "",
          add_on_name: "",
          add_on_type: "veg",
          price: 0.0,
        });
        setIsShowCreateAddOn(false);
        const addOnGroupFetch = await getAllAddOns();
        setAddOnGroups(addOnGroupFetch.data);
      }
      console.log("Saved Addon Data:", updatedStore);
    } else {
      console.log("Validation failed: Some fields are empty.");
    }
  };

  // function handleDeleteAddOnItem(index) {
  //   const updatedData = [...addOnFormDataToSend];
  //   updatedData.splice(index, 1);
  //   setAddOnFormDataToSend(updatedData);
  // }

  useEffect(() => {
    // console.log(addOnFormDataToSend);
  }, [addOnFormData]);

  const DownArrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#666"
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );

  // end of  handle create add on group

  // handle create addon group

  function handleCreateAddOnGroup() {
    setIsShowCreateAddOn(true);
  }

  useEffect(() => {
    (async () => {
      const response = await getAllAddOns();
      setAddOnGroups(response.data);
      // console.log(response);
    })();
  }, []);

  useEffect(() => {
    console.log(addOnGroups);
  }, [addOnGroups]);

  // handle when user click on next in submit addon
  async function handleAddOnSubmit() {
    if (checkedAddons.length == 0 && unselectedAddOns.length == 0) {
      setShowAddOn(false);
      setShowNutrients(true);
      return;
    } else {
      if(checkedAddons.length > 0){
        const res = await addAddon(itemId, checkedAddons);
        if(res != "ok"){
          return;
        }
        if (addOnGroups && addOnGroups.length > 0) {
          const selectedAddOns = addOnGroups.filter((addOn) =>
            checkedAddons.includes(addOn.id)
          );
          setSelectedAddons(selectedAddOns);
          setSowSelectedAddOns(true);
        }
        
      }

      if(unselectedAddOns.length > 0) {
        const res = await removeAddOn(itemId , unselectedAddOns);
        if(res != "ok"){
          return;
        }
        console.log("unselect result: ",res);
      }

      // if (res == "ok") {
        setShowAddOn(false);
        setShowNutrients(true);
      // }
    }
    // console.log("checked addons: ", checkedAddons);
    // console.log("unselected addons: ", unselectedAddOns);
  }

  // end

  // fetching existing nutrients values

  const [fetchedNutrients, setFetchedNutrients] = useState({});
  const [fetchedItemAddon, setFetchedItemAddon] = useState({});

  useEffect(() => {
    if (isEdit && itemId) {
      (async () => {
        const response = await fetchMenuItemById(itemId);
        if (response.data?.nutritions.length > 0) {
          setFetchedNutrients(response.data.nutritions);
        } else {
          setFetchedNutrients([]);
        }
      })();
    }
  }, [itemId]);

  useEffect(() => {
    (async () => {
      if (isEdit && itemId) {
        const res = await getAllMenu();

        // Combine all items into one variable
        const allItems = res.data.flatMap((menu) => menu.items);

        // Iterate and find the item with matching itemId
        const matchedItem = allItems.find((item) => item.id === itemId);

        // If a match is found and addons exist, set the fetchedItemAddon state
        if (matchedItem && matchedItem.addons) {
          setFetchedItemAddon(matchedItem.addons);
          console.log(matchedItem);
        } else {
          setFetchedItemAddon({}); // Reset if no match or addons don't exist
        }
      }
    })();
  }, [fetchedNutrients, isEdit, itemId]);

  async function handleFetchNutri(id) {
    const response = await deleteNutritionValue(id);
    console.log(response);
    if (response.success == true) {
      setFetchedNutrients(fetchedNutrients.filter((item) => item.id != id));
    }
  }

  //end

  // Show Selected Addons

  const [selectedAddOns, setSelectedAddons] = useState([]);
  const [unselectedAddOns, setUnselectedAddOns] = useState([]);
  const [showSelectedAddOns, setSowSelectedAddOns] = useState(false);

  useEffect(() => {
    console.log(unselectedAddOns);
  }, [unselectedAddOns]);

  //end

  return (
    <>
      <div className="body-content">
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
                  <input
                    ref={refs.name}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter item name"
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div className="inputFields">
                  <label>Category</label>
                  <select
                    ref={refs.category_id}
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    <option value="select">Select Category</option>
                    {options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="error">{errors.category_id}</p>
                  )}
                </div>
              </div>
              <div className="fields">
                <div className="inputFields">
                  <label>Choose Image</label>
                  <input
                    ref={refs.image}
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                  />
                  {errors.image && <p className="error">{errors.image}</p>}
                </div>
                <div className="inputFields">
                  <label>
                    Image Url <span>(If Any)</span>
                  </label>
                  <input
                    type="text"
                    name="image_external_url"
                    value={formData.image_external_url}
                    onChange={handleChange}
                    placeholder="Enter image url"
                  />
                </div>
              </div>
              <div className="descBox">
                <label>Description</label>
                <textarea
                  ref={refs.description}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter item description"
                />
                {errors.description && (
                  <p className="error">{errors.description}</p>
                )}
              </div>
              <div className="fields">
                <div className="inputFields">
                  <label>Price</label>
                  <input
                    ref={refs.price}
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter item price"
                  />
                  {errors.price && <p className="error">{errors.price}</p>}
                </div>
                <div className="inputFields">
                  <label>
                    Discount <span>(If Any)</span>
                  </label>
                  <select>
                    <option value="">Select Category</option>
                    <option value="category1">Voucher</option>
                    <option value="category2">Voucher</option>
                  </select>
                </div>
              </div>
              <div className="checkboxField">
                <div className="inputFields">
                  <input
                    ref={refs.type}
                    type="checkbox"
                    name="type"
                    value="veg"
                    checked={formData.type === "veg"}
                    onChange={() => handleTypeChange("veg")}
                  />
                  <p>Is Veg?</p>
                </div>
                <div className="inputFields">
                  <input
                    ref={refs.type}
                    type="checkbox"
                    name="type"
                    value="non-veg"
                    checked={formData.type === "non-veg"}
                    onChange={() => handleTypeChange("non-veg")}
                  />
                  <p>Is Non-Veg?</p>
                </div>
                {errors.type && <p className="error">{errors.type}</p>}
              </div>
              <div className="submit-button">
                <Button type="submit">{isEdit ? "Update" : "Next"}</Button>
              </div>
            </div>
          </form>

          {isShowCreateAddOn && (
            <div className="create-add-on-container">
              <div className="create-add-on-header">
                <span>Create Add On Group</span>
              </div>
              <div className="create-add-on">
                <div className="create-add-on-groupName-container">
                  <div className="create-add-on-group-name">
                    <span>Group Name</span>
                    <input
                      type="text"
                      placeholder="Enter Group Name"
                      value={addOnFormData.group_name}
                      onChange={handleGroupNameChange}
                    />

                    {addOnFormValidation.group_name && (
                      <p className="add-on-form-warning">required</p>
                    )}
                  </div>
                  <div className="create-add-on-quantity">
                    <span>Allow selecting multiple units of</span>
                    <div className="maximum-quantity">
                      <span>Maximum Quantity per item</span>
                      <input
                        type="text"
                        value={addOnFormData.quantity}
                        onChange={handleQuantityChange}
                      />
                      {addOnFormValidation.quantity && (
                        <p className="add-on-form-warning">required</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="create-add-on-button">
                  <button onClick={handleCreateAddOn}>
                    + Create Add on here
                  </button>
                </div>
              </div>

              <div className="add-on-upload-container">
                {addOnsItem.map((addOnItem, index) => {
                  return (
                    <div key={index} className="upload-add-on">
                      <span
                        onClick={() =>
                          document
                            .getElementById(`add-on-img-file-${index}`)
                            .click()
                        }
                      >
                        <img style={{ width: "30px" }} src="/upload.svg" />
                        <span>
                          Upload
                          {addOnImageFile && (
                            <span className="upload-file-indicator">1</span>
                          )}
                        </span>
                        <input
                          id={`add-on-img-file-${index}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleInputChange(index, "file", e.target.files[0])
                          }
                        />
                      </span>
                      <div className="upload-add-on-name">
                        <span>
                          Add On Name{" "}
                          {addOnErrors[index]?.add_on_name && (
                            <span className="add-on-form-warning">
                              required
                            </span>
                          )}
                        </span>

                        <input
                          type="text"
                          value={addOnItem.add_on_name}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "add_on_name",
                              e.target.value
                            )
                          }
                          placeholder="Enter Name"
                        />
                      </div>
                      <div className="add-on-type">
                        <span>Add on type</span>
                        <div className="custom-select">
                          <div className="select-icon">
                            {addOnItem.add_on_type === "veg" && (
                              <img src="/veg.svg" />
                            )}
                            {addOnItem.add_on_type === "non-veg" && (
                              <img src="/non-veg.svg" />
                            )}
                          </div>
                          <select
                            value={addOnItem.add_on_type}
                            onChange={(e) => {
                              handleInputChange(
                                index,
                                "add_on_type",
                                e.target.value
                              );
                            }}
                          >
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                          </select>
                          <div className="select-arrow">
                            <DownArrow />
                          </div>
                        </div>
                      </div>

                      <div className="upload-add-on-price">
                        <span>
                          Add On Price{" "}
                          {addOnErrors[index]?.add_on_price && (
                            <span className="add-on-form-warning">
                              required
                            </span>
                          )}
                        </span>
                        <input
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "add_on_price",
                              e.target.value
                            )
                          }
                          value={addOnItem.add_on_price}
                          type="text"
                          placeholder="Enter Price"
                        />
                      </div>
                      <RiDeleteBin6Line
                        style={{ marginTop: "15px", marginLeft: "15px" }}
                        size={25}
                        color="#B3DB5F"
                        onClick={() => handleAddOnDeleteButton(index)}
                      />
                    </div>
                  );
                })}
              </div>
              <button className="add-on-save-btn" onClick={handleAddOnSave}>
                Save
              </button>
            </div>
          )}

          {showSelectedAddOns && (
            <div className="add-on-conatiner">
              <div
                style={{ margin: "0px", width: "100%" }}
                className="add-on-header"
              >
                <span>Selected Add Ons</span>
              </div>

              <div
                style={{ marginTop: "0px" }}
                className="add-on-items-container"
              >
                {selectedAddOns.map((addOnGroup) => (
                  <div
                    style={{ marginLeft: "0px", marginRight: "0px" }}
                    key={addOnGroup.id}
                    className="add-on-item"
                  >
                    <div
                      className="add-on-item-header"
                      onClick={() => handleToggle(addOnGroup.id)}
                    >
                      <img src="/arrow-down.svg" />
                      <span>{addOnGroup.name}</span>
                    </div>
                    <div
                      className={`add-on-item-content ${
                        activeIndex === addOnGroup.id ? "open" : ""
                      }`}
                    >
                      {addOnGroup.items.map((addOns) => (
                        <div key={addOns.id} className="add-on-content-item">
                          <img
                            src={`${
                              addOns.type == "veg" ? "/veg.svg" : "/non-veg.svg"
                            }`}
                            alt={addOns.item}
                          />
                          <span>{addOns.item}</span>
                          <span>&#8377; {addOns.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showNutrients && itemId !== null && (
            <form onSubmit={handleNutritionSubmit}>
              <div
                style={{ marginTop: "50px" }}
                className="form-section nutrition-form"
              >
                <div className="type-section">
                  <h4>Nutrition Values</h4>
                  {!isEdit && (
                    <>
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
                            {errors[`nutriValues-${index}-type`] && (
                              <p className="error">
                                {errors[`nutriValues-${index}-type`]}
                              </p>
                            )}
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
                            {errors[`nutriValues-${index}-value`] && (
                              <p className="error">
                                {errors[`nutriValues-${index}-value`]}
                              </p>
                            )}
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
                            {errors[`nutriValues-${index}-category`] && (
                              <p className="error">
                                {errors[`nutriValues-${index}-category`]}
                              </p>
                            )}
                          </div>

                          <Button
                            className="deleteBtn"
                            onClick={() => handleRemoveTypeValue(index)}
                          >
                            <MdDeleteForever
                              size={30}
                              style={{ color: "red" }}
                            />
                          </Button>
                        </div>
                      ))}

                      <div className="addNewTypeBtn">
                        <Button type="button" onClick={handleAddTypeValue}>
                          Add New
                        </Button>
                      </div>
                    </>
                  )}

                  {isEdit &&
                    fetchedNutrients.map((nutri) => {
                      return (
                        <div key={nutri?.id} className="type-value">
                          <div className="inputFields">
                            <label>Type</label>
                            <select
                              name="type"
                              value={nutri?.type}
                              // onChange={(e) => handleTypeValueChange(e, index)}
                            >
                              <option value="select">Select Type</option>
                              <option value="Kcal">Kcal</option>
                              <option value="Protein">Protein</option>
                              <option value="Carbs">Carbs</option>
                              <option value="Fats">Fats</option>
                            </select>
                            {/* {errors[`nutriValues-${index}-type`] && <p className="error">{errors[`nutriValues-${index}-type`]}</p>}  */}
                          </div>
                          <div className="inputFields">
                            <label>Value</label>
                            <input
                              type="text"
                              name="value"
                              placeholder="Enter nutrition value"
                              value={nutri?.value}
                              // onChange={(e) => handleTypeValueChange(e, index)}
                            />
                            {/* {errors[`nutriValues-${index}-value`] && <p className="error">{errors[`nutriValues-${index}-value`]}</p>} */}
                          </div>
                          <div className="inputFields">
                            <label>Category</label>
                            <select
                              name="category"
                              value={nutri?.category}
                              // onChange={(e) => handleTypeValueChange(e, index)}
                            >
                              <option value="Select">Select Category</option>
                              <option value="category1">None</option>
                              <option value="category2">Grams</option>
                            </select>
                            {/* {errors[`nutriValues-${index}-category`] && <p className="error">{errors[`nutriValues-${index}-category`]}</p>} */}
                          </div>
                          <Button
                            className="deleteBtn"
                            onClick={() => handleFetchNutri(nutri.id)}
                          >
                            <MdDeleteForever
                              size={30}
                              style={{ color: "red" }}
                            />
                          </Button>
                        </div>
                      );
                    })}
                  {/* <div className='addNewTypeBtn'>
                  <Button type="button" onClick={handleAddTypeValue}>Add New</Button>
                </div> */}
                </div>
                <div className="submit-button">
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </form>
          )}

          {showAddOn && itemId != null && (
            <div className="add-on-conatiner">
              <div className="add-on-header">
                <span>Choose Your Add On</span>
                <button onClick={handleCreateAddOnGroup}>
                  Create Add Group <span>+</span>
                </button>
              </div>

              <div className="add-on-items-container">
                {addOnGroups.map((addOnGroup) => {
                  let isAddOnChecked = false;
                  if (fetchedItemAddon && fetchedItemAddon.length > 0) {
                    for (let i = 0; i < fetchedItemAddon.length; i++) {
                      if (
                        fetchedItemAddon[i].addon_group_id === addOnGroup.id
                      ) {
                        isAddOnChecked = true;
                        break;
                      }
                    }
                  }

                  return (
                    <div key={addOnGroup.id} className="add-on-item">
                      <div
                        className="add-on-item-header"
                        onClick={() => handleToggle(addOnGroup.id)}
                      >
                        <img src="/arrow-down.svg" />
                        <span>{addOnGroup.name}</span>
                        <input
                          type="checkbox"
                          id="add-on"
                          name="add-on"
                          value="add-on"
                          className="add-check-box"
                          checked={
                            (isAddOnChecked &&
                              !unselectedAddOns.includes(addOnGroup.id)) ||
                            checkedAddons.includes(addOnGroup.id)
                          }
                          onChange={(e) => {
                            const isChecked = e.target.checked;

                            if (!isChecked && isAddOnChecked) {
                              setUnselectedAddOns((prev) => [
                                ...prev,
                                addOnGroup.id,
                              ]);
                            } else if (isChecked && isAddOnChecked) {
                              setUnselectedAddOns((prev) =>
                                prev.filter((id) => id !== addOnGroup.id)
                              );
                            }

                            if (!isAddOnChecked) {
                              setCheckedAddons((prev) => {
                                if (isChecked) {
                                  return [...prev, addOnGroup.id];
                                } else {
                                  return prev.filter(
                                    (id) => id !== addOnGroup.id
                                  );
                                }
                              });
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div
                        className={`add-on-item-content ${
                          activeIndex === addOnGroup.id ? "open" : ""
                        }`}
                      >
                        {addOnGroup.items.map((addOns) => (
                          <div key={addOns.id} className="add-on-content-item">
                            <img
                              src={`${
                                addOns.type == "veg"
                                  ? "/veg.svg"
                                  : "/non-veg.svg"
                              }`}
                              alt={addOns.item}
                            />
                            <span>{addOns.item}</span>
                            <span>&#8377; {addOns.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="add-on-submit-button"
                onClick={handleAddOnSubmit}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddItem;
