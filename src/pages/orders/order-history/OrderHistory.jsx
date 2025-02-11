/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../new-orders/styles.scss";
import { initialOrders } from "../../../utils/OrderDetails";
import { PiBowlSteamFill } from "react-icons/pi";
import { fetchOrders } from "../../../utils/OrdersAPI";
import { imageUrl } from "../../../api/ApiConfig";
import vegImage from "../../../assets/images/veg.svg";
import nonVegImage from "../../../assets/images/non-veg.svg";
const OrderHistory = () => {
  const [order, setOrders] = useState([]);

  useEffect(() => {
    document.title = "ZeroCarbs | Orders";
  });

  // Fetch Orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrders();
        if (response && response.data) {
          const fetchedOrders = response.data.map((order) => ({
            id: order.id,
            name: order.name,
            phone: order.phone,
            address: order.email,
            status: order.status?.name || "N/A",
            timer: 0,
            initialTimer: 0,
            isPaused: false,
            // Flatten the items array
            items:
              order?.order_summary?.flatMap((summary) =>
                summary.item.map((item) => ({ ...item, qty: summary.qty }))
              ) ?? [],
            payment: order.payment_mode,
            payment_status: order.payment_status === 1 ? "Paid" : "Unpaid",
            request: "",
          }));
          console.log(fetchedOrders);
          setOrders(fetchedOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };
    getOrders();
  }, []);
  return (
    <div className="body-content">
      <div className="card border-0 p-3">
        <h3 className="mb-0">Orders History</h3>
      </div>
      <div className="border-0">
        <div className="card-body">
          <div className="filter-tab"></div>
          <ul className="order-details">
            {order?.map((order) => (
              <li key={order.id} className="order-details-body">
                <div className="leftBox">
                  <div className="orderStatus">
                    <h3>{order.status}</h3>
                  </div>
                  <h4>
                    ID : <span>{order.id}</span>
                  </h4>
                  <h5>Name : {order.name}</h5>
                  <p>Call : {order.phone}</p>
                  <p>Email : {order.address}</p>
                </div>
                <div className="rightBox">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-info">
                      <div className="item-info">
                        <div className="item-box">
                          <img src={`${imageUrl}${item.image}`} alt="Item" />

                          <p>
                            {item.qty} x <span>{item.name}</span>
                          </p>
                          <div className="type-image">
                            <img
                              src={item.type === "veg" ? vegImage : nonVegImage}
                              alt={item.type === "veg" ? "Veg" : "Non-Veg"}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="price">₹&nbsp;{item.price}</p>
                    </div>
                  ))}
                  <hr />
                  <div className="additional-info">
                    <PiBowlSteamFill size={20} />
                    <p>
                      Order Request : <span>{order.request}</span>
                    </p>
                  </div>
                  <hr />
                  <div className="bill-details">
                    <div className="bill-detail">
                      <p>Total Bill</p>
                    </div>
                    <p className="price">
                      ₹&nbsp;
                      {order.items
                        .reduce(
                          (total, item) => total + parseFloat(item?.price || 0),
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
