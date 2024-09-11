/* Mohini_InvoiceTable_WholePage_09/07/2024 */

import React, { useEffect, useState } from "react";
import "./invoiceReport.css";
import InvoicePdf from "./invoicePdf";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { API_BASE_URL } from "../api/api";

// SwapnilRokade_InvoiceReport_FetchDataFromApiAndDisplay_09_to_664_12/07
// SwapnilRokade_InvoiceReport_FetchDataFromApiAndDisplay_09To664_15/07
const InvoiceReport = () => {
  const [showInvoicePdf, setShowInvoicePdf] = useState(false);
  const [invoiceReport, setInvoiceReport] = useState([]);
  const [invoiceId, setInvoiceId] = useState();
  const [Loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffcb9b");

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoice();
  }, []);

  // Fetch invoice data from API
  const fetchInvoice = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetch-all-Invoice`);
      const data = await response.json();
      setInvoiceReport(data);
      setLoading(true);
    } catch (error) {
      setLoading(true);
      console.error("Unable to fetch Data");
    }
  };

  // Handle mouse over event for displaying tooltips
  const handleMouseOver = (event) => {
    const tableData = event.currentTarget;
    const tooltip = tableData.querySelector(".tooltip");
    const tooltipText = tableData.querySelector(".tooltiptext");

    if (tooltip && tooltipText) {
      const textOverflowing =
        tableData.offsetWidth < tableData.scrollWidth ||
        tableData.offsetHeight < tableData.scrollHeight;
      if (textOverflowing) {
        const rect = tableData.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.visibility = "visible";
      } else {
        tooltip.style.visibility = "hidden";
      }
    }
  };

  // Handle mouse out event to hide tooltips
  const handleMouseOut = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    if (tooltip) {
      tooltip.style.visibility = "hidden";
    }
  };

  // Handle click event to display PDF modal
  const handleClick = (id) => {
    setInvoiceId(id);
    setShowInvoicePdf(true);
  };

  // Close PDF modal
  const closeInvoicePdf = () => {
    setShowInvoicePdf(false);
  };

  return (
    <div className="attendanceTableData">
      {Loading ? (
        <>
          {!showInvoicePdf ? (
            <>
              {invoiceReport.length > 0 ? (
                <>
                  <table className="table-container">
                    <thead>
                      <tr className="table-header">
                        <th className="table-header-cell">Sr No.</th>
                        <th className="table-header-cell">Invoice Date</th>
                        <th className="table-header-cell">Client Name</th>
                        <th className="table-header-cell">Client Address</th>
                        <th className="table-header-cell">Client GST Number</th>
                        {/* Company Details */}
                        <th className="table-header-cell" colSpan="5">
                          Company Details
                        </th>

                        <th className="table-header-cell">Invoice Number</th>
                        <th className="table-header-cell">Service Type</th>
                        <th className="table-header-cell">Product Type</th>
                        {/* Candidate Details
             
            
            */}
                        <th className="table-header-cell" colSpan="4">
                          Candidate Details
                        </th>

                        <th className="table-header-cell">Salary</th>
                        <th className="table-header-cell">Annual CTC</th>
                        <th className="table-header-cell">Billing Rate</th>
                        <th className="table-header-cell">Gross Bill Amount</th>
                        <th className="table-header-cell">Total Bill Amount</th>
                        {/* GST */}
                        <th className="table-header-cell" colSpan="5">
                          GST
                        </th>

                        {/* Miscellaneous */}
                        <th className="table-header-cell">Consultant Id</th>
                        <th className="table-header-cell">GRE No</th>
                        <th className="table-header-cell">Po No</th>
                        {/* Bank Details */}
                        <th className="table-header-cell" colSpan="4">
                          Bank details
                        </th>

                        {/* Invoice Tracking */}
                        <th className="table-header-cell">Invoice Sent From</th>
                        <th className="table-header-cell">Invoice Sent To</th>
                        <th className="table-header-cell">Hard Copy Sent</th>
                        <th className="table-header-cell">Payment Expected</th>
                        <th className="table-header-cell">TDS</th>
                        <th className="table-header-cell">Payment Received</th>
                        <th className="table-header-cell">
                          Payment Received Amount
                        </th>
                        <th className="table-header-cell">GST Amount</th>
                        <th className="table-header-cell">
                          Discrepancy Amount
                        </th>
                        <th className="table-header-cell">
                          Discrepancy Remark
                        </th>
                        <th className="table-header-cell">GST File</th>
                        <th className="table-header-cell">
                          GST Amount Payment
                        </th>

                        {/* send to details */}
                        <th className="table-header-cell" colSpan="4">
                          Send To Details
                        </th>

                        {/* Client Details */}
                        <th className="table-header-cell" colSpan="4">
                          Client Details
                        </th>
                        <th className="table-header-cell">Print</th>
                      </tr>
                      <tr className="table-header">
                        <th className="table-header-cell" colSpan="5"></th>
                        {/* Sub-headings for Company Details */}
                        <th className="sub-heading-cell">Name</th>
                        <th className="sub-heading-cell">Address</th>
                        <th className="sub-heading-cell">GST No</th>
                        <th className="sub-heading-cell">HSC Code</th>
                        <th className="sub-heading-cell">SAC Code</th>
                        {/* <th className="sub-heading-cell" colSpan="1"></th> */}

                        <th className="sub-heading-cell" colSpan="3"></th>
                        {/* Sub-headings for Company Details */}
                        <th className="sub-heading-cell">Candidate Name</th>
                        <th className="sub-heading-cell">Candidate Location</th>
                        <th className="sub-heading-cell">Date Of Joining</th>
                        <th className="sub-heading-cell">Department</th>
                        {/* <th className="sub-heading-cell" colSpan=""></th> */}

                        <th className="sub-heading-cell" colSpan="5"></th>
                        {/* Sub-headings for Company Details */}
                        <th className="sub-heading-cell">CGST</th>
                        <th className="sub-heading-cell">SGST</th>
                        <th className="sub-heading-cell">IGST</th>
                        <th className="sub-heading-cell">Grand Total</th>
                        <th className="sub-heading-cell">
                          Grand Total In Word
                        </th>
                        {/* <th className="sub-heading-cell" colSpan=""></th> */}

                        <th className="sub-heading-cell" colSpan="3"></th>
                        {/* Sub-headings for Company Details */}
                        <th className="sub-heading-cell">Bank Name</th>
                        <th className="sub-heading-cell">Ac No</th>
                        <th className="sub-heading-cell">IFSC Code</th>
                        <th className="sub-heading-cell">Branch</th>
                        {/* <th className="sub-heading-cell" colSpan=""></th> */}

                        <th className="sub-heading-cell" colSpan="12"></th>
                        {/* Sub-headings for Company Details */}
                        <th className="sub-heading-cell">Name</th>
                        <th className="sub-heading-cell">Designation</th>
                        <th className="sub-heading-cell">Email</th>
                        <th className="sub-heading-cell">Mobile No</th>

                        {/* Sub-headings for Company Details */}
                        <th className="sub-heading-cell">Name</th>
                        <th className="sub-heading-cell">Designation</th>
                        <th className="sub-heading-cell">Email</th>
                        <th className="sub-heading-cell">Mobile No</th>
                        <th className="sub-heading-cell" colSpan="2"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {invoiceReport.map((item, index) => (
                        <tr key={item.id}>
                          <td className="tabledata">{index + 1}</td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.invoiceDate}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.invoiceDate}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientName}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.clientName}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientAddress}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.clientAddress}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientGstNumber}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.clientGstNumber}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.companyName}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.companyName}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.companyAddress}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.companyAddress}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientGstNumber}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.clientGstNumber}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.hsnCode}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.hsnCode}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.sacCode}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.sacCode}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.invoiceNo}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.invoiceNo}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.serviceType}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.serviceType}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.productType}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.productType}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.candidateName}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.candidateName}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.candidateLocation}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.candidateLocation}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.dateOfJoining}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.dateOfJoining}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.department}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.department}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.salary}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.salary}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.annualCtc}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.annualCtc}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.billingRate}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.billingRate}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.grossBillAmount}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.grossBillAmount}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.totalBillAmount}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.totalBillAmount}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.cgst}
                            <div className="tooltip">
                              <span className="tooltiptext"> {item.cgst}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.sgst}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.sgst}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.igst}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.igst}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.grandTotal}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.grandTotal}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.grandTotalInWords}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.grandTotalInWords}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.consultantId}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.consultantId}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.greNo}
                            <div className="tooltip">
                              <span className="tooltiptext"> {item.greNo}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.poNo}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.poNo}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.bankName}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.bankName}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.acNo}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.acNo}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.ifscCode}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.ifscCode}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.branch}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.branch}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.invoiceSentFrom}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.invoiceSentFrom}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.invoiceSentTo}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.invoiceSentTo}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.hardCopySent}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.hardCopySent}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.paymentExpected}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.paymentExpected}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.tds}
                            <div className="tooltip">
                              <span className="tooltiptext"> {item.tds}</span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.paymentReceived}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.paymentReceived}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.paymentReceivedAmount}

                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.paymentReceivedAmount}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.gstAmount}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.gstAmount}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.discrepancyAmount}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.discrepancyAmount}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.discrepancyRemark}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.discrepancyRemark}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.gstFile}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.gstFile}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.gstAmtPayment}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.gstAmtPayment}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.sendDetails.name}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.sendDetails.name}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.sendDetails.designation}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.sendDetails.designation}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.sendDetails.email}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.sendDetails.email}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.sendDetails.mobile}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.sendDetails.mobile}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientDetails.name}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {" "}
                                {item.clientDetails.name}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientDetails.designation}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.clientDetails.designation}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientDetails.email}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.clientDetails.email}
                              </span>
                            </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.clientDetails.mobile}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.clientDetails.mobile}
                              </span>
                            </div>
                          </td>
                          <td className="tabledata">
                            <button onClick={() => handleClick(item.invoiceNo)}>
                              <i className="fa-solid fa-print"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  No Data Found
                </div>
              )}
            </>
          ) : (
            <Modal
              show={showInvoicePdf}
              onHide={closeInvoicePdf}
              size="xl"
              centered
            >
              <Modal.Body>
                <div className="TeamLead-main-table-container">
                  <InvoicePdf id={invoiceId} onClose={closeInvoicePdf} />
                </div>
              </Modal.Body>
            </Modal>
          )}
        </>
      ) : (
        <div className="register">
          <HashLoader
            color={`${localStorage.getItem("bgColor")}`}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceReport;

/* Mohini_InvoiceTable_WholePage_09/07/2024 */
