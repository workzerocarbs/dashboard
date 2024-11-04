// /* eslint-disable no-undef */
import axios from "axios";
import apiClient, { base_url, endpoints, token } from "../api/ApiConfig";

// Add new Coupon
export const addNewCoupon = async (formData) => {

    const data = new FormData();
    data.append('title', formData.title);
    data.append('discount', formData.discount);
    data.append('discount_type', formData.discount_type);
    data.append('min_order_value', formData.min_order_value);
    data.append('description', formData.description);

    const response = await axios.post(`${base_url}${endpoints.addCoupon}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
}

// Fetch Coupons
export const getAllCoupon = async () => {
    try {
        const response = await apiClient.get(endpoints.getCoupon);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

// Fetch Coupons by Id
export const getCouponById = async (id) => {
    try {
        const response = await apiClient.get(endpoints.getCouponsById(id));
        return response.data;
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
};

// Toggle Coupon Status
export const toggleCouponStatus = async (id) => {
    try {
        const response = await apiClient.patch(endpoints.toggleCouponStatus(id));
        return response.data;
    } catch (error) {
        console.error('Error toggling coupon status:', error);
        throw error;
    }
};

