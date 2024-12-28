import React, { useState } from "react";
import "./addOn.css";

const AddOn = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (id) => {
    setActiveIndex((prevIndex) => (prevIndex === id ? null : id));
  };

  const addOnItemsArr =[
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
  return (
    <div className="add-on-conatiner">
      <div className="add-on-header">
        <span>Choose Your Addon</span>
        <button>Create Add Group +</button>
      </div>

      <div className="add-on-items-container">
        {addOnItemsArr.map((item) => (
          <div key={item.id} className="add-on-item">
            <div
              className="add-on-item-header"
              onClick={() => handleToggle(item.id)}
            >
              <img src='/arrow-down.svg'/>
              <span>{item.title}</span>
              <input
                type="checkbox"
                id="add-on"
                name="add-on"
                value="add-on"
                className="add-check-box"
                onClick={(e) => e.stopPropagation()} 
              ></input>
            </div>
            <div
              className={`add-on-item-content ${
                activeIndex === item.id ? "open" : ""
              }`}
            >
              {item.content.map((addOns) => (
                <div key={addOns.id} className="add-on-content-item">
                  <img
                    src={`${
                      addOns.isVeg ? "/veg.svg" : "/non-veg.svg"
                    }`}
                    alt={addOns.name}
                  />
                  <span>{addOns.name}</span>
                  <span>&#8377; {addOns.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="add-on-submit-button">
        Submit
      </button>
    </div>
  );
};

export default AddOn;
