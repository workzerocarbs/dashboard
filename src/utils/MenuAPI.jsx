import axios from 'axios';
import apiClient, { base_url, endpoints, token } from "../api/ApiConfig";

// Add New Menu Item
export const addItem = async (formData) => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category_id', formData.category_id);
    data.append('type', formData.type);
    if (formData.image) {
        data.append('image', formData.image);
    }
    data.append('image_external_url', formData.image_external_url);
    data.append('description', formData.description);
    data.append('price', formData.price);

    const response = await axios.post(`${base_url}${endpoints.addMenuItem}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
};

// Update Menu Item
export const updateItem = async (id, formData) => {
    try {
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('name', formData.name);
        data.append('category_id', formData.category_id);
        data.append('type', formData.type);
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('image_external_url', formData.image_external_url);
        data.append('description', formData.description);
        data.append('price', formData.price);

        const response = await axios.post(`${base_url}${endpoints.updateMenuItemById(id)}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }

}

// Delete Menu Item
export const deleteMenuItem = async (id) => {
    try {
        const response = await apiClient.delete(endpoints.deleteMenuItemById(id));
        console.log('Deleted Item', response);
        return response.data;
    } catch (err) {
        console.log('Error', err);
    }
}

// Fetch Menu
export const fetchMenuItem = async () => {
    try {
        const response = await apiClient.get(endpoints.getMenuItem);
        return response.data;
    } catch (error) {
        console.error('Error fetching menu item:', error);
        throw error;
    }
}

// Filter Item on Tab click
export const toggleTypeCategory = async (type, category_id) => {
    try {
        const response = await apiClient.get(endpoints.getMenuItemsByTypeAndCategory(type, category_id));
        console.log("response :", response.data)
        return response.data;
    } catch (error) {
        console.error("Error toggling stock status:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Fetch Menu by ID
export const fetchMenuItemById = async (id) => {
    try {
        const response = await apiClient.get(endpoints.getMenuItemById(id));
        return response.data;
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
}

// Add Nutrition Value 
export const addNutritionValue = async (payload) => {
    const response = await axios.post(`${base_url}${endpoints.addNutrition}`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
};

// Delete Nutrition Value
export const deleteNutritionValue = async (id) => {
    try {
        const response = await apiClient.delete(endpoints.deleteNutritionById(id));
        return response.data;
    } catch (error) {
        console.log('Err', error);
    }
}

// Patch Status/Toggle Change
export const toggleStockStatus = async (id, status, statusChangeTime) => {
    try {
        const response = await apiClient.patch(endpoints.toggleMenuItemStock(id), {
            status: status ? 1 : 0,
            status_change_time: statusChangeTime
        });
        console.log("response :", response.data)
        return response.data;
    } catch (error) {
        console.error("Error toggling stock status:", error.response ? error.response.data : error.message);
        throw error;
    }
};


// get alll menu data from the frontend to get addons details
export const getAllMenu = async () =>{
    try {
        const response = await apiClient.get(endpoints.getAllMenu);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}