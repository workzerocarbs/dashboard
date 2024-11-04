/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import '../new-orders/styles.scss';
import Button from '@mui/material/Button';
import { PiBowlSteamFill } from "react-icons/pi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { initialOrders } from '../../../utils/OrderDetails';
import { fetchOrders, updateOrder } from '../../../utils/OrdersAPI';
import { base_url } from '../../../api/ApiConfig';
import OrderModal from '../orders-modal/OrderModal';
import vegImage from '../../../assets/images/veg.svg';
import nonVegImage from '../../../assets/images/non-veg.svg'
const Orders = () => {
    const [activeTab, setActiveTab] = useState('New');
    const [orders, setOrders] = useState([]);
    const [additionalTime, setAdditionalTime] = useState({});
    const [showAddTime, setShowAddTime] = useState({});
    const [isModalVisible, setModalVisible] = useState(false);
    const [activeSlabs, setActiveSlabs] = useState({}); 
    const [newActiveSlabs, setNewActiveSlabs] = useState({})
    const audioRef = useRef(null);
    const showModal = () => {
        setModalVisible(true);
      };
    
      const hideModal = () => {
        setModalVisible(false);
      };
    
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
                        status: order.status?.name || 'New',
                        timer: 0,
                        initialTimer: 0,
                        isPaused: false,
                        // Flatten the items array
                        // items: order?.order_summary?.flatMap(summary => summary.item) ?? [],

                        items : order?.order_summary?.flatMap(summary => 
                            summary.item.map(item => ({ ...item, qty: summary.qty }))
                          ) ?? [],
                          
                          
                        payment: order.payment_mode,
                        payment_status: order.payment_status === 1 ? 'Paid' : "Unpaid",
                        request: '', 
                    }));
                    console.log(fetchedOrders);
                    setOrders(fetchedOrders);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setOrders([]);
            }
        };
        getOrders();
    }, []);
    
    
    useEffect(() => {
        document.title = "ZeroCarbs | Orders"

        const interval = setInterval(() => {
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.timer > 0 && order.status === "Preparing" && !order.isPaused) {
                    return { ...order, timer: order.timer - 1 };
                }
                return order;
            }));
        }, 1000);
        return () => clearInterval(interval);

    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleIncrement = (id) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === id) {
                const newTimer = order.timer + 60;
                return { ...order, timer: newTimer, initialTimer: order.initialTimer + 60 };
            }
            return order;
        }));
    };

    const handleDecrement = (id) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === id && order.timer > 60) {
                const newTimer = order.timer - 60;
                return { ...order, timer: newTimer, initialTimer: order.initialTimer - 60 };
            }
            return order;
        }));
    };



    const handleNewOrderSlabSelect = (id, slabDurationInMinutes) => {
        const slabDurationInSeconds = slabDurationInMinutes * 60; // Convert the slab duration to seconds
        setNewActiveSlabs(prev => ({
            ...prev,
            [id]: slabDurationInMinutes // Store the active slab value for the order
        }))
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === id) {
                const newTimer =  slabDurationInSeconds;
                return { ...order, timer: newTimer, initialTimer: order.initialTimer + 60 };
            }
            return order;
        }));
    };
    const handleAddTime = (id, timeInMinutes) => {
        // Set the clicked slab as active
        setActiveSlabs(prev => ({
            ...prev,
            [id]: timeInMinutes // Store the active slab value for the order
        }));
    
        // Update the additional time for the order
        setAdditionalTime(prev => ({
            [id]: 60 * timeInMinutes, // Set only the new time in seconds
        }));
        console.log(activeSlabs)
    }

    const handleAdditionalIncrement = (id) => {
        setAdditionalTime(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 60
        }));
    };

    const handleAdditionalDecrement = (id) => {
        setAdditionalTime(prev => ({
            ...prev,
            [id]: prev[id] > 0 ? prev[id] - 60 : 0
        }));
    };

    const handleConfirm = async(id) => {
      const response =  await updateOrder({
        "order_status": 2
    }, id)
        setOrders(prevOrders => {
            const newOrders = prevOrders.map(order => {
                if (order.id === id) {
                    return { ...order, status: "Preparing", isPaused: false };
                }
                return order;
            });
            const newTabOrders = newOrders.filter(order => order.status === 'New');
            if (newTabOrders.length === 0) {
                setActiveTab('Preparing');
            }
            return newOrders;
        });
    };

    const handlePickup = async(id) => {
        const response =  await updateOrder({
            "order_status": 4
        }, id)
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === id) {
                return { ...order, status: "Picked Up" };
            }
            return order;
        }));
        setActiveTab('Picked Up');
    };

    const handleReady = async(id) => {
        console.log(id)
        const response = await updateOrder({
            "order_status": 3
        }, id);
        console.log(response)

        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === id) {
                return { ...order, status: "Ready" };
            }
            return order;
        }));
        setActiveTab('Ready');
    };

    const handleOk = (id) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === id) {
                const newTimer = order.timer + (additionalTime[id] || 0);
                return { ...order, timer: newTimer, initialTimer: order.initialTimer + (additionalTime[id] || 0), isPaused: false };
            }
            return order;
        }));
        setAdditionalTime(prev => ({ ...prev, [id]: 0 }));
        setShowAddTime(prev => ({ ...prev, [id]: false }));
    };

    const handleNeedMoreTime = (id) => {
        setShowAddTime(prev => ({ ...prev, [id]: true }));
    };

    const filteredOrders = orders.filter(order => order.status === activeTab);



   
    const playRingtone = () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      };
    
      const stopRingtone = () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // Reset to start
        }
      };
    
      useEffect(() => {
        // Play ringtone when isModal is set to true
        if (isModalVisible) {
          playRingtone();
        } else {
          stopRingtone(); // Stop ringtone if modal is closed
        }
      }, [isModalVisible]);
    
    
    



    return (
        <>
       

{/* Conditionally render the OrderModal */}
{isModalVisible && <OrderModal closeModal={hideModal} />}
<div className="body-content">
<audio ref={audioRef} src="/ringtone.mp3" />
            <div className="card border-0 p-3">
                <h3 className="mb-0">New Orders</h3>
                <button onClick={showModal}>Show Order Modal</button>
            </div>
            <div className="border-0">
                <div className="card-body">
                    <div className="order-tabs">
                        <Button className={activeTab === 'New' ? 'active' : ''} onClick={() => handleTabClick('New')}>
                            New <span>({orders.filter(order => order.status === 'New').length})</span>
                        </Button>
                        <Button className={activeTab === 'Preparing' ? 'active' : ''} onClick={() => handleTabClick('Preparing')}>
                            Preparing <span>({orders.filter(order => order.status === 'Preparing').length})</span>
                        </Button>
                        <Button className={activeTab === 'Ready' ? 'active' : ''} onClick={() => handleTabClick('Ready')}>
                            Ready <span>({orders.filter(order => order.status === 'Ready').length})</span>
                        </Button>
                        <Button className={activeTab === 'Picked Up' ? 'active' : ''} onClick={() => handleTabClick('Picked Up')}>
                            Picked Up <span>({orders.filter(order => order.status === 'Picked Up').length})</span>
                        </Button>
                    </div>
                    <ul className="order-details">
                        {filteredOrders.map((order) => (
                            <li key={order.id} className='order-details-body'>
                                <div className="leftBox">
                                    <h4>ID : <span>{order.id}</span></h4>
                                    <h5>Name : {order.name}</h5>
                                    <p>Call : {order.phone}</p>
                                    <p>Email : {order.address}</p>
                                </div>
                                <div className="rightBox">
                                  
                                    {order?.items.map((item, index) => (
                                        <div className='d-flex flex-column'>
                                             
                                        <div key={index} className="order-info">
                                           
                                            <div className="item-info">
                                           
                                                <div className="item-box">
                                                
                                                   
                                                <div className="type-image">
                                    <img src={item.type === 'veg' ? vegImage : nonVegImage}
                                        alt={item.type === 'veg' ? 'Veg' : 'Non-Veg'} />
                                </div>      <p>{item?.qty} x <span>{item.name}</span></p>
                                        
                                                </div>
                                            </div>
                                            <p className='price'>₹&nbsp;{parseInt(item.price).toFixed(2)}</p>
                                        </div>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="additional-info">
                                        <PiBowlSteamFill size={20} />
                                        <p>Order Instructions: <span>{order.request}</span></p>
                                    </div>
                                    <hr />
                                    <div className="bill-details">
                                        <div className="bill-detail">
                                            <p>Total Bill</p>
                                            <span>{order.payment_status}</span>
                                        </div>
                                        <p className='price'>
    ₹&nbsp;{order?.items.reduce((total, item) => total + parseFloat(item?.price || 0), 0).toFixed(2)}
</p>
                                    </div>
                                    {order.status === 'New' && (

                                        <>
                                         <div className="d-flex gap-2 w-100">
                                                <Button className='w-100' onClick={() => handleDecrement(order.id)}><FaMinus /></Button>
                                                <span>{formatTime(order.timer)}</span>
                                                <Button className='w-100' onClick={() => handleIncrement(order.id)}><FaPlus /></Button>
                                            </div>
                                            <Button className='btn bg-primary w-100 text-white mt-2' onClick={() => handleConfirm(order.id)}>Confirm</Button>
                                        <div className="timer-button">
                                            
                                           

{/* <div className="time-slabs">
            <div  className={`slab  ${newActiveSlabs[order.id] === 5 ? 'active' : ''}`}  onClick={() => handleNewOrderSlabSelect(order.id, 5)}>+5 min</div>
            <div  className={`slab ${newActiveSlabs[order.id] === 10 ? 'active' : ''}`}  onClick={() => handleNewOrderSlabSelect(order.id, 10)}>+10 min</div>
            <div  className={`slab ${newActiveSlabs[order.id] === 15 ? 'active' : ''}`}  onClick={() => handleNewOrderSlabSelect(order.id, 15)}>+15 min</div>
            <div   className={`slab ${newActiveSlabs[order.id] === 20 ? 'active' : ''}`} onClick={() => handleNewOrderSlabSelect(order.id, 20)}>+20 min</div>
            <Button className='confirm-btn' onClick={() => handleConfirm(order.id)}>Confirm</Button>
          </div>  */}
                                           
                                        </div>
</>
                                    )}
                                 {order.status === 'Preparing' && (
                                        <div>
                                            <div  className={`progress-text progress-bar-container ${order.timer === 0 ? 'blinking-background' : 'progress-bar-container'}`} >
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${((order.initialTimer - order.timer) / order.initialTimer) * 100}%`,
                                                        transition: 'width 1s linear',
                                                    }}
                                                />
                                       <p 
                                                    className="progress-text" 
                                                    onClick={() => handleReady(order.id)} 
                                                    // style={{ cursor: order.timer === 0 ? 'pointer' : 'default' }}
                                                    >
                                                {order.timer === 0 ? `Mark as Ready` : `Preparing Order (${formatTime(order.timer)})`}
                                                    </p>
                                                {/* <p className="progress-text">{order.timer === 0 ? `Mark as Ready ` : ` Preparing Order (${formatTime(order.timer)})`}</p> */}
                                            </div>
                                        



{order.timer === 0 && !showAddTime[order.id] && (
      <div className="more-time-btn">
        <div className="add-time-btn">
          {/* Predefined time slots (5, 10, 15, 20 minutes) */}
          <div className="time-slabs">
            <div  className={`slab  ${activeSlabs[order.id] === 5 ? 'active' : ''}`}  onClick={() => handleAddTime(order.id, 5)}>+5 min</div>
            <div  className={`slab ${activeSlabs[order.id] === 10 ? 'active' : ''}`}  onClick={() => handleAddTime(order.id, 10)}>+10 min</div>
            <div  className={`slab ${activeSlabs[order.id] === 15 ? 'active' : ''}`}  onClick={() => handleAddTime(order.id, 15)}>+15 min</div>
            <div   className={`slab ${activeSlabs[order.id] === 20 ? 'active' : ''}`} onClick={() => handleAddTime(order.id, 20)}>+20 min</div>
            <Button className="slab-confirm-btn " onClick={() => handleOk(order.id)}>Confirm</Button>
          </div>
        
        </div>
      </div>
 
)}

                                        </div>
                                    )}

                                    {order.status === 'Ready' && (
                                        <div className="timer-button">
                                            <Button className='preparing-btn' onClick={() => handlePickup(order.id)}>Ready for Pickup</Button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        </>
       
    );
};

export default Orders;
