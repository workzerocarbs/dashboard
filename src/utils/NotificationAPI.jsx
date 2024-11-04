// /* eslint-disable no-undef */
import axios from "axios";
import apiClient, { base_url, endpoints, token } from "../api/ApiConfig";

// Change Notification Status
export const changeNotificationStatus = async (formData) => {

    const data = new FormData();
    data.append('notification_ids', formData.notification_ids);
    const response = await axios.post(`${base_url}${endpoints.changeNotificationStatus}`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
}

// Fetch Notification 
export const getAllNotification = async () => {
    try {
        const response = await apiClient.get(endpoints.getNoificationList);
        return response.data;
    } catch (error) {
        console.error('Error fetching Notification List:', error);
        throw error;
    }
}

export const getNotificationByStatus = async (type)=>{
    try{
        const response = await apiClient.get(endpoints.getNotifcationByStatus(type));
        return response.data;
    }catch(e){
        throw e;
    }
}

// Fetch Notification by Id
export const getNotificationById = async (id) => {
    try {
        const response = await apiClient.get(endpoints.getNotificationById(id));
        return response.data;
    } catch (error) {
        console.error('Error fetching Notification by ID:', error);
        throw error;
    }
};

