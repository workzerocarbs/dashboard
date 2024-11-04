import React, { useState } from 'react';
import '../orders-modal/OrderModal.scss'; // Create a separate CSS file or use inline styles

const OrderModal = ({ closeModal }) => {
  const [prepTime, setPrepTime] = useState(22);

  const handleTimeChange = (increment) => {
    setPrepTime(prepTime + increment);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contents">
    <div className='modal-wrapper'>
    <div className="modal-header text-black">
          <p>ZOMATO DELIVERY</p>
         
          <button className="close-button" onClick={closeModal}>X</button>
        </div>

        <div className="modal-body text-black p-3">
            <div className='d-flex justify-content-between align-items-center p-2'>
            <p>ID: 8587 | 12:41 PM</p>
            <div className='d-flex flex-column gap-1'>
            <p>2nd order by Amit Bajaj </p>
            <span className="premium-badge">LOYAL CUSTOMER</span>
            </div>
            </div>
            <hr/>
        
          <div className="order-item">
            <p>1 x Exotic Fruit Salad - ₹349</p>
            <p className="special-instructions alert">please send the dressing separately</p>
          </div>

          <div className="pricing">
          <div className="pricing-details">
    <p><span className="bordered">Item Total: ₹349</span></p>
    <p><span className="bordered">Taxes: ₹0</span></p>
    <p><span className="bordered">Discount: -₹50</span></p>
</div>
            <hr/>
       <div className='d-flex justify-content-between'>
       <p>Total Bill: <span className="paid-badge">PAID</span></p> <span> ₹299</span>
       </div>
            <hr/>
          </div>

          <div className="prep-time mb-2">
            <label>Set food preparation time:</label>
            <div className="preparation-button d-flex gap-2">
            <button className="kot-button">KOT</button>
            <button className="order-button">ORDER</button>
             
            </div>
          </div>

          <div className="time-controls mb-2">
 <div className='text-center' style={{borderRight:"1px solid black", borderRadius: "0px !important"}}> <span onClick={() => handleTimeChange(-1)}>-</span></div>
  <span>{prepTime} min</span>
 <div className='text-center' style={{borderLeft:"1px solid black", borderRadius: "0px !important"}}>
 <span onClick={() => handleTimeChange(1)}>+</span>
 </div>
</div>



<div className="button-container">
  <button className="reject-button">Reject</button>
  <button className="accept-button">Accept order (4:49)</button>
</div>

        </div>


    </div>
      </div>
    </div>
  );
};

export default OrderModal;
