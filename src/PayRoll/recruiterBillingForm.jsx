/* Mohini_15/07/2024_RecruiterBillingForm_Whole_page */

import React, { useState } from "react";
import "./recruiterBillingForm.css";

const RecruiterBillingForm = ({ employees }) => {
  const [formData, setFormData] = useState({
    date: "",
    accountNumber: "",
    branchName: "",
    ifcCode: "",
    empId: "",
    jobRole: "",
    totalWorkingDays: "",
    presentDays: "",
    unpaidLeaves: "",
    lateMark: "",
    incentive: "",
    salary: "",
    providentFund: "",
    professionalCharges: "",
    emptyField: "",
    totalSalary: "",
  });

  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Handle form submission, e.g., send data to an API
  };

  const handlePayClick = () => {
    if (paymentStatus === "unpaid") {
      setShowPaymentModal(true);
    } else {
      setPaymentStatus("unpaid");
    }
  };

  const handlePaymentSubmit = () => {
    setPaymentStatus("paid");
    setShowPaymentModal(false);
    console.log("Selected Payment Method:", paymentMethod);
    // Handle payment method submission
  };

  return (
    <div className="recruiterBilling-container">
      <h1 className="recruiterBilling-heading">Recruiter Billing Form</h1>
      <form className="recruiterBilling-headingForm" onSubmit={handleSubmit}>
        <div className="field-Row-Gray">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              className="form-group-date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Account No</label>
            <input
              type="text"
              name="ifcCode"
              value={formData.ifcCode}
              onChange={handleChange}
              placeholder="Enter Account Number"
            />
          </div>
        </div>
        <div className="field-Row-white">
          <div className="form-group">
            <label>IFC Code</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter IFC Code"
            />
          </div>
          <div className="form-group">
            <label>Branch Name</label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              placeholder="Enter Branch Name"
            />
          </div>
        </div>
        <div className="field-Row-Gray">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              placeholder="Enter Employee Id"
            />
          </div>
          <div className="form-group">
            <label>Job Role</label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              placeholder="Enter Job Role"
            />
          </div>
        </div>
        <div className="field-Row-white">
          <div className="form-group">
            <label>Total Working Days</label>
            <input
              type="text"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              placeholder="Total Working Days"
            />
          </div>
          <div className="form-group">
            <label>Present Days</label>
            <input
              type="text"
              name="totalWorkingDays"
              value={formData.totalWorkingDays}
              onChange={handleChange}
              placeholder="Enter Present Days"
            />
          </div>
        </div>
        <div className="field-Row-Gray">
          <div className="form-group">
            <label>Unpaid Leaves</label>
            <input
              type="text"
              name="presentDays"
              value={formData.presentDays}
              onChange={handleChange}
              placeholder="Enter Unpaid Leaves"
            />
          </div>
          <div className="form-group">
            <label>Late Mark</label>
            <input
              type="text"
              name="unpaidLeaves"
              value={formData.unpaidLeaves}
              onChange={handleChange}
              placeholder="Enter Late Mark"
            />
          </div>
        </div>
        <div className="field-Row-white">
          <div className="form-group">
            <label>Incentive</label>
            <input
              type="text"
              name="lateMark"
              value={formData.lateMark}
              onChange={handleChange}
              placeholder="Enter Incentive"
            />
          </div>
          <div className="form-group">
            <label>Tax</label>
            <input
              type="text"
              name="incentive"
              value={formData.incentive}
              onChange={handleChange}
              placeholder="Enter Tax"
            />
          </div>
        </div>
        <div className="field-Row-Gray">
          <div className="form-group">
            <label>Professional Charges</label>
            <input
              type="text"
              name="professionalCharges"
              value={formData.professionalCharges}
              onChange={handleChange}
              placeholder="Enter Professional Charges"
            />
          </div>

          <div className="form-group">
            <label>Provident Fund</label>
            <input
              type="text"
              name="providentFund"
              value={formData.providentFund}
              onChange={handleChange}
              placeholder="Enter Provident Fund"
            />
          </div>
        </div>
        <div className="field-Row-white">
          <div className="form-group">
            <label>Total Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter Total Salary"
            />
          </div>
          <div className="form-group">
            <label>Empty Field</label>
            <input
              type="text"
              name="emptyField"
              value={formData.emptyField}
              onChange={handleChange}
              placeholder="Enter Empty Feild"
            />
          </div>
        </div>

        <div className="buttonDiv">
          <button className="ctf-btn" type="button" onClick={handlePayClick}>
            {paymentStatus === "paid" ? "Paid" : "Pay"}
          </button>
          {/* <button className="cancelButton" type="button" >
            Cancel
          </button> */}
        </div>
      </form>

      {showPaymentModal && (
        <div className="modal">
          <div className="recruiter-modal-content">
            <div className="modal-header">
              <h2 className="modal-header">Payment Method</h2>
              <button
                className="close"
                onClick={() => setShowPaymentModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="recruiter-modal-body">
              <div>
                <input
                  type="radio"
                  id="googlePay"
                  name="paymentMethod"
                  value="Google Pay"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="googlePay">Google Pay</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="phonePe"
                  name="paymentMethod"
                  value="PhonePe"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="phonePe">PhonePe</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="nft"
                  name="paymentMethod"
                  value="NFT"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="nft">NFT</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="bankTransfer"
                  name="paymentMethod"
                  value="Bank Transfer"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="bankTransfer">Bank Transfer</label>
              </div>
            </div>
            <div className="buttonDiv">
              <button className="ctf-btn" onClick={handlePaymentSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterBillingForm;
