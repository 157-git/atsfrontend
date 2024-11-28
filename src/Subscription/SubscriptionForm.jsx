import React, { useState } from "react";

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    planType: "",
    startDate: "",
    endDate: "",
    paymentMode: "",
    paymentStatus: "",
    remainingDays: "",
    months: "",
    planAmount: "",
    jobRole: "",
    superUser:{
    superUserId: "",
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Here, you can send the formData to your API using axios or fetch.
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Subscription Form</h2>
      <div>
        <label>Plan Type:</label>
        <input
          type="text"
          name="planType"
          value={formData.planType}
          onChange={handleChange}
          placeholder="Enter plan type (e.g., Premium)"
          required
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Payment Mode:</label>
        <input
          type="text"
          name="paymentMode"
          value={formData.paymentMode}
          onChange={handleChange}
          placeholder="Enter payment mode (e.g., Credit Card)"
          required
        />
      </div>
      <div>
        <label>Payment Status:</label>
        <input
          type="text"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
          placeholder="Enter payment status (e.g., Payment Completed)"
          required
        />
      </div>
      <div>
        <label>Remaining Days:</label>
        <input
          type="number"
          name="remainingDays"
          value={formData.remainingDays}
          onChange={handleChange}
          placeholder="Enter remaining days"
          required
        />
      </div>
      <div>
        <label>Months:</label>
        <input
          type="number"
          name="months"
          value={formData.months}
          onChange={handleChange}
          placeholder="Enter total months"
          required
        />
      </div>
      <div>
        <label>Plan Amount:</label>
        <input
          type="number"
          step="0.01"
          name="planAmount"
          value={formData.planAmount}
          onChange={handleChange}
          placeholder="Enter plan amount"
          required
        />
      </div>
      <div>
        <label>Job Role:</label>
        <input
          type="text"
          name="jobRole"
          value={formData.jobRole}
          onChange={handleChange}
          placeholder="Enter job role (e.g., SuperUser)"
          required
        />
      </div>
      <div>
        <label>Super User ID:</label>
        <input
          type="number"
          name="superUserId"
          value={formData.superUserId}
          onChange={handleChange}
          placeholder="Enter super user ID"
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SubscriptionForm;
