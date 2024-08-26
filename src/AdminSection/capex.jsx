// Ajhar Tamboli - AdminSection/capex.jsx 16-07-2-24 LineNo 1 to 597 
// Ajhar Tamboli - AdminSection/capex.jsx 18-07-2-24 LineNo 1 to 691 

import React, { useState } from "react";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import "../AdminSection/capex.css";

function App() {
  const [showForm, setShowForm] = useState("");

  const [formData, setFormData] = useState({
    opratingUnit: "",
    equipment: "",
    wifi: "",
    lightbill: "",
    salesTax: "",
    officerent: "",
    maintenance: "",
    select: "",
    count: "",
    salary: "",
    startDate: "",
    endDate: "",
  });

  const [opexformData, setOpexFormData] = useState({
    furniture: "",
    equipment: "",
    wifiopex: "",
    fridge: "",
    salesTax: "",
    officecost: "",
    maintenance: "",
    select: "",
    count: "",
    salary: "",
    startDate: "",
    endDate: "",
  });
  const [reportData, setReportData] = useState(null);
  const [opexreportData, setOpexReportData] = useState(null);
  const [billreportData, setbillReportData] = useState(null);

  const handleButtonClick = (formType) => {
    setShowForm(formType);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReportClick = (e) => {
    e.preventDefault();
    const total = Object.values(formData).reduce((acc, val) => {
      const number = parseFloat(val) || 0;
      return acc + number;
    }, 0);
    setReportData({
      ...formData,
      total,
    });
  };

  const handleCloseReportClick = () => {
    setReportData(null);
  };

  const handleOpexInputChange = (e) => {
    const { name, value } = e.target;
    setOpexFormData({
      ...opexformData,
      [name]: value,
    });
  };
  const handleOpexReportClick = (e) => {
    e.preventDefault();
    const total = Object.values(opexformData).reduce((acc, val) => {
      const number = parseFloat(val) || 0;
      return acc + number;
    }, 0);
    setOpexReportData({
      ...opexformData,
      total,
    });
  };

  const handleCloseOpexReportClick = () => {
    setOpexReportData(null);
  };

  const handleCloseBillReportClick = () => {
    setbillReportData(null);
  };

  const handlePrintClick = () => {
    const doc = new jsPDF();

    doc.text(`Operating Unit: ${reportData.opratingUnit}`, 10, 10);
    doc.text(`Equipment: ${reportData.equipment}`, 10, 20);
    doc.text(`WiFi Recharge: ${reportData.wifi}`, 10, 30);
    doc.text(`Light Bill: ${reportData.lightbill}`, 10, 40);
    doc.text(`Sales Tax: ${reportData.salesTax}`, 10, 50);
    doc.text(`Office Rent: ${reportData.officerent}`, 10, 60);
    doc.text(`Select: ${reportData.select}`, 10, 70);
    doc.text(`Count: ${reportData.count}`, 10, 80);
    doc.text(`Salary: ${reportData.salary}`, 10, 90);
    doc.text(`Maintenance: ${reportData.maintenance}`, 10, 100);
    doc.text(`Start Date: ${reportData.startDate}`, 10, 110);
    doc.text(`End Date: ${reportData.endDate}`, 10, 120);
    doc.text(`Total: ${reportData.total}`, 10, 130);
    doc.save("Capex Report.pdf");
  };

  const handleOpexPrintClick = () => {
    const doc = new jsPDF();

    doc.text(`Operating Unit: ${opexreportData.furniture}`, 10, 10);
    doc.text(`Equipment: ${opexreportData.equipment}`, 10, 20);
    doc.text(`WiFi Recharge: ${opexreportData.wifiopex}`, 10, 30);
    doc.text(`Light Bill: ${opexreportData.fridge}`, 10, 40);
    doc.text(`Sales Tax: ${opexreportData.salesTax}`, 10, 50);
    doc.text(`Office Rent: ${opexreportData.officecost}`, 10, 60);
    doc.text(`Select: ${opexreportData.select}`, 10, 70);
    doc.text(`Count: ${opexreportData.count}`, 10, 80);
    doc.text(`Salary: ${opexreportData.salary}`, 10, 90);
    doc.text(`Maintenance: ${opexreportData.maintenance}`, 10, 100);
    doc.text(`Start Date: ${opexreportData.startDate}`, 10, 110);
    doc.text(`End Date: ${opexreportData.endDate}`, 10, 120);
    doc.text(`Total: ${opexreportData.total}`, 10, 130);
    doc.save("Opex Report.pdf");
  };


  const billData = {
    clientName: "157 Industries",
    clientAddress: "157 Careers Private Limited 2th Floor,Ace Nest Building,703, Taboot St, Camp,Pune, Maharashtra-411001",
    contactNo: "Contact: 9876543210",
    date: "Date: 17-06-2024",
    items: [
      { name: "1", description: "Operating Unit:", gst: 4, price: 50 },
      { name: "2", description: "Equipment:", gst: 5, price: 50 },
      { name: "3", description: "WiFi Recharge:", gst: 3, price: 50 },
      { name: "4", description: "Light Bill:", gst: 4, price: 50 },
      { name: "5", description: "Sales Tax:", gst: 8, price: 100 },
      { name: "6", description: "Office Rent:", gst: 10, price: 100 },
      { name: "7", description: "Select:", gst: 11, price: 100 },
      { name: "8", description: "Count:", gst: 12, price: 100 },
      { name: "9", description: "Salary:", gst: 6, price: 75 },
      { name: "10", description: "Maintenance:", gst: 4, price: 75 },
    ],
  };
const totalWithoutGST = billData.items.reduce((total, item) => total + item.price, 0);
const totalWithGST = billData.items.reduce((total, item) => total + item.price + item.gst, 0);



  return (
    <div className="App">
      {/* <div className='capex-main-heading'>
         <h1>Capex</h1>
         </div>
       */}
      <div className="capex-button-container">
        <button
          className="capex-my-button"
          onClick={() => handleButtonClick("capex")}
        >
          Capex
        </button>
        <button
          className="capex-my-button"
          onClick={() => handleButtonClick("opex")}
        >
          Opex
        </button>

        <button className="capex-my-button"
        onClick={() => handleButtonClick("billing")}
        >
          Billing
          </button>
      </div>

      {showForm === "capex" && (
        <div className="capex-form-container">
          <div className="capex-form">
            <div className="capexForm-heading">
              <h2>Capex Form</h2>
            </div>
            <div className="capex-from-div">
              <form>
                <div className="capex-row-gray">
                  <div className="capex-form-group">
                    <label htmlFor="opratingUnit">Operating Unit:</label>
                    <input
                      type="text"
                      id="opratingUnit"
                      name="opratingUnit"
                      value={formData.opratingUnit}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="equipment">Equipment:</label>
                    <input
                      type="text"
                      id="equipment"
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-white">
                  <div className="capex-form-group">
                    <label htmlFor="wifi">WiFi Recharge:</label>
                    <input
                      type="text"
                      id="wifi"
                      name="wifi"
                      value={formData.wifi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="lightbill">Light Bill:</label>
                    <input
                      type="text"
                      id="lightbill"
                      name="lightbill"
                      value={formData.lightbill}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-gray">
                  <div className="capex-form-group">
                    <label htmlFor="salesTax">Sales Tax:</label>
                    <input
                      type="text"
                      id="salesTax"
                      name="salesTax"
                      value={formData.salesTax}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="officerent">Office Rent:</label>
                    <input
                      type="text"
                      id="officerent"
                      name="officerent"
                      value={formData.officerent}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="capex-row-white">
                  <div className="capex-form-group">
                    <label htmlFor="select">Select:</label>
                    <select
                      id="select"
                      name="select"
                      value={formData.select}
                      onChange={handleInputChange}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="TL">TL</option>
                      <option value="Recruiters">Recruiters</option>
                    </select>
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="count">Count:</label>
                    <input
                      type="text"
                      id="count"
                      name="count"
                      value={formData.count}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-gray">
                  <div className="capex-form-group">
                    <label htmlFor="salary">Salary:</label>
                    <input
                      type="text"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="maintenance">Maintenance:</label>
                    <input
                      type="text"
                      id="maintenance"
                      name="maintenance"
                      value={formData.maintenance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-white">
                  <div className="capex-form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="copex-sub-btn">
              <button type="submit">Save</button>
              <button type="button" onClick={handleReportClick}>
                Report
              </button>
            </div>
          </div>

          {reportData && (
            <div>
              <div className="report-heading-report">
                <h2>Capex Report</h2>
              </div>
              <div className="capex-report">
                <p>
                  <strong>Operating Unit:</strong> {reportData.opratingUnit}
                </p>
                <p>
                  <strong>Equipment:</strong> {reportData.equipment}
                </p>
                <p>
                  <strong>WiFi Recharge:</strong> {reportData.wifi}
                </p>
                <p>
                  <strong>Light Bill:</strong> {reportData.lightbill}
                </p>
                <p>
                  <strong>Sales Tax:</strong> {reportData.salesTax}
                </p>
                <p>
                  <strong>Office Rent:</strong> {reportData.officerent}
                </p>
                <p>
                  <strong>Select:</strong> {reportData.select}
                </p>
                <p>
                  <strong>Count:</strong> {reportData.count}
                </p>
                <p>
                  <strong>Salary:</strong>
                  {reportData.salary}
                </p>
                <p>
                  <strong>Maintenance:</strong> {reportData.maintenance}
                </p>
                <p>
                  <strong>Start Date:</strong> {reportData.startDate}
                </p>
                <p>
                  <strong>End Date:</strong> {reportData.endDate}
                </p>
                <p>
                  <strong>Total:</strong> {reportData.total}
                </p>
              </div>
              <div className="capex-report-buttons">
                <button type="button" onClick={handlePrintClick}>
                  Print
                </button>
                <button type="button" onClick={handleCloseReportClick}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}


      {showForm === "opex" && (
                <div className="opex-form-container">
        <div className="opex-form">
          <div className="opexForm-heading">
            <h2>Opex Form</h2>
          </div>
          <div className="capex-from-div">
              <form>
                <div className="capex-row-gray">
                  <div className="capex-form-group">
                    <label htmlFor="furniture">Furniture:</label>
                    <input
                      type="text"
                      id="furniture"
                      name="furniture"
                      value={opexformData.furniture}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="equipment">Equipment:</label>
                    <input
                      type="text"
                      id="equipment"
                      name="equipment"
                      value={opexformData.equipment}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-white">
                  <div className="capex-form-group">
                    <label htmlFor="wifiopex">WiFi:</label>
                    <input
                      type="text"
                      id="wifiopex"
                      name="wifiopex"
                      value={opexformData.wifiopex}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="fridge">Fridge:</label>
                    <input
                      type="text"
                      id="fridge"
                      name="fridge"
                      value={opexformData.fridge}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-gray">
                  <div className="capex-form-group">
                    <label htmlFor="salesTax">Sales Tax:</label>
                    <input
                      type="text"
                      id="salesTax"
                      name="salesTax"
                      value={opexformData.salesTax}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="officecost">Office Cost:</label>
                    <input
                      type="text"
                      id="officecost"
                      name="officecost"
                      value={opexformData.officecost}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                </div>
                <div className="capex-row-white">
                  <div className="capex-form-group">
                    <label htmlFor="select">Select:</label>
                    <select
                      id="select"
                      name="select"
                      value={opexformData.select}
                      onChange={handleOpexInputChange}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="TL">TL</option>
                      <option value="Recruiters">Recruiters</option>
                    </select>
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="count">Count:</label>
                    <input
                      type="text"
                      id="count"
                      name="count"
                      value={opexformData.count}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-gray">
                  <div className="capex-form-group">
                    <label htmlFor="salary">Salary:</label>
                    <input
                      type="text"
                      id="salary"
                      name="salary"
                      value={opexformData.salary}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="maintenance">Maintenance:</label>
                    <input
                      type="text"
                      id="maintenance"
                      name="maintenance"
                      value={opexformData.maintenance}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                </div>

                <div className="capex-row-white">
                  <div className="capex-form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={opexformData.startDate}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                  <div className="capex-form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={opexformData.endDate}
                      onChange={handleOpexInputChange}
                    />
                  </div>
                </div>
              </form>
            </div>
          <div className="opex-sub-btn">
            <button type="submit">Save</button>
            <button type="submit" onClick={handleOpexReportClick}>Report</button>
          </div>

          
        </div>
        {opexreportData && (
            <div>
              <div className="report-heading-report">
                <h2>Opex Report</h2>
              </div>
              <div className="capex-report">
                <p>
                  <strong>Furniture:</strong> {opexreportData.furniture}
                </p>
                <p>
                  <strong>Equipment:</strong> {opexreportData.equipment}
                </p>
                <p>
                  <strong>WiFi:</strong> {opexreportData.wifiopex}
                </p>
                <p>
                  <strong>Fridge:</strong> {opexreportData.fridge}
                </p>
                <p>
                  <strong>Sales Tax:</strong> {opexreportData.salesTax}
                </p>
                <p>
                  <strong>Office Cost:</strong> {opexreportData.officecost}
                </p>
                <p>
                  <strong>Select:</strong> {opexreportData.select}
                </p>
                <p>
                  <strong>Count:</strong> {opexreportData.count}
                </p>
                <p>
                  <strong>Salary:</strong>
                  {opexreportData.salary}
                </p>
                <p>
                  <strong>Maintenance:</strong> {opexreportData.maintenance}
                </p>
                <p>
                  <strong>Start Date:</strong> {opexreportData.startDate}
                </p>
                <p>
                  <strong>End Date:</strong> {opexreportData.endDate}
                </p>
                <p>
                  <strong>Total:</strong> {opexreportData.total}
                </p>
              </div>
              <div className="capex-report-buttons">
                <button type="button" onClick={handleOpexPrintClick}>
                  Print
                </button>
                <button type="button" onClick={handleCloseOpexReportClick}>
                  Close
                </button>
              </div>
            </div>
          )
        }
        </div>
      )}

{/* /////////////////////////////////////                  billing             ///////////////////////////////////////////////////// */}

{showForm === "billing" && (
<div>
<div className="bill-container">
<div className="bill-header">
  <h1>Invoice</h1>
  <p>Bill of:</p>
  <h2>{billData.clientName}</h2>
  <p>{billData.clientAddress}</p>
  <div className='no-date-div'>
  <p>{billData.contactNo}</p>
  <p>{billData.date}</p>
  </div>
</div>

<div className="bill-details">
  <table>
    <thead className='billing-table-head'>
      <tr>
        <th>Item</th>
        <th>Description</th>
        <th>Price</th>
        <th>GST</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {billData.items.map((item, index) => (
        <tr key={index}>
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td>{item.price.toFixed(2)}</td>
          <td>{item.gst}</td>
          <td>{(item.price + item.gst).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="bill-total">
  <p><strong>Total Price (without GST):</strong> {totalWithoutGST.toFixed(2)}</p>
  <p><strong>Total Price (with GST):</strong> {totalWithGST.toFixed(2)}</p>
</div>

<div className="bill-footer">
  <p>Thank you for your business!</p>
</div>




</div>

</div>



)}
    </div>
  );
}

export default App;
