import React, { useState } from "react";
import "./AddUser.css";
import PaymentReciept from "./PaymentReciept";
import { API_BASE_URL } from "../api/api";


const AddUser = ({ selectedPlan }) => {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    address: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [paymentForm, setPaymentForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await fetch(`${API_BASE_URL}/SaveUser`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const result = await response.json();
          console.log("Form submitted successfully:", result); // Log the entire response
          setSuccessMessage("User saved successfully!");
          if (result.id) {
            setUserId(result.id);
            handlePayNow(); // Update userId only if id exists
          } else {
            console.error("No ID returned from server");
          }
          setFormData({
            userName: "",
            firstName: "",
            lastName: "",
            address: "",
            mobileNo: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          console.error("Form submission error:", response.statusText);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handlePayNow = () => {
    setPaymentForm(true);
  };

  return (
    <div className="form-main-container">
      {!paymentForm ? (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group-main">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row-container">
            <div className="form-group-main">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-main">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group-main">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-row-container">
            <div className="form-group-main">
              <label htmlFor="mobileNo">Mobile No</label>
              <input
                type="text"
                id="mobileNo"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-main">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row-container">
            <div className="form-group-main">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group-main">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="form-group-main">
            <button type="submit">Submit</button>
          </div>
        </form>
      ) : (
        <>
          <PaymentReciept userId={userId} plan={selectedPlan} />
        </>
      )}
    </div>
  );
};

export default AddUser;
