import React, { useEffect, useState } from "react";
import axios from "axios";
import "./subscription.css";
// import AddUser from "./AddUser";
import { API_BASE_URL } from "../api/api";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
import "./subscription.css";
// import qrImage from "../src/assets/qr-image/qrimgae.jpg"

const SubscriptionPlans = () => {
  const { employeeId, userType } = useParams();
  const [plans, setPlans] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedPlanId, setExpandedPlanId] = useState(null); // State to manage expanded plan

  const togglePayment = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const toggleViewMore = (planId) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId); // Toggle expand/collapse
  };

  const [creditCard, setCreditCard] = useState("");
  const [debitCard, setDebitCard] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  // const [selectedPlan, setSelectedPlan] = useState("");
  const [planAmount, setPlanAmount] = useState(0);
  const [showThankYouPage, setShowThankYouPage] = useState(false);
  const superUserId = localStorage.getItem("superUserId");
  const navigate = useNavigate();
  const [superUserSubscriptionData, setSuperUserSubscriptionData] = useState(
    {}
  );

  useEffect(() => {
    const fetchSuperUserPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/fetch-subscriptions-details/${employeeId}/SuperUser`
        );
        if (response.data && response.data[0]) {
          setSuperUserSubscriptionData(response.data[0]);
        } else {
          console.error("Invalid response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchSuperUserPaymentStatus();
  }, [employeeId]); // Re-run if employeeId changes

  useEffect(() => {
    if (superUserSubscriptionData?.paymentStatus) {
      const paymentStatus = superUserSubscriptionData.paymentStatus === "Payment Completed";
      // updated by sahil karnekar date 2-12-2024
      localStorage.setItem(`user_${userType}${employeeId}paymentMade`, paymentStatus);
    }
  }, [superUserSubscriptionData]);

  useEffect(() => {
    // Fetch subscription plans from the backend
    axios
      .get(`${API_BASE_URL}/fetch-all-plan`)
      .then((response) => {
        setPlans(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subscription plans:", error);
      });
  }, []);
  plans.slice(0, 2);
  console.log(plans);
  const colors = ["red", "blue", "green"];

  const handleCheckAndNavigate = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to update the payment status to "Payment Completed"?'
    );

    if (isConfirmed) {
      updatePaymentStatus(employeeId);
    }
  };

  const updatePaymentStatus = async (employeeId) => {
    const requestBody = {
      superUserId: employeeId,
      paymentStatus: "Payment Completed",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/update-payment-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Payment status updated successfully!');
        // updated by sahil karnekar date 2-12-2024
        localStorage.setItem(`user_${userType}${employeeId}paymentMade`, true);
        setShowThankYouPage(true);
        setTimeout(() => {
          try {
            localStorage.removeItem(`loginTimeSaved_${employeeId}`);
            localStorage.removeItem(`loginDetailsSaved_${employeeId}`);
            localStorage.removeItem(`stopwatchTime_${employeeId}`);
            localStorage.removeItem(`dailyWorkData_${employeeId}`);
            localStorage.removeItem(`breaks_${employeeId}`);
            localStorage.removeItem(`user_${userType}${employeeId}`);

            // Construct request body based on userType
            {
              /* Arshad Attar , Added new Logout logic as As per requirement on 27-11-2024, Start Line 130 - end line 167 */
            }

            let requestBody = {};
            switch (userType) {
              case "SuperUser":
                requestBody = { superUserId: employeeId };
                break;
              case "Manager":
                requestBody = { managerId: employeeId };
                break;
              case "TeamLeader":
                requestBody = { teamLeaderId: employeeId };
                break;
              case "Recruiters":
                requestBody = { employeeId: employeeId };
                break;
              default:
                console.error("Invalid user type");
                return;
            }

            // Make API call
            const response = axios.post(
              `${API_BASE_URL}/user-logout-157/${userType}`,
              requestBody
            );

            console.log("API Response:", response.data);
            console.log(
              "Logout Successfully And Status Updated Successfully.."
            );

            navigate(`/login/${userType}`, { replace: true });
            console.log("Temp Logout Successfully");
          } catch (error) {
            console.error("Error during logout:", error);
          }
        }, 5000);
      } else {
        console.log("Failed to update payment status.");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      {showThankYouPage ? (
        <div className="thankyoupagealigncenterdiv">
          <div className="thank-you">
            <h1>🎉 Thank You for Your Payment! 🎉</h1>
            <p>Your payment was successfully processed.</p>
            <div className="returnlogincentdiv">
              <p className="loading-text">
                Wait For Few Seconds<span className="dots">...</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Abhijit Mehakar */}
          {/* 28/11/2024 */}
          <h1 className="subscriptiontxt">Subscription Payment</h1>
         <center> <hr style={{width:"700px"}} /></center>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
          {formError && <p className="form-errorsubs">{formError}</p>}
          <div className="perimiumdropdown">
            <form style={{ width: "43%" }}>
              <div className="creditdebit">
                <label>Credit Card</label>
                <div className="visa">
                  <i className="fa-brands fa-cc-visa"></i>
                  <div className="paypal">
                    <i className="fa-brands fa-cc-paypal"></i>
                  </div>
                  <div className="stripe">
                    <i className="fa-brands fa-cc-stripe"></i>
                  </div>
                  <input type="text" placeholder="Enter Credit Card Number" />
                </div>
              </div>
              <div className="creditdebit">
                <label>Debit/ATM Card</label>
                <div className="debit1">
                  <i className="fa-solid fa-credit-card"></i>
                  <div className="debit2">
                    <i className="fa-duotone fa-solid fa-credit-card"></i>
                  </div>
                  <div className="debit3">
                    <i className="fa-brands fa-cc-amazon-pay"></i>
                  </div>
                  <input
                    type="text"
                    className="creditinput"
                    placeholder="Enter Debit Card Number"
                  />
                </div>
              </div>
              {/* Abhijit Mehakar */}
              {/* 26/11/2024 */}
              <div className="qr-section">
                <h3>Scan the QR Code for Quick Payment</h3>
                <div className="qrcode">
                  <QRCode value="https://example.com/payment" size={150} />
                  {/* <img src={qrImage} alt="qrimage" style={{width:"200px"}}/> */}
                </div>
                <div className="gpayphonepayicon">
                  <div className="payment-icons">
                    <i className="fa-brands fa-google-pay icon"></i>
                    <i className="fa-brands fa-amazon-pay icon"></i>
                    <i className="fa-brands fa-paypal icon"></i>
                  </div>
                </div>
              </div>
            </form>
            {/* Abhijit Mehakar */}
            {/* 26/11/2024 */}
            <div className="spinnerdiv spinnerdiv12">
              <div className="maincarddiv1">
                {/* Premium Card */}
                {plans.slice(0, 3).map((plan, index) => {
                  const backgroundColor = colors[index % colors.length];
                  return (
                    <div
                      className="card premium-card"
                      style={{ borderTop: `5px solid ${backgroundColor}` }}
                    >
                      <h4 className="card-title">
                        <b>{plan.name}</b>
                      </h4>
                      <h2>{plan.price}</h2>
                      {plan.features.map((feature, index) => (
                        <p key={index} className="card-description">
                          {feature.name}{" "}
                          {feature.correct ? (
                            <span>&#10004;</span>
                          ) : (
                            <span>&#10008;</span>
                          )}
                        </p>
                      ))}

                      <h1>1 to 20 users</h1>
                      <button className="subscribe-button">Buy Now</button>
                    </div>
                  );
                })}

                {/* Gold Card */}
                {/* <div className="card gold-card">
        <h4 className="card-title"><b>RECOMENDED</b></h4>
        <h2>Rs 599</h2>
        <p className="card-description">Special perks and advantages for gold users.</p>
        <h1>1 to 20 users</h1>
        <button className="subscribe-button">Buy Now</button>
    </div> */}

                {/* Silver Card */}
                {/* <div className="card silver-card">
        <h4 className="card-title"><b>BUSINESS</b></h4>
        <h2>Rs 299</h2>
        <p className="card-description">Affordable plan with essential features.</p>
        <h1>20+ users</h1>
        <button className="subscribe-button">Buy Now</button>
    </div> */}
              </div>

              {/* Abhijit Mehakar */}
              {/* 26/11/2024 */}

              <div className="checkcheck">
                <div className="paymentmodediv1">
                  <h1 className="checkboxpayment">Payment Mode</h1>
                  <div className="containerpaymentmode">
                    <ul>
                      <li>
                        <input type="radio" id="f-option" name="selector" />
                        <label htmlFor="f-option">Online</label>
                        <div className="check" />
                      </li>
                      <li>
                        <input type="radio" id="s-option" name="selector" />
                        <label htmlFor="s-option">Card</label>
                        <div className="check">
                          <div className="inside" />
                        </div>
                      </li>
                      <li>
                        <input type="radio" id="t-option" name="selector" />
                        <label htmlFor="t-option">Cash</label>
                        <div className="check">
                          <div className="inside" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="centbutton">
            <button
              className="lineUp-Filter-btn"
              type="button"
              onClick={handleCheckAndNavigate}
            >
              Submit Payment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPlans;
