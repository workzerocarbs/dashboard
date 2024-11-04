

import apiClient, { base_url, endpoints, token } from "../api/ApiConfig"
// Fetch Orders
export const fetchOrders = async () => {
    try {
        const response = await apiClient.get(endpoints.getOrder);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateOrder = async (data, id) => {
    const response = await apiClient.patch(`${base_url}${endpoints.updateOrderStatus(id)}`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
}


// Fetch Coupons
export const fetchCoupons = async () => {
    try {
        const response = await apiClient.get(endpoints.getOrder);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}