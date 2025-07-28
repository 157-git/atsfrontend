// ProtectedRoute.jsx
// created by sahil karnekar

import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // this code is updated by sahil karnekar on date 28-11-2024
  const { employeeId, userType } = useParams();
  
// Construct the storage key based on userType and employeeId
const storageKey = `user_${userType}${employeeId}`;
  
// Retrieve the stored user data from localStorage
const storedData = JSON.parse(localStorage.getItem(storageKey));

// Check if the user is authenticated by comparing the stored data with the current route params
let isAuthenticated;
if (storedData) {
  isAuthenticated =
  storedData &&
  storedData.employeeId === employeeId &&
  storedData.userType === userType;

    // console.log(isAuthenticated);
    // console.log(storedData.employeeId,employeeId);
    // console.log(storedData.userType , userType);
}


  if (!isAuthenticated) {
    return <Navigate to="/employee-login" replace />; // here the replcae attribute is used to navigate on login page only , if the user tries to back again by pressing back button of browsers top bar it wull directly throw to the login page instead of a back page which can be dashboard or anything. without replace attribute brower push the user route in browers history and he can access previous route easily but we need to prevent this and make routed secured.
  }

  return children; 
};

export default ProtectedRoute;
