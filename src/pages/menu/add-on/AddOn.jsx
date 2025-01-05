import React, { useEffect, useRef, useState } from "react";
import "./addOn.css";
import { getAllAddOns } from "../../../utils/AddOnAPI";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { updateAddOnGroup, deleteAddOnItem } from "../../../utils/AddOnAPI";
import DeleteAddonModal from "./DeleteAddonModal";

const AddOn = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [addOns, setAddOns] = useState([]);
  const [showAddonGroups, setShowAddonGroups] = useState(true);
  const [isShowEditAddOn, setIsShowEditAddOn] = useState(false);
  const [selectedAddOnGroup, setSelectedAddOnGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addOnFormData, setAddOnFormData] = useState({
    group_name: "",
    quantity: "",
  });
  const [addOnFormValidation, setAddOnFormValidation] = useState({
    group_name: false,
    quantity: false,
  });
  const [addOnsItem, setAddOnsItem] = useState([]);
  const [addOnErrors, setAddOnErrors] = useState({});
  const [addOnImageFile, setAddOnImageFile] = useState(null);
  const [itemToBeDeleted, setItemToBeDeleted] = useState([0, 0]);

  const handleToggle = (id) => {
    setActiveIndex((prevIndex) => (prevIndex === id ? null : id));
  };

  useEffect(() => {
    (async () => {
      const response = await getAllAddOns();
      console.log(response);
      setAddOns(response?.data);
    })();
  }, []);

  const handleEditClick = (addon) => {
    setSelectedAddOnGroup(addon);
    setAddOnFormData({
      group_name: addon.name,
      quantity: addon.max_quantity.toString(),
    });

    const formattedItems = addon.items.map((item) => ({
      id: item.id,
      add_on_name: item.item,
      add_on_type: item.type,
      add_on_price: item.price,
      file: null,
    }));

    setAddOnsItem(formattedItems);
    setIsShowEditAddOn(true);
    setShowAddonGroups(false);
  };

  const handleGroupNameChange = (e) => {
    const value = e.target.value;
    setAddOnFormData((prev) => ({
      ...prev,
      group_name: value,
    }));
    setAddOnFormValidation((prev) => ({
      ...prev,
      group_name: false,
    }));
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAddOnFormData((prev) => ({
        ...prev,
        quantity: value,
      }));
      setAddOnFormValidation((prev) => ({
        ...prev,
        quantity: false,
      }));
    }
  };

  const handleInputChange = (index, field, value) => {
    setAddOnsItem((prev) => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        [field]:
          field === "add_on_price" ? value.replace(/[^\d.]/g, "") : value,
      };
      return newItems;
    });

    setAddOnErrors((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: false,
      },
    }));
  };

  const handleCreateAddOn = () => {
    setAddOnsItem((prev) => [
      ...prev,
      {
        add_on_name: "",
        add_on_type: "veg",
        add_on_price: "",
        file: null,
      },
    ]);
  };

  const handleAddOnDeleteButton = (index) => {
    setAddOnsItem((prev) => prev.filter((_, i) => i !== index));
    setAddOnErrors((prev) => {
      const newErrors = {};
      Object.entries(prev).forEach(([key, value]) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newErrors[keyNum] = value;
        } else if (keyNum > index) {
          newErrors[keyNum - 1] = value;
        }
      });
      return newErrors;
    });
  };

  const handleSaveAddOnGroup = async () => {
    let hasErrors = false;
    const groupErrors = {};

    if (!addOnFormData.group_name) {
      groupErrors.group_name = true;
      hasErrors = true;
    }
    if (!addOnFormData.quantity) {
      groupErrors.quantity = true;
      hasErrors = true;
    }

    setAddOnFormValidation(groupErrors);

    const itemErrors = {};
    addOnsItem.forEach((item, index) => {
      const errors = {};
      if (!item.add_on_name) {
        errors.add_on_name = true;
        hasErrors = true;
      }
      if (!item.add_on_price) {
        errors.add_on_price = true;
        hasErrors = true;
      }
      if (Object.keys(errors).length > 0) {
        itemErrors[index] = errors;
      }
    });

    setAddOnErrors(itemErrors);

    if (hasErrors) {
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("add_on_group_name", addOnFormData.group_name);
    formData.append("add_on_group_max_quantity", addOnFormData.quantity);

    // Use the IDs directly from addOnsItem
    addOnsItem.forEach((item, index) => {
      if (item.id) {
        formData.append(`add_on_group_items[${index}][id]`, item.id);
      }
      formData.append(`add_on_group_items[${index}][name]`, item.add_on_name);
      formData.append(`add_on_group_items[${index}][type]`, item.add_on_type);
      formData.append(`add_on_group_items[${index}][price]`, parseFloat(item.add_on_price).toFixed(2));

      if (item.file) {
        formData.append(`add_on_group_items[${index}][image]`, item.file);
      }
    });

    const res = await updateAddOnGroup(selectedAddOnGroup.id, formData);
    console.log("update result: ", res);
    const response = await getAllAddOns();
    setAddOns(response?.data);
    setIsShowEditAddOn(false);
    setShowAddonGroups(true);
  };

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

  const handleDelete = async () => {
    setIsModalOpen(false);
    const res = await deleteAddOnItem(itemToBeDeleted[0]);
    console.log("delete result: ", res);
    handleAddOnDeleteButton(itemToBeDeleted[1]);
  };

  return (
    <>
      {showAddonGroups && (
        <div className="zpt-add-on-container">
          <div className="zpt-add-on-items-container">
            <h1>Add-ons Groups</h1>
            {addOns &&
              addOns.map((item) => (
                <div key={item?.id} className="zpt-add-on-item">
                  <div
                    className="zpt-add-on-item-header"
                    onClick={() => handleToggle(item?.id)}
                  >
                    <img src="/arrow-down.svg" alt="arrow" />
                    <span>{item?.name}</span>
                    <MdEdit
                      size={25}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item);
                      }}
                    />
                  </div>
                  <div
                    className={`zpt-add-on-item-content ${
                      activeIndex === item.id ? "zpt-open" : ""
                    }`}
                  >
                    {item?.items.map((addOns) => (
                      <div key={addOns.id} className="zpt-add-on-content-item">
                        <img
                          src={`${
                            addOns?.type === "veg" ? "/veg.svg" : "/non-veg.svg"
                          }`}
                          alt={addOns?.item}
                        />
                        <span>{addOns?.item}</span>
                        <span>&#8377; {addOns?.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {isShowEditAddOn && (
        <div
          style={{ width: "90%", margin: "auto" }}
          className="create-add-on-container"
        >
          <div style={{ marginTop: "100px" }} className="create-add-on">
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
              <button >+ Create Add on here</button>
              {/* <button onClick={handleCreateAddOn}>+ Create Add on here</button> */}
            </div>
          </div>
          <div className="add-on-upload-container">
            {addOnsItem.map((addOnItem, index) => (
              <div key={index} className="upload-add-on">
                <span
                  onClick={() =>
                    document.getElementById(`add-on-img-file-${index}`).click()
                  }
                >
                  <img
                    style={{ width: "30px" }}
                    src="/upload.svg"
                    alt="upload"
                  />
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
                      <span className="add-on-form-warning">required</span>
                    )}
                  </span>
                  <input
                    type="text"
                    value={addOnItem.add_on_name}
                    onChange={(e) =>
                      handleInputChange(index, "add_on_name", e.target.value)
                    }
                    placeholder="Enter Name"
                  />
                </div>
                <div className="add-on-type">
                  <span>Add on type</span>
                  <div className="custom-select">
                    <div className="select-icon">
                      {addOnItem.add_on_type === "veg" && (
                        <img src="/veg.svg" alt="veg" />
                      )}
                      {addOnItem.add_on_type === "non-veg" && (
                        <img src="/non-veg.svg" alt="non-veg" />
                      )}
                    </div>
                    <select
                      value={addOnItem.add_on_type}
                      onChange={(e) =>
                        handleInputChange(index, "add_on_type", e.target.value)
                      }
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
                      <span className="add-on-form-warning">required</span>
                    )}
                  </span>
                  <input
                    onChange={(e) =>
                      handleInputChange(index, "add_on_price", e.target.value)
                    }
                    value={addOnItem.add_on_price}
                    type="text"
                    placeholder="Enter Price"
                  />
                </div>
                <RiDeleteBin6Line
                  style={{ marginTop: "15px", marginLeft: "15px", cursor: "pointer" }}
                  size={25}
                  color="#B3DB5F"
                  onClick={() => {
                    setIsModalOpen(true);
                    setItemToBeDeleted([addOnItem.id, index]);
                  }}
                />
                <DeleteAddonModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
          <button className="add-on-save-btn" onClick={handleSaveAddOnGroup}>
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default AddOn;