// /* eslint-disable no-undef */
import axios from "axios";
import apiClient, { base_url, endpoints, token } from "../api/ApiConfig";

// Add new Coupon
export const addNewPromoCode = async (formData) => {

    const data = new FormData();
    data.append('title', formData.title);
    data.append('discount', formData.discount);
    data.append('discount_type', formData.discount_type);
    data.append('min_order_value', formData.min_order_value);
    data.append('description', formData.description);

    const response = await axios.post(`${base_url}${endpoints.addPromoCode}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
}

// Fetch PromoCode
export const getAllPromoCode = async () => {
    try {
        const response = await apiClient.get(endpoints.getPromoCode);
        return response.data;
    } catch (error) {
        console.error('Error fetching PromoCode:', error);
        throw error;
    }
}

// Fetch PromoCode by Id
export const getPromoCodeById = async (id) => {
    try {
        const response = await apiClient.get(endpoints.getCouponsById(id));
        return response.data;
    } catch (error) {
        console.error('Error fetching PrmoCode by ID:', error);
        throw error;
    }
};

// Toggle Promo Code Status
export const togglePrmoCodeStatus = async (id) => {
    try {
        const response = await apiClient.patch(endpoints.togglePromodCodeStatus(id));
        return response.data;
    } catch (error) {
        console.error('Error toggling coupon status:', error);
        throw error;
    }
};

