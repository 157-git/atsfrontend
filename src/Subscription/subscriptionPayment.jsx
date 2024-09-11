import React, { useState } from "react";
import "./subscriptionPayment.css";

function PaymentForm() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [companyDetails, setCompanyDetails] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const handlePaymentSelection = (payment) => {
    setSelectedPayment(payment);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStreetAddressChange = (event) => {
    setStreetAddress(event.target.value);
  };

  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const handleCompanyDetailsChange = (event) => {
    setCompanyDetails(event.target.checked);
  };

  const handleCouponCodeChange = (event) => {
    setCouponCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Payment details:", {
      selectedPayment,
      firstName,
      lastName,
      phoneNumber,
      country,
      state,
      city,
      streetAddress,
      zipCode,
      companyDetails,
      couponCode,
    });
  };

  return (
    <div className="Payment-container">
      <h2>Select payment</h2>

      <div className="payment-options">
        <h3>INSTANT PAY</h3>
        <div className="payment-option">
          <input
            type="radio"
            name="payment"
            id="credit-card"
            value="credit-card"
            checked={selectedPayment === "credit-card"}
            onChange={() => handlePaymentSelection("credit-card")}
          />
          <label htmlFor="credit-card">
            Credit Card
            <img
              src="https://cart.hostinger.com/assets/payments/razorpay.card.svg"
              alt="Visa"
            />
          </label>
        </div>
        <div className="payment-option">
          <input
            type="radio"
            name="payment"
            id="upi"
            value="upi"
            checked={selectedPayment === "upi"}
            onChange={() => handlePaymentSelection("upi")}
          />
          <label htmlFor="upi">
            UPI
            <img
              src="https://cart.hostinger.com/assets/payments/razorpay.upi.svg"
              alt="UPI"
            />
          </label>
        </div>
        <div className="payment-option">
          <input
            type="radio"
            name="payment"
            id="paypal"
            value="paypal"
            checked={selectedPayment === "paypal"}
            onChange={() => handlePaymentSelection("paypal")}
          />
          <label htmlFor="paypal">
            PayPal
            <img
              src="https://cart.hostinger.com/assets/payments/braintree_paypal.svg"
              alt="PayPal"
            />
          </label>
        </div>
        <div className="payment-option">
          <input
            type="radio"
            name="payment"
            id="google-pay"
            value="google-pay"
            checked={selectedPayment === "google-pay"}
            onChange={() => handlePaymentSelection("google-pay")}
          />
          <label htmlFor="google-pay">
            Google Pay
            <img
              src="https://cart.hostinger.com/assets/payments/checkout.googlepay.svg"
              alt="Google Pay"
            />
          </label>
        </div>
        <div className="payment-option">
          <input
            type="radio"
            name="payment"
            id="paytm"
            value="paytm"
            checked={selectedPayment === "paytm"}
            onChange={() => handlePaymentSelection("paytm")}
          />
          <label htmlFor="paytm">
            PayTM
            <img
              src="https://cart.hostinger.com/assets/payments/dlocal_apm.PW.svg"
              alt="PayTM"
            />
          </label>
        </div>
        <div className="payment-option">
          <input
            type="radio"
            name="payment"
            id="net-banking"
            value="net-banking"
            checked={selectedPayment === "net-banking"}
            onChange={() => handlePaymentSelection("net-banking")}
          />
          <label htmlFor="net-banking">
            Net Banking
            <img
              src="https://cart.hostinger.com/assets/payments/dlocal_apm.NB.svg"
              alt="Net Banking"
            />
          </label>
        </div>
        <div className="payment-option">
          <input
            type="radio"
            name="payment"
            id="coingate"
            value="coingate"
            checked={selectedPayment === "coingate"}
            onChange={() => handlePaymentSelection("coingate")}
          />
          <label htmlFor="coingate">
            Coingate
            <img src="https://coingate.com/favicon.ico" alt="Coingate" />
          </label>
        </div>
      </div>

      <div className="order-details">
        <h3>Premium Web Hosting - 48 Months Plan</h3>
        <ul>
          <li>
            <i className="fa fa-check-circle"></i> 3 Extra Months
          </li>
          <li>
            <i className="fa fa-check-circle"></i> Domain Name
          </li>
          <li>
            <i className="fa fa-check-circle"></i> Domain WHOIS Privacy
            Protection
          </li>
        </ul>

        <div className="billing-information">
          <label htmlFor="first-name">First name</label>
          <input
            type="text"
            id="first-name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <label htmlFor="last-name">Last name</label>
          <input
            type="text"
            id="last-name"
            value={lastName}
            onChange={handleLastNameChange}
          />
          <label htmlFor="phone-number">Phone Number (optional)</label>
          <input
            type="tel"
            id="phone-number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <label htmlFor="country">Country of residence</label>
          <select id="country" value={country} onChange={handleCountryChange}>
            <option value="India">India</option>
            {/* Add other countries here */}
          </select>
          <label htmlFor="state">State</label>
          <select id="state" value={state} onChange={handleStateChange}>
            {/* Add states here */}
          </select>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={handleCityChange}
          />
          <label htmlFor="street-address">Street Address</label>
          <input
            type="text"
            id="street-address"
            value={streetAddress}
            onChange={handleStreetAddressChange}
          />
          <label htmlFor="zip-code">ZIP code</label>
          <input
            type="text"
            id="zip-code"
            value={zipCode}
            onChange={handleZipCodeChange}
          />
          <div className="checkbox">
            <input
              type="checkbox"
              id="company-details"
              checked={companyDetails}
              onChange={handleCompanyDetailsChange}
            />
            <label htmlFor="company-details">
              Add company details (Optional)
            </label>
          </div>
        </div>

        <div className="order-summary">
          <div className="item">
            <span>Plan Discount - 78%</span>
            <span>-₹22,560.00</span>
          </div>
          <div className="item">
            <span>Taxes & Fees</span>
            <span>₹1,114.56</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>₹7,306.56</span>
          </div>
        </div>

        <label htmlFor="coupon-code">Have a coupon code?</label>
        <input
          type="text"
          id="coupon-code"
          value={couponCode}
          onChange={handleCouponCodeChange}
        />

        <button type="submit" onClick={handleSubmit}>
          Submit Secure Payment
        </button>
      </div>

      <div className="guarantee">
        <i className="fa fa-info-circle"></i> 30-Day Money-Back Guarantee
        <i className="fa fa-lock"></i> Encrypted and Secure Payments
      </div>

      <p className="terms">
        By checking out you agree with our <a href="#">Terms of Service</a> and
        confirm that you have read our <a href="#">Privacy Policy</a>. You can
        cancel recurring payments at any time.
      </p>
    </div>
  );
}

export default PaymentForm;
