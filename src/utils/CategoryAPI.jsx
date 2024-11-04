import apiClient, { endpoints } from '../api/ApiConfig';

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get(endpoints.getCategory);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Add a new category
export const addCategory = async (category) => {
  try {
    const response = await apiClient.post(endpoints.addCategory, {
      name: category
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Fetch category by ID
export const fetchCategoryById = async (id) => {
  try {
    const response = await apiClient.get(endpoints.getCategoryById(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

// Update category by ID (PUT request)
export const updateCategoryById = async (id, updatedData) => {
  try {
    const response = await apiClient.put(endpoints.updateCategory(id), updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Update category by ID (PATCH request)
export const patchCategoryById = async (id, partialData) => {
  try {
    const response = await apiClient.patch(endpoints.updateCategory(id), partialData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(endpoints.deleteCategoryById(id));
    return response.data;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}