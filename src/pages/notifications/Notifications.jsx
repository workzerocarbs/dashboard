/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../notifications/style.scss';
import { FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";
import { Button } from '@mui/material';
import { getAllNotification } from '../../utils/NotificationAPI';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        document.title = "ZeroCarbs | Notifications";
        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await getAllNotification();
               console.log(fetchedNotifications)
                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        }
        fetchNotifications()
       
    }, []);

    const handleListClick = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id && !notification.status ? { ...notification, status: true } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => 
            ({ ...notification, status: true })
        ));
    };

    return (
        <div className='body-content'>
            <div className="card border-0 p-3">
                <h3 className="mb-0">Notifications</h3>
            </div>
            <div className="border-0">
                <div className="card-body notification-body">
                    <Button onClick={markAllAsRead} className='markRead'>mark as read</Button>
                    <ul className="notifications">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <li
                                    key={notification.id}
                                    className={`notification-list ${notification.status ? 'viewed' : 'not-viewed'}`}
                                    onClick={() => handleListClick(notification.id)}>
                                    <div className="notification-content">
                                        <div className="icon">
                                            {notification.status ? <FaEnvelopeOpen /> : <FaEnvelope />}
                                        </div>
                                        <h5>
                                            {notification.message}
                                            <span>{notification.name}</span>
                                        </h5>
                                    </div>
                                    <p>{notification.date}</p>
                                </li>
                            ))
                        ) : (
                            <li className="no-notifications">No notifications</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Notifications;
