/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Navigate } from 'react-router-dom';

const CustomRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default CustomRoute;
