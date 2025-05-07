import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./CompanyOfferForm.css"

const UnifiedFormComponent = () => {
    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Attendance
    
    paidDays: "",
    absentDays: "",
    effortDays: "",
    leaveDays: "",
  
    // Candidate Info
    fullName: "",
    dateOfJoining: "",
    lastDayOfJoining: "",
    approved: false,
    salary: "",
    ctc: "",
    designation: "",
    department: "",
    employmentType: "",
    probationPeriod: "",
    reportingManager: "",
    joiningLocation: "",
    contactNumber: "",
    email: "",
    remarks: "",
  
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    bankDocument: null,  // File input
  
    // Invoice & Service Info
    invoiceNumber: "",
    serviceForMonth: "",
    serviceMonth: "",
    recruiterName: "",
    candidateName: "",
    bgbComment: "",
    bgbReport: null,  // File input
    gstChallan: null,
gstReceipt: null,
pfChallan: null,
pfReceipt: null,
pfEcr: null,

  
    // Health Insurance
    policyNumber: "",
    startDate: "",
    endDate: "",
    insuredName: "",
    coverageType: "",
    beneficiaryName: "",
    premiumAmount: "",
    providerName: "",
    insuranceContactNumber: "",
    insuranceEmail: "",
    policyTerms: "",
    insuranceCard: null,  // File input
  
    // Invoice Form
    grnNumber: "",
    poNumber: "",
    routingPartnerName: "",
    fees: "",
    invoiceDate: "",
    address: "",
    gstNumber: "",
    billingStartDate: "",
    billingEndDate: "",
    invoiceRaiseDate: "",
    dueDate: "",
    collectionDate: "",
    receivedAmount: "",
    gstPaidStatus: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleAttendanceCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.attendanceType, value]
        : prev.attendanceType.filter((item) => item !== value);
      return { ...prev, attendanceType: updated };
    });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({
          fileName: file.name,
          fileData: reader.result,
        });
      };
      reader.onerror = (error) => reject(error);
    });
  };
  const downloadBase64File = (base64, fileName) => {
    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${base64}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    axios.get('http://localhost:9091/api/fullform')  // Adjust the URL based on your backend
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const newFormData = { ...formData };
  
      // Wrap files in { fileName, fileData } objects
      if (formData.bankDocument) {
        newFormData.bankDocument = await convertFileToBase64(formData.bankDocument);
      }
  
      if (formData.bgbReport) {
        newFormData.bgbReport = await convertFileToBase64(formData.bgbReport);
      }
  
      if (formData.insuranceCard) {
        newFormData.insuranceCard = await convertFileToBase64(formData.insuranceCard);
      }
      if (formData.gstChallan) {
        newFormData.gstChallan = await convertFileToBase64(formData.gstChallan);
      }
      if (formData.gstReceipt) {
        newFormData.gstReceipt = await convertFileToBase64(formData.gstReceipt);
      }
      if (formData.pfChallan) {
        newFormData.pfChallan = await convertFileToBase64(formData.pfChallan);
      }
      if (formData.pfReceipt) {
        newFormData.pfReceipt = await convertFileToBase64(formData.pfReceipt);
      }
      if (formData.pfEcr) {
        newFormData.pfEcr = await convertFileToBase64(formData.pfEcr);
      }
      
  
      console.log("Final Payload to Backend:", newFormData);
  
      const response = await axios.post(
        "http://localhost:9091/api/fullform",
        newFormData
      );
  
      console.log("Form submitted successfully", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };
  
console.log(formData.pfChallan);
  return (
    <>
    <div className="form_maincompanyofferformmaindiv">
    <h2 >Offer Letter Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex-divformforcompanyofferform">
                        <div className="flex1formforcompanyofferform">
      {/* ===== Attendance Section ===== */}
      <h2 className="h2classnameforformcomapnyofferform">Attendance Overview</h2>
      {[
  { label: "Paid Days", name: "paidDays" },
  { label: "Absent Days", name: "absentDays" },
  { label: "Effort Days", name: "effortDays" },
  { label: "Leave Days", name: "leaveDays" },
].map(({ label, name }) => (
  <div key={name}>
    <label className="formlabelforcompanyofferform">
      {label}:
      <input className="inputantsametextareastyleforcompanyofferform"
        type="number"
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </label>
  </div>
))}

      
<h2 className="h2classnameforformcomapnyofferform">Candidate Onboarding Form</h2>
{[
  { label: "Full Name", name: "fullName" },
  { label: "Date of Joining", name: "dateOfJoining", type: "date" },
  { label: "Last Day of Working", name: "lastDayOfJoining", type: "date" },
  { label: "Salary", name: "salary", type: "number" },
  { label: "CTC", name: "ctc", type: "number" },
  { label: "Designation", name: "designation" },
  { label: "Department", name: "department" },
  { label: "Employment Type", name: "employmentType" },
  { label: "Probation Period", name: "probationPeriod" },
  { label: "Reporting Manager", name: "reportingManager" },
  { label: "Joining Location", name: "joiningLocation" },
  { label: "Contact Number", name: "contactNumber" },
  { label: "Email", name: "email", type: "email" },
].map(({ label, name, type = "text" }) => (
  <div key={name}>
    <label className="formlabelforcompanyofferform">
      {label}:
      <input className="inputantsametextareastyleforcompanyofferform"
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required={!["probationPeriod", "lastDayOfJoining"].includes(name)}
      />
    </label>
  </div>
))}

<label className="formlabelforcompanyofferform">
  Approved:
  <input className="inputantsametextareastyleforcompanyofferform inputtypecheckboxesclassforcompanyofferform"
    type="checkbox"
    name="approved"
    checked={formData.approved}
    onChange={handleInputChange}
  />
</label>

<label className="formlabelforcompanyofferform">
  Remarks:
  <textarea className="textareaclassnameforcompanyofferform inputantsametextareastyleforcompanyofferform"
    name="remarks"
    value={formData.remarks}
    onChange={handleInputChange}
  />
</label>

      {/* ===== Bank Details ===== */}
<h2 className="h2classnameforformcomapnyofferform">Bank Details</h2>
{[
  { label: "Bank Name", name: "bankName" },
  { label: "Account Number", name: "accountNumber", type: "number" },
  { label: "IFSC Code", name: "ifscCode" },
].map(({ label, name, type = "text" }) => (
  <div key={name}>
    <label className="formlabelforcompanyofferform">
      {label}:
      <input className="inputantsametextareastyleforcompanyofferform"
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
      />
    </label>
        </div>
      ))}
      <label className="formlabelforcompanyofferform">
        Upload Bank Document:
        <input className="inputantsametextareastyleforcompanyofferform"
          type="file"
          name="bankDocument"
          onChange={handleFileChange}
          required
        />
      </label>
     
      
      {/* ===== Invoice and Service Info ===== */}
<h2 className="h2classnameforformcomapnyofferform">Invoice and Service Info</h2>
{[
  { label: "Invoice Number", name: "invoiceNumber" },
  { label: "Service For Month", name: "serviceForMonth" },
  { label: "Service Month", name: "serviceMonth", type: "month" },
].map(({ label, name, type = "text" }) => (
  <div key={name}>
    <label className="formlabelforcompanyofferform">
      {label}:
      <input className="inputantsametextareastyleforcompanyofferform"
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
      />
    </label>
  </div>
))}
      <label className="formlabelforcompanyofferform">
        Recruiter Name:
        <input className="inputantsametextareastyleforcompanyofferform"
          type="text"
          name="recruiterName"
          value={formData.recruiterName}
          onChange={handleInputChange}
          required
        />
      </label>
      <label className="formlabelforcompanyofferform">
        Candidate Name:
        <input className="inputantsametextareastyleforcompanyofferform"
          type="text"
          name="candidateName"
          value={formData.candidateName}
          onChange={handleInputChange}
          required
        />
      </label>
      <label className="formlabelforcompanyofferform">
        BGB Comment:
        <textarea className="textareaclassnameforcompanyofferform inputantsametextareastyleforcompanyofferform"
          name="bgbComment"
          value={formData.bgbComment}
          onChange={handleInputChange}
        />
      </label>
      <label className="formlabelforcompanyofferform">
        Upload BGB Report:
        <input className="inputantsametextareastyleforcompanyofferform" type="file" name="bgbReport" onChange={handleFileChange} />
      </label>
<br/>
      <label className="formlabelforcompanyofferform">
  Upload GST Challan:
  <input className="inputantsametextareastyleforcompanyofferform" type="file" name="gstChallan" onChange={handleFileChange} />
</label>
<br/>
<label className="formlabelforcompanyofferform">
  Upload GST Receipt:
  <input className="inputantsametextareastyleforcompanyofferform" type="file" name="gstReceipt" onChange={handleFileChange} />
</label>
<br/>
<label className="formlabelforcompanyofferform">
  Upload PF Challan:
  <input className="inputantsametextareastyleforcompanyofferform" type="file" name="pfChallan" onChange={handleFileChange} />
</label>
<br/>
<label className="formlabelforcompanyofferform">
  Upload PF Receipt:
  <input className="inputantsametextareastyleforcompanyofferform" type="file" name="pfReceipt" onChange={handleFileChange} />
</label>
<br/>
<label className="formlabelforcompanyofferform">
  Upload PF ECR:
  <input className="inputantsametextareastyleforcompanyofferform" type="file" name="pfEcr" onChange={handleFileChange} />
</label>
</div>
<div className="flex1formforcompanyofferform">

      {/* ===== Health Insurance ===== */}
      <h2 className="h2classnameforformcomapnyofferform">Health Insurance</h2>
{[
  { label: "Policy Number", name: "policyNumber" },
  { label: "Start Date", name: "startDate", type: "date" },
  { label: "End Date", name: "endDate", type: "date" },
  { label: "Insured Name", name: "insuredName" },
  { label: "Coverage Type", name: "coverageType" },
  { label: "Beneficiary Name", name: "beneficiaryName" },
  { label: "Premium Amount", name: "premiumAmount", type: "number" },
  { label: "Provider Name", name: "providerName" },
  { label: "Insurance Contact Number", name: "insuranceContactNumber" },
  { label: "Insurance Email", name: "insuranceEmail" },
].map(({ label, name, type = "text" }) => (
  <div key={name}>
    <label className="formlabelforcompanyofferform">
      {label}:
      <input className="inputantsametextareastyleforcompanyofferform"
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
      />
    </label>
  </div>
))}

<label className="formlabelforcompanyofferform">
  Policy Terms:
  <textarea className="textareaclassnameforcompanyofferform inputantsametextareastyleforcompanyofferform"
    name="policyTerms"
    value={formData.policyTerms}
    onChange={handleInputChange}
  />
</label>

<label className="formlabelforcompanyofferform">
  Upload Insurance Card:
  <input className="inputantsametextareastyleforcompanyofferform"
    type="file"
    name="insuranceCard"
    onChange={handleFileChange}
    required
  />
</label>


      {/* ===== Invoice Form ===== */}
      <h2 className="h2classnameforformcomapnyofferform">Invoice Form</h2>
{[
  { label: "GRN Number", name: "grnNumber" },
  { label: "PO Number", name: "poNumber" },
  { label: "Routing Partner Name", name: "routingPartnerName" },
  { label: "Fees", name: "fees", type: "number" },
  { label: "Invoice Date", name: "invoiceDate", type: "date" },
  { label: "Address", name: "address" },
  { label: "GST Number", name: "gstNumber" },
  { label: "Billing Start Date", name: "billingStartDate", type: "date" },
  { label: "Billing End Date", name: "billingEndDate", type: "date" },
  { label: "Invoice Raise Date", name: "invoiceRaiseDate", type: "date" },
  { label: "Due Date", name: "dueDate", type: "date" },
  { label: "Collection Date", name: "collectionDate", type: "date" },
  { label: "Received Amount", name: "receivedAmount", type: "number" },
  { label: "GST Paid Status", name: "gstPaidStatus" },
].map(({ label, name, type = "text" }) => (
  <div key={name}>
    <label className="formlabelforcompanyofferform">
      {label}:
      <input className="inputantsametextareastyleforcompanyofferform"
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
      />
    </label>
  </div>
))}
      </div>
 </div>
      <button className="lineUp-Filter-btn" type="submit">Submit</button>
    </form>
    </div>

{/* table start */}
<div>
      <h2 className="h2classnameforformcomapnyofferform">Candidate, Bank, Service/Invoice & Health Insurance Data</h2>
      <div className="attendanceTableData">
      <table className="attendance-table">
        <thead>
          <tr className="attendancerows-head">
          <th  className="attendanceheading">Paid Days</th>
            <th  className="attendanceheading">Absent Days</th>
            <th  className="attendanceheading">Effort Days</th>
            <th  className="attendanceheading">Leave Days</th>
            <th  className="attendanceheading">Full Name</th>
            
            <th  className="attendanceheading">Date of Joining</th>
            <th  className="attendanceheading">Last Working Day</th>
            <th  className="attendanceheading">Approved</th>
            <th  className="attendanceheading">Salary</th>
            <th  className="attendanceheading">CTC</th>
            <th  className="attendanceheading">Designation</th>
            <th  className="attendanceheading">Department</th>
            <th  className="attendanceheading">Employment Type</th>
            <th  className="attendanceheading">Probation Period</th>
            <th  className="attendanceheading">Reporting Manager</th>
            <th  className="attendanceheading">Joining Location</th>
            <th  className="attendanceheading">Contact Number</th>
            <th  className="attendanceheading">Email</th>
            <th  className="attendanceheading">Remarks</th>
            <th  className="attendanceheading">Bank Name</th>
            <th  className="attendanceheading">Account Number</th>
            <th  className="attendanceheading">IFSC Code</th>
            <th  className="attendanceheading">Bank Document</th>
            <th  className="attendanceheading">Invoice Number</th>
            <th  className="attendanceheading">Service for Month</th>
            <th  className="attendanceheading">Service Month</th>
            <th  className="attendanceheading">Recruiter Name</th>
            <th  className="attendanceheading">Candidate Name</th>
            <th  className="attendanceheading">BGB Comment</th>
            <th  className="attendanceheading">BGB Report</th>
            <th  className="attendanceheading">GST Challan</th>
            <th  className="attendanceheading">GST Receipt</th>
            <th  className="attendanceheading">PF challan</th>
            <th  className="attendanceheading">PF Receipt</th>
            <th  className="attendanceheading">PF ECR</th>

            <th  className="attendanceheading">Policy Number</th>
            <th  className="attendanceheading">Start Date</th>
            <th  className="attendanceheading">End Date</th>
            <th  className="attendanceheading">Insured Name</th>
            <th  className="attendanceheading">Coverage Type</th>
            <th  className="attendanceheading">Beneficiary Name</th>
            <th  className="attendanceheading">Premium Amount</th>
            <th  className="attendanceheading">Provider Name</th>
            <th  className="attendanceheading">Insurance Contact Number</th>
            <th  className="attendanceheading">Insurance Email</th>
            <th  className="attendanceheading">Policy Terms</th>
            <th  className="attendanceheading">Insurance Card</th>
            <th  className="attendanceheading">GRN Number</th>
            <th  className="attendanceheading">PO Number</th>
            <th  className="attendanceheading">Routing Partner Name</th>
            <th  className="attendanceheading">Fees</th>
            <th  className="attendanceheading">Invoice Date</th>
            <th  className="attendanceheading">Address</th>
            <th  className="attendanceheading">GST Number</th>
            <th  className="attendanceheading">Billing Start Date</th>
            <th  className="attendanceheading">Billing End Date</th>
            <th  className="attendanceheading">Invoice Raise Date</th>
            <th  className="attendanceheading">Due Date</th>
            <th  className="attendanceheading">Collection Date</th>
            <th  className="attendanceheading">Received Amount</th>
            <th  className="attendanceheading">GST Paid Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="attendancerows">
                <td  className="tabledata">{row.paidDays}</td>
                <td  className="tabledata ">{row.absentDays}</td>
                <td  className="tabledata ">{row.effortDays}</td>
                <td  className="tabledata">{row.leaveDays}</td>
                <td  className="tabledata">{row.fullName}</td>
                <td  className="tabledata">{row.dateOfJoining}</td>
                <td  className="tabledata">{row.lastDayOfJoining}</td>
                <td  className="tabledata">{row.approved ? 'Yes' : 'No'}</td>
                <td  className="tabledata">{row.salary}</td>
                <td  className="tabledata">{row.ctc}</td>
                <td  className="tabledata">{row.designation}</td>
                <td  className="tabledata">{row.department}</td>
                <td  className="tabledata">{row.employmentType}</td>
                <td  className="tabledata">{row.probationPeriod}</td>
                <td  className="tabledata">{row.reportingManager}</td>
                <td  className="tabledata">{row.joiningLocation}</td>
                <td  className="tabledata">{row.contactNumber}</td>
                <td  className="tabledata">{row.email}</td>
                <td  className="tabledata">{row.remarks}</td>
                <td  className="tabledata">{row.bankName}</td>
                <td  className="tabledata">{row.accountNumber}</td>
                <td  className="tabledata">{row.ifscCode}</td>
                <td className="tabledata">
  {row.bankDocumentBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.bankDocumentBase64,
          row.bankDocumentName || 'bank-document.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>
                <td  className="tabledata">{row.invoiceNumber}</td>
                <td  className="tabledata">{row.serviceForMonth}</td>
                <td  className="tabledata">{row.serviceMonth}</td>
                <td  className="tabledata">{row.recruiterName}</td>
                <td  className="tabledata">{row.candidateName}</td>
                <td  className="tabledata">{row.bgbComment}</td>
                <td className="tabledata">
  {row.bgbReportBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.bgbReportBase64,
          row.bgbReportName || 'bgb-report.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>                
<td className="tabledata">
  {row.gstChallanBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.gstChallanBase64,
          row.gstChallanName || 'gst-challan.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>                
<td className="tabledata">
  {row.gstReceiptBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.gstReceiptBase64,
          row.gstReceiptName || 'gst-receipt.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>                
<td className="tabledata">
  {row.pfChallanBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.pfChallanBase64,
          row.pfChallanName || 'pf-challan.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>                
<td className="tabledata">
  {row.pfReceiptBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.pfReceiptBase64,
          row.pfReceiptName || 'gst-receipt.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>                
<td className="tabledata">
  {row.pfEcrBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.pfEcrBase64,
          row.pfEcrName || 'pf-ecr.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>                <td  className="tabledata">{row.policyNumber}</td>
                <td  className="tabledata">{row.startDate}</td>
                <td  className="tabledata">{row.endDate}</td>
                <td  className="tabledata">{row.insuredName}</td>
                <td  className="tabledata">{row.coverageType}</td>
                <td  className="tabledata">{row.beneficiaryName}</td>
                <td  className="tabledata">{row.premiumAmount}</td>
                <td  className="tabledata">{row.providerName}</td>
                <td  className="tabledata">{row.insuranceContactNumber}</td>
                <td  className="tabledata">{row.insuranceEmail}</td>
                <td  className="tabledata">{row.policyTerms}</td>
                <td className="tabledata">
  {row.insuranceCardBase64 && (
    <button
      onClick={() =>
        downloadBase64File(
          row.insuranceCardBase64,
          row.insuranceCardName || 'insurance-card.pdf'
        )
      }
    >
      Download
    </button>
  )}
</td>                <td  className="tabledata">{row.grnNumber}</td>
                <td  className="tabledata">{row.poNumber}</td>
                <td  className="tabledata">{row.routingPartnerName}</td>
                <td  className="tabledata">{row.fees}</td>
                <td  className="tabledata">{row.invoiceDate}</td>
                <td  className="tabledata">{row.address}</td>
                <td  className="tabledata">{row.gstNumber}</td>
                <td  className="tabledata">{row.billingStartDate}</td>
                <td  className="tabledata">{row.billingEndDate}</td>
                <td  className="tabledata">{row.invoiceRaiseDate}</td>
                <td  className="tabledata">{row.dueDate}</td>
                <td  className="tabledata">{row.collectionDate}</td>
                <td  className="tabledata">{row.receivedAmount}</td>
                <td  className="tabledata">{row.gstPaidStatus}</td>
              </tr> 
            ))
          ) : (
            <tr>
              <td colSpan="66">No data available</td> {/* Adjust the number of columns based on the actual number of columns */}
            </tr>
          )}
        </tbody>
       
      </table>
      </div>
    </div>
    </>

  );
};



export default UnifiedFormComponent;
