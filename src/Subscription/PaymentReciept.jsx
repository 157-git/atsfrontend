import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { API_BASE_URL } from "../api/api";


const GST_RATE = 0.18;

const PaymentReciept = ({ userId, plan }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);

  useEffect(() => {
    if (containerRef.current) {
      const handleResize = () => {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      };

      handleResize(); // Set initial size

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleCardNumberChange = (e) => setCardNumber(e.target.value);
  const handleCardExpiryChange = (e) => setCardExpiry(e.target.value);
  const handleCardCvcChange = (e) => setCardCvc(e.target.value);
  const handleUpiIdChange = (e) => setUpiId(e.target.value);
  const handlePaypalEmailChange = (e) => setPaypalEmail(e.target.value);
  const handleBankNameChange = (e) => setBankName(e.target.value);
  const handleAccountNumberChange = (e) => setAccountNumber(e.target.value);

  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
  };

  const calculateGST = (amount) => amount * GST_RATE;
  const gstAmount = calculateGST(plan.price);
  const finalAmount = plan.price + gstAmount;

  const handleStartMembership = async () => {
    if (
      (selectedPayment === "credit-card" &&
        (!cardNumber || !cardExpiry || !cardCvc)) ||
      (selectedPayment === "upi" && !upiId) ||
      (selectedPayment === "paypal" && !paypalEmail) ||
      (selectedPayment === "net-banking" && (!bankName || !accountNumber))
    ) {
      setMessage("Please fill in all required details.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/subscribe`, null, {
        params: {
          userId,
          planId: plan.id,
        },
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  const renderPaymentDetails = () => {
    switch (selectedPayment) {
      case "credit-card":
        return (
          <div className="payment-details mt-4">
            <h4 className="text-lg font-medium mb-2">
              Enter Credit Card Details:
            </h4>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={cardExpiry}
              onChange={handleCardExpiryChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              placeholder="CVV"
              value={cardCvc}
              onChange={handleCardCvcChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      case "upi":
        return (
          <div className="payment-details mt-4">
            <h4 className="text-lg font-medium mb-2">Enter UPI ID:</h4>
            <input
              type="text"
              placeholder="UPI ID"
              value={upiId}
              onChange={handleUpiIdChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      case "paypal":
        return (
          <div className="payment-details mt-4">
            <h4 className="text-lg font-medium mb-2">Enter PayPal Email:</h4>
            <input
              type="email"
              placeholder="PayPal Email"
              value={paypalEmail}
              onChange={handlePaypalEmailChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      case "net-banking":
        return (
          <div className="payment-details mt-4">
            <h4 className="text-lg font-medium mb-2">
              Enter Net Banking Details:
            </h4>
            <input
              type="text"
              placeholder="Bank Name"
              value={bankName}
              onChange={handleBankNameChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Account Number"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="p-4 w-full border max-w-lg bg-white rounded-lg shadow-md relative"
    >
      {showConfetti && (
        <Confetti width={containerWidth} height={containerHeight} />
      )}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{plan.name}</h1>
        <span className="text-red-500 font-semibold">{plan.discount}</span>
      </div>
      <h2 className="text-xl font-semibold mb-4">Invoice</h2>
      <h3 className="font-semibold">INSTANT PAY</h3>
      <div className=" mt-2">
        <div className="w-full payment-option flex items-center mb-2">
          <input
            type="radio"
            name="payment"
            id="credit-card"
            value="credit-card"
            checked={selectedPayment === "credit-card"}
            onChange={() => handlePaymentSelection("credit-card")}
            className="mr-2"
          />
          <label
            htmlFor="credit-card"
            className="flex items-center justify-between"
          >
            Credit Card
            <img
              src="https://cart.hostinger.com/assets/payments/razorpay.card.svg"
              alt="Visa"
              className="h-full"
            />
          </label>
        </div>
        <div className="w-full payment-option flex items-center mb-2">
          <input
            type="radio"
            name="payment"
            id="upi"
            value="upi"
            checked={selectedPayment === "upi"}
            onChange={() => handlePaymentSelection("upi")}
            className="mr-2"
          />
          <label
            htmlFor="upi"
            className="w-full flex items-center justify-between"
          >
            UPI
            <img
              src="https://cart.hostinger.com/assets/payments/razorpay.upi.svg"
              alt="UPI"
              className="ml-2 h-full"
            />
          </label>
        </div>
        <div className="w-full payment-option flex items-center mb-2">
          <input
            type="radio"
            name="payment"
            id="paypal"
            value="paypal"
            checked={selectedPayment === "paypal"}
            onChange={() => handlePaymentSelection("paypal")}
            className="mr-2"
          />
          <label
            htmlFor="paypal"
            className="w-full flex items-center justify-between"
          >
            PayPal
            <img
              src="https://cart.hostinger.com/assets/payments/braintree_paypal.svg"
              alt="PayPal"
              className="ml-2 h-full"
            />
          </label>
        </div>
        <div className="w-full payment-option flex items-center mb-2">
          <input
            type="radio"
            name="payment"
            id="net-banking"
            value="net-banking"
            checked={selectedPayment === "net-banking"}
            onChange={() => handlePaymentSelection("net-banking")}
            className="mr-2"
          />
          <label
            htmlFor="net-banking"
            className="w-full flex items-center justify-between"
          >
            Net Banking
            <img
              src="https://cart.hostinger.com/assets/payments/dlocal_apm.NB.svg"
              alt="Net Banking"
              className="ml-2 h-full"
            />
          </label>
        </div>
      </div>
      {renderPaymentDetails()}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mt-4">Invoice</h3>
        <p className="mt-2">Discounted Price: {plan.price}</p>
        <p className="mt-2">GST (18%): {gstAmount.toFixed(2)}</p>
        <p className="mt-2 font-bold">Total Amount: {finalAmount.toFixed(2)}</p>
      </div>
      {message && (
        <p className="mt-4 text-lg font-medium text-red-400">{message}</p>
      )}
      <div className="form-group-main">
        <button onClick={handleStartMembership}>Start Membership</button>
      </div>
    </div>
  );
};

export default PaymentReciept;
