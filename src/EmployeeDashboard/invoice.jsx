/* Mohini_InvoiceTable_WholePage_09/07/2024*/

import React, { useState } from "react";
import "./invoice.css";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
// SwapnilRokade_InvoiceTable_StroreFormDateToDatabase__07_to_654_12/07
// SwapnilRokade_InvoiceTable_StoringSupplierSection_09To664_15/07
const InvoiceTable = () => {
  const [formData, setFormData] = useState({
    invoiceDate: "",
    clientName: "",
    clientAddress: "",
    clientGstNumber: "",
    companyName: "",
    companyAddress: "",
    companyGstNo: "",
    hsnCode: "",
    sacCode: "",
    serviceType: "",
    productType: "",
    candidateName: "",
    candidateLocation: "",
    dateOfJoining: "",
    department: "",
    designation: "",
    salary: "",
    annualCtc: "",
    billingRate: "",
    grossBillAmount: "",
    totalBillAmount: "",
    grossAmount: "",
    cgst: "",
    sgst: "",
    igst: "",
    totalGst: "",
    grandTotal: "",
    consultantId: "",
    grandTotalInWords: "",
    poNo: "",
    greNo: "",
    bankName: "",
    acNo: "",
    ifscCode: "",
    branch: "",
    invoiceSentFrom: "",
    invoiceSentTo: "",
    attendanceDurationFrom: "",
    attendanceDurationTo: "",
    hardCopySent: "",
    paymentReceived: "",
    tds: "",
    paymentExpected: "",
    paymentReceivedAmount: "",
    discrepancyAmount: "",
    discrepancyRemark: "",
    gstFile: "",
    gstAmount: "",
    gstAmtPayment: "",
    sendDetails: {
      name: "",
      designation: "",
      email: "",
      mobile: "",
    },
    supplierDetails: {
      supplierName: "",
      supplierOfficeNo: "",
      supplierNearLoc: "",
      supplierCity: "",
      supplierPinCode: "",
      supplierGstNo: "",
      supplierSacCode: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSendDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      sendDetails: { ...prev.sendDetails, [name]: value },
    }));
  };
  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      clientDetails: { ...prev.clientDetails, [name]: value },
    }));
  };
  const handleSupplierDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      supplierDetails: { ...prev.supplierDetails, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/saveInvoice`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Invoice Saved Successfully");
      e.target.reset();
    } catch (error) {
      toast.error("Failed to save invoice");
    }
  };

  return (
    <main className="job-desc">
      <section className="job-performance">
        <form onSubmit={handleSubmit}>
          <div className="job-desc-form">
            <div className="field-column">
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Invoice Date</label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label>Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Enter Client Name"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Client Address</label>
                  <input
                    type="text"
                    name="clientAddress"
                    value={formData.clientAddress}
                    onChange={handleChange}
                    placeholder="Client Address"
                  />
                </div>
                <div className="field">
                  <label>Client GST Number</label>
                  <input
                    type="text"
                    name="clientGstNumber"
                    value={formData.clientGstNumber}
                    onChange={handleChange}
                    placeholder="Client GST Number"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Company Detail </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    placeholder="Company Address"
                  />
                </div>
                <div className="field">
                  <label>Company GST NO</label>
                  <input
                    type="text"
                    name="companyGstNo"
                    value={formData.companyGstNo}
                    onChange={handleChange}
                    placeholder="Enter  Company GST NO"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>HSN Code</label>
                  <input
                    type="text"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleChange}
                    placeholder="Enter HSN Code"
                  />
                </div>
                <div className="field">
                  <label>SAC Code</label>
                  <input
                    type="text"
                    name="sacCode"
                    value={formData.sacCode}
                    onChange={handleChange}
                    placeholder="Enter SAC Code"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Invoice No</label>
                  <input
                    type="text"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    placeholder="Service Type"
                  />
                  <input
                    type="text"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    placeholder="Product Type"
                  />
                </div>
                <div className="field">
                  <label>Candidate Name</label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleChange}
                    placeholder="Enter Name"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Candidate Location</label>
                  <input
                    type="text"
                    name="candidateLocation"
                    value={formData.candidateLocation}
                    onChange={handleChange}
                    placeholder="Enter Location"
                  />
                </div>
                <div className="field">
                  <label>Date of Joining</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter Department"
                  />
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                </div>
                <div className="field">
                  <label>Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter Salary"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Annual CTC</label>
                  <input
                    type="text"
                    name="annualCtc"
                    value={formData.annualCtc}
                    onChange={handleChange}
                    placeholder="Enter Annual CTC"
                  />
                </div>
                <div className="field">
                  <label>Billing Rate</label>
                  <input
                    type="text"
                    name="billingRate"
                    value={formData.billingRate}
                    onChange={handleChange}
                    placeholder="Enter Billing Rate"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Gross Bill Amount</label>
                  <input
                    type="text"
                    name="grossBillAmount"
                    value={formData.grossBillAmount}
                    onChange={handleChange}
                    placeholder="Enter Gross Bill Amount"
                  />
                </div>
                <div className="field">
                  <label>Total Bill Amount</label>
                  <input
                    type="text"
                    name="totalBillAmount"
                    value={formData.totalBillAmount}
                    onChange={handleChange}
                    placeholder="Enter Total Bill amount"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Gross Amount</label>
                  <input
                    type="text"
                    name="grossAmount"
                    value={formData.grossAmount}
                    onChange={handleChange}
                    placeholder="Enter Gross Amount"
                  />
                </div>
                <div className="field">
                  <label>Consultant Id</label>
                  <input
                    type="text"
                    name="consultantId"
                    value={formData.consultantId}
                    onChange={handleChange}
                    placeholder="Enter Consultant Id "
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>CGST</label>
                  <input
                    type="text"
                    name="cgst"
                    value={formData.cgst}
                    onChange={handleChange}
                  />
                  <label>SGST</label>
                  <input
                    type="text"
                    name="sgst"
                    value={formData.sgst}
                    onChange={handleChange}
                  />
                  <label>IGST</label>
                  <input
                    type="text"
                    name="igst"
                    value={formData.igst}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label>Total GST </label>
                  <input
                    type="text"
                    name="totalGst"
                    value={formData.totalGst}
                    onChange={handleChange}
                  />
                  <label>Grand Total</label>
                  <input
                    type="text"
                    name="grandTotal"
                    value={formData.grandTotal}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Grand Total in Words</label>
                  <input
                    type="text"
                    name="grandTotalInWords"
                    value={formData.grandTotalInWords}
                    onChange={handleChange}
                    placeholder="Enter Grand total in word"
                  />
                </div>
                <div className="field">
                  <label>Po No</label>
                  <input
                    type="text"
                    name="poNo"
                    value={formData.poNo}
                    onChange={handleChange}
                    placeholder="Enter Po No"
                  />
                  <label>GRE No</label>
                  <input
                    type="text"
                    name="greNo"
                    value={formData.greNo}
                    onChange={handleChange}
                    placeholder="Enter GRE No "
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Bank Details</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter Bank Name "
                  />{" "}
                  <label>AC </label>
                  <input
                    type="text"
                    name="acNo"
                    value={formData.acNo}
                    onChange={handleChange}
                    placeholder="AC No "
                  />
                </div>
                <div className="field">
                  <label>IFSC</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="IFSC Code"
                  />
                  <label>Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Enter branch"
                  />
                </div>
              </div>

              <div className="field-Row-Gray">
                <div className="field">
                  <label>Invoice Sent From-To</label>
                  <input
                    type="date"
                    name="invoiceSentFrom"
                    value={formData.invoiceSentFrom}
                    onChange={handleChange}
                    placeholder="Enter Invoice Sent From "
                  />
                  <input
                    type="date"
                    name="invoiceSentTo"
                    value={formData.invoiceSentTo}
                    onChange={handleChange}
                    placeholder="Enter Invoice Sent To"
                  />
                </div>
                <div className="field">
                  <label>Attendence duration</label>
                  <input
                    type="date"
                    name="attendanceDurationFrom"
                    value={formData.attendanceDurationFrom}
                    onChange={handleChange}
                    placeholder="Enter Attendence Duration "
                  />
                  <input
                    type="date"
                    name="attendanceDurationTo"
                    value={formData.attendanceDurationTo}
                    onChange={handleChange}
                    placeholder="Enter Attendence Duration "
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Hard Copy Sent</label>
                  <label>
                    <input
                      type="radio"
                      name="hardCopySent"
                      checked={formData.hardCopySent === "Yes"}
                      value="Yes"
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hardCopySent"
                      checked={formData.hardCopySent === "No"}
                      value="No"
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </div>

                <div className="field">
                  <label>TDS</label>
                  <input
                    type="text"
                    name="tds"
                    value={formData.tds}
                    onChange={handleChange}
                    placeholder="Enter TDS"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Payment Received</label>
                  <label>
                    <input
                      type="radio"
                      name="paymentReceived"
                      checked={formData.paymentReceived === "Yes"}
                      value="Yes"
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentReceived"
                      checked={formData.paymentReceived === "No"}
                      value="No"
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </div>

                <div className="field">
                  <label>Payment Received Amount</label>
                  <input
                    type="number"
                    name="paymentReceivedAmount"
                    value={formData.paymentReceivedAmount}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Payment Expected Date</label>
                  <input
                    type="date"
                    name="paymentExpected"
                    value={formData.paymentExpected}
                    onChange={handleChange}
                    placeholder="Enter Payment Expected "
                  />
                </div>

                <div className="field">
                  <label>GST Amt Payment</label>
                  <label>
                    <input
                      type="radio"
                      name="gstAmtPayment"
                      checked={formData.gstAmtPayment === "Yes"}
                      value="Yes"
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gstAmtPayment"
                      value="No"
                      checked={formData.gstAmtPayment === "No"}
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </div>
              </div>

              <div className="field-Row-Gray">
                <div className="field">
                  <label>Discrepancy Amount</label>
                  <input
                    type="text"
                    name="discrepancyAmount"
                    value={formData.discrepancyAmount}
                    onChange={handleChange}
                    placeholder="Discrepancy Amount"
                  />
                </div>
                <div className="field">
                  <label>Discrepancy Remark</label>
                  <input
                    type="text"
                    name="discrepancyRemark"
                    value={formData.discrepancyRemark}
                    onChange={handleChange}
                    placeholder="Discrepancy Remark"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>GST File</label>
                  <label>
                    <input
                      type="radio"
                      name="gstFile"
                      value="Yes"
                      checked={formData.gstFile === "Yes"}
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gstFile"
                      value="No"
                      checked={formData.gstFile === "No"}
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field">
                  <label>GST Amount</label>
                  <label>
                    <input
                      type="radio"
                      name="gstAmount"
                      value="Yes"
                      checked={formData.gstAmount === "Yes"}
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gstAmount"
                      value="No"
                      checked={formData.gstAmount === "No"}
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Send to details</label>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.sendDetails.name}
                    onChange={handleSendDetailsChange}
                  />
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.sendDetails.designation}
                    onChange={handleSendDetailsChange}
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.sendDetails.email}
                    onChange={handleSendDetailsChange}
                  />
                  <label>Mobile</label>{" "}
                  <input
                    type="text"
                    name="mobile"
                    value={formData.sendDetails.mobile}
                    onChange={handleSendDetailsChange}
                  />
                </div>
              </div>
              
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Details of Supplier:</label>
                  <input
                    type="text"
                    name="supplierName"
                    placeholder="Enter Company Name"
                    value={formData.supplierDetails.supplierName}
                    onChange={handleSupplierDetailsChange}
                  />
                </div>
                <div className="field">
                  <input
                    type="text"
                    name="supplierOfficeNo"
                    placeholder="Enter Office No"
                    value={formData.supplierDetails.supplierOfficeNo}
                    onChange={handleSupplierDetailsChange}
                  />
                  <input
                    type="text"
                    name="supplierNearLoc"
                    placeholder="Enter Area/BuildingName"
                    value={formData.supplierDetails.supplierNearLoc}
                    onChange={handleSupplierDetailsChange}
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <input
                    type="text"
                    name="supplierCity"
                    placeholder="Enter City"
                    value={formData.supplierDetails.supplierCity}
                    onChange={handleSupplierDetailsChange}
                  />
                  <input
                    type="text"
                    name="supplierPinCode"
                    placeholder="Enter Pin Code"
                    value={formData.supplierDetails.supplierPinCode}
                    onChange={handleSupplierDetailsChange}
                  />
                </div>
                <div className="field">
                  <input
                    type="text"
                    name="supplierGstNo"
                    placeholder="Enter Gst Number"
                    value={formData.supplierDetails.supplierGstNo}
                    onChange={handleSupplierDetailsChange}
                  />
                  <input
                    type="text"
                    name="supplierSacCode"
                    placeholder="Enter SAC COde"
                    value={formData.supplierDetails.supplierSacCode}
                    onChange={handleSupplierDetailsChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="shortlisted-submite-btn">
            <button type="submit" >
              Save Invoice
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default InvoiceTable;

/* Mohini_InvoiceTable_WholePage_09/07/2024*/
