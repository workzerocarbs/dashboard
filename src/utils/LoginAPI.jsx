/* eslint-disable no-useless-catch */
import axios from 'axios';
import { base_url, endpoints } from '../api/ApiConfig';

// Login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${base_url}${endpoints.login}`, {
      email: username,
      password: password,
    });

    // console.log( response.data.success)
    if (response.data.success && response.data.data.access_token) {
      localStorage.setItem('authToken', response.data.data.access_token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = async (token) => {
  try {
    const response = await axios.post(`${base_url}${endpoints.logout}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Logout failed. Please try again later.');
  }
}
