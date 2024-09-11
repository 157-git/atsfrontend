import React, { useState, useEffect } from "react";
import "./billing.css";

const Billing = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 121,
      client: "Dhanashree",
      month: "June",
      amount: 2000500,
      gstStatus: "Unpaid",
    },
    { id: 122, client: "Neha", month: "July", amount: 2500, gstStatus: "Paid" },
    {
      id: 123,
      client: "Mohini",
      month: "August",
      amount: 2000500,
      gstStatus: "Unpaid",
    },
    {
      id: 124,
      client: "Arbaaz",
      month: "July",
      amount: 2500500,
      gstStatus: "Paid",
    },
    {
      id: 125,
      client: "Arshad",
      month: "June",
      amount: 2000500,
      gstStatus: "Unpaid",
    },
    {
      id: 126,
      client: "Prachi",
      month: "July",
      amount: 2500500,
      gstStatus: "Paid",
    },
    {
      id: 127,
      client: "Ajhar",
      month: "July",
      amount: 2500500,
      gstStatus: "Paid",
    },
    {
      id: 128,
      client: "Bhagyashree",
      month: "July",
      amount: 2500500,
      gstStatus: "Paid",
    },
    {
      id: 129,
      client: "Swapnil",
      month: "July",
      amount: 2500500,
      gstStatus: "Paid",
    },
    {
      id: 130,
      client: "Akash",
      month: "July",
      amount: 2500500,
      gstStatus: "Paid",
    },
    // Add more invoices as needed
  ]);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [monthlyGST, setMonthlyGST] = useState({});

  const calculateGST = (amount) => (amount * 0.18).toFixed(2);

  const handleStatusChange = (id, status) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, gstStatus: status } : invoice
      )
    );
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
  };

  const filteredInvoices =
    selectedStatus === "All"
      ? invoices
      : invoices.filter((invoice) => invoice.gstStatus === selectedStatus);

  const updateMonthlyGST = () => {
    const newMonthlyGST = {};
    filteredInvoices.forEach((invoice) => {
      const gst = calculateGST(invoice.amount);
      newMonthlyGST[invoice.month] = (
        parseFloat(newMonthlyGST[invoice.month] || 0) + parseFloat(gst)
      ).toFixed(2);
    });
    setMonthlyGST(newMonthlyGST);
  };

  useEffect(() => {
    updateMonthlyGST();
  }, [invoices, selectedStatus]);

  return (
    <div className="container">
      <div className="cards">
        <div className="card-dhanu">
          <h3>Total GST Calculation by Month</h3>
          <table className="table-container">
            <thead>
              <tr>
                <th>Jan</th>
                <th>Feb</th>
                <th>Mar</th>
                <th>Apr</th>
                <th>May</th>
                <th>Jun</th>
                <th>Jul</th>
                <th>Aug</th>
                <th>Sep</th>
                <th>Oct</th>
                <th>Nov</th>
                <th>Dec</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                    className="fa-solid fa-indian-rupee-sign"
                  ></i>
                  {monthlyGST["January"] || "0.00"}
                </td>
                <td>
                  <i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>
                  {monthlyGST["February"] || "0.00"}
                </td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["March"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["April"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["May"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["June"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["July"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["August"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["September"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["October"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["November"] || "0.00"}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{monthlyGST["December"] || "0.00"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-dhanu2">
          <h3>GST Status</h3>
          <div>
            <button
              className="status-button"
              onClick={() => handleFilterChange("Paid")}
            >
              Paid
            </button>
            <button
              className="status-button"
              onClick={() => handleFilterChange("Unpaid")}
            >
              Unpaid
            </button>
            <button
              className="status-button"
              onClick={() => handleFilterChange("All")}
            >
              All
            </button>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Client Name</th>
              <th>Billing Amount</th>
              <th>GST</th> {/* Updated */}
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.client}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{invoice.amount}</td>
                <td><i
                    style={{ fontSize: "16px", marginRight: "5px" }}
                   className="fa-solid fa-indian-rupee-sign"
                  ></i>{calculateGST(invoice.amount)}</td>{" "}
                <td onClick={() => handleStatusChange(invoice.id, "Unpaid")}>
                  Unpaid
                </td>
                <td>
                  <button
                    className="view-details-button"
                    onClick={() =>
                      alert(
                        `GST for invoice ${invoice.id} is $${calculateGST(
                          invoice.amount
                        )}`
                      )
                    }
                  >
                    View GST
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
