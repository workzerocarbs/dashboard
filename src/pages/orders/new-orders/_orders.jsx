/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import '../new-orders/styles.scss';
import Button from '@mui/material/Button';
import { PiBowlSteamFill } from "react-icons/pi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { initialOrders } from '../../../utils/OrderDetails';
import { fetchOrders } from '../../../utils/OrdersAPI';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('New');
    const [orders, setOrders] = useState(initialOrders);
    const [additionalTime, setAdditionalTime] = useState({});
    const [showAddTime, setShowAddTime] = useState({});

    // Fetch Orders
    useEffect(() => {
        const getOrders = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                console.log(fetchedOrders);
                setOrders(fetchedOrders)
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        getOrders();
    }, [])

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

    const handleConfirm = (id) => {
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

    const handlePickup = (id) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === id) {
                return { ...order, status: "Picked Up" };
            }
            return order;
        }));
        setActiveTab('Picked Up');
    };

    const handleReady = (id) => {
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

    return (
        <div className="body-content">
            <div className="card border-0 p-3">
                <h3 className="mb-0">New Orders</h3>
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
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-info">
                                            <div className="item-info">
                                                <div className="item-box">
                                                    <img src={item.image} alt="Item" />
                                                    <p>{item.quantity} x <span>{item.description}</span></p>
                                                </div>
                                            </div>
                                            <p className='price'>₹&nbsp;{item.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="additional-info">
                                        <PiBowlSteamFill size={20} />
                                        <p>Order Request : <span>{order.request}</span></p>
                                    </div>
                                    <hr />
                                    <div className="bill-details">
                                        <div className="bill-detail">
                                            <p>Total Bill</p>
                                            <span>{order.payment}</span>
                                        </div>
                                        <p className='price'>₹&nbsp;{order.items.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
                                    </div>
                                    {order.status === 'New' && (
                                        <div className="timer-button">
                                            <div className="add-time-btn">
                                                <Button onClick={() => handleDecrement(order.id)}><FaMinus /></Button>
                                                <span>{formatTime(order.timer)}</span>
                                                <Button onClick={() => handleIncrement(order.id)}><FaPlus /></Button>
                                            </div>
                                            <Button className='confirm-btn' onClick={() => handleConfirm(order.id)}>Confirm</Button>
                                        </div>
                                    )}
                                    {order.status === 'Preparing' && (
                                        <div>
                                            <div className="progress-bar-container">
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${((order.initialTimer - order.timer) / order.initialTimer) * 100}%`,
                                                        transition: 'width 1s linear',
                                                    }}
                                                />
                                                <p className="progress-text">{order.timer === 0 ? `Order Prepared (${formatTime(order.timer)})` : `Preparing Order (${formatTime(order.timer)})`}</p>
                                            </div>
                                            {order.timer === 0 && (
                                                <div className="need-more-time">
                                                    {!showAddTime[order.id] ? (
                                                        <div className='buttons'>
                                                            <Button className='need-time' onClick={() => handleNeedMoreTime(order.id)}>Need more time?</Button>
                                                            <Button className='ready-btn' onClick={() => handleReady(order.id)}>mark as ready</Button>
                                                        </div>
                                                    ) : (
                                                        <div className='more-time-btn'>
                                                            <h5>Need Time !!!</h5>
                                                            <div className="add-time-btn">
                                                                <div className="timer">
                                                                    <Button onClick={() => handleAdditionalDecrement(order.id)}><FaMinus /></Button>
                                                                    <span>{formatTime(additionalTime[order.id] || 0)}</span>
                                                                    <Button onClick={() => handleAdditionalIncrement(order.id)}><FaPlus /></Button>
                                                                </div>
                                                                <Button className='ok-btn' onClick={() => handleOk(order.id)}>OK</Button>
                                                            </div>
                                                        </div>
                                                    )}
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
    );
};

export default Orders;