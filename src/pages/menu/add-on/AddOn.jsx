import React, { useEffect, useState } from "react";
import "./addOn.css";
import { getAllAddOns } from "../../../utils/AddOnAPI";

const AddOn = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [addOns, setAddOns] = useState([]);

  const handleToggle = (id) => {
    setActiveIndex((prevIndex) => (prevIndex === id ? null : id));
  };

  const addOnItemsArr = [
    {
      id: "section-1", // Unique ID for the section
      title: "Section 1",
      content: [
        { id: "item-1-1", name: "Carrot Juice", isVeg: true, price: "222" },
        { id: "item-1-2", name: "Apple Juice", isVeg: true, price: "150" },
        { id: "item-1-3", name: "Orange Juice", isVeg: true, price: "180" },
        { id: "item-1-3", name: "Orange Juice", isVeg: true, price: "180" },
        { id: "item-1-3", name: "Orange Juice", isVeg: true, price: "180" },
        { id: "item-1-3", name: "Orange Juice", isVeg: true, price: "180" },
        { id: "item-1-3", name: "Orange Juice", isVeg: true, price: "180" },
      ],
    },
    {
      id: "section-2",
      title: "Section 2",
      content: [
        { id: "item-2-1", name: "Chicken Salad", isVeg: false, price: "300" },
        { id: "item-2-2", name: "Tuna Salad", isVeg: false, price: "350" },
      ],
    },
    {
      id: "section-3",
      title: "Section 3",
      content: [
        { id: "item-3-1", name: "Greek Salad", isVeg: true, price: "250" },
        { id: "item-3-2", name: "Caesar Salad", isVeg: true, price: "275" },
      ],
    },
  ];

  useEffect(() => {
    ( async () =>{
      const response = await getAllAddOns();
      console.log(response)
      setAddOns(response?.data)
    })()
  }, []);

  useEffect(() =>{
    console.log(addOns)
  },[addOns])
  return (
    <div className="zpt-add-on-container">
      {/* <div className="zpt-add-on-header">
      <span>Choose Your Addon</span>
      <button>Create Add Group +</button>
    </div>
   */}
      <div className="zpt-add-on-items-container">
        <h1>Add-ons Groups</h1>
        {addOns && addOns.map((item) => (
          <div key={item?.id} className="zpt-add-on-item">
            <div
              className="zpt-add-on-item-header"
              onClick={() => handleToggle(item?.id)}
            >
              <img src="/arrow-down.svg" alt="arrow" />
              <span>{item?.name}</span>
              {/* <input
              type="checkbox"
              id="add-on"
              name="add-on"
              value="add-on"
              className="zpt-add-check-box"
              onClick={(e) => e.stopPropagation()} 
            /> */}
            </div>
            <div
              className={`zpt-add-on-item-content ${
                activeIndex === item.id ? "zpt-open" : ""
              }`}
            >
              {item?.items.map((addOns) => (
                <div key={addOns.id} className="zpt-add-on-content-item">
                  <img
                    src={`${addOns?.type == "veg"  ? "/veg.svg" : "/non-veg.svg"}`}
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
      {/*   
    <button className="zpt-add-on-submit-button">
      Submit
    </button> */}
    </div>
  );
};

export default AddOn;
