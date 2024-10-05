// ProtectedRoute.jsx
// created by sahil karnekar

import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const storedEmployeeId = localStorage.getItem("employeeId");
  const { employeeId } = useParams(); 
  const isAuthenticated = storedEmployeeId && storedEmployeeId === employeeId;

  if (!isAuthenticated) {
    return <Navigate to="/employee-login" replace />; // here the replcae attribute is used to navigate on login page only , if the user tries to back again by pressing back button of browsers top bar it wull directly throw to the login page instead of a back page which can be dashboard or anything. without replace attribute brower push the user route in browers history and he can access previous route easily but we need to prevent this and make routed secured.
  }

  return children; 
};

export default ProtectedRoute;
