import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./CompanyOfferForm.css"
import Loader from "../EmployeeSection/loader"
import { API_BASE_URL } from "../api/api";
import { DownCircleFilled, DownloadOutlined } from "@ant-design/icons";
import { DownloadCloudIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import IssueOfferLetter from "../TeamLeader/IssueOfferLetter";

const UnifiedFormComponent = () => {
  const [editForm, setEditForm] = useState(null);
  const {employeeId, userType} = useParams();
  const [displayOfferLetter, setDisplayOfferLetter] = useState(false);
  const [offerLetterData, setOfferLetterData] = useState(null);

    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Attendance
     id: null,
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
  const userId = employeeId;
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
console.log(
  data
);
const getFormsData = async () =>{
  setLoading(true);
  try {
     const url = userType === "SuperUser" ? `${API_BASE_URL}/getFormsBySuId/${employeeId}` : userType === "Manager" && `${API_BASE_URL}/getFormsByManagerId/${employeeId}`;
     const response = await axios.get(`${url}`) ;
     setData(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }finally{
        setLoading(false);
  }
}
  useEffect(() => {
   getFormsData();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const newFormData = { ...formData };
if (!formData.id) {
  delete newFormData.id; // Let the backend handle ID creation
}

  
      // Handle file conversions
      const convertIfPresent = async (key) => {
        if (formData[key]) {
          newFormData[key] = await convertFileToBase64(formData[key]);
        }
      };
  
      await Promise.all([
        convertIfPresent("bankDocument"),
        convertIfPresent("bgbReport"),
        convertIfPresent("insuranceCard"),
        convertIfPresent("gstChallan"),
        convertIfPresent("gstReceipt"),
        convertIfPresent("pfChallan"),
        convertIfPresent("pfReceipt"),
        convertIfPresent("pfEcr"),
      ]);
  
      const isEditMode = !!formData.id; // Check if it's an update
  
      const url = isEditMode
        ? `${API_BASE_URL}/updateFullFormByIdAndUser/${formData.id}/${userType}/${userId}`
        : `${API_BASE_URL}/addFullForm/${userType}/${userId}`;
  
      const response = isEditMode
        ? await axios.put(url, newFormData)
        : await axios.post(url, newFormData);
        if (!isEditMode && response.data.id) {
          console.log("Newly created ID:", response.data.id);}
      alert(isEditMode ? "Form updated successfully!" : "Form submitted successfully!");
  
      // Optionally reset
      setFormData({});
      setEditForm(null);
  getFormsData(); // Refresh data after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }

    
  };
  const handleOpenOfferLetter = (row) =>{
setOfferLetterData(row);
setDisplayOfferLetter(true);
  }
  const handleDelete = async (formData, userType, userId) => {
    // Log the values before the API call

    console.log("formData", formData);
    console.log("userType", userType);
    console.log("userId", userId); // This should be defined
  console.log(formData.id, userType, userId);
    // Check if formData, userType, and userId are valid
    if (!formData?.id || !userType || !userId) {
      alert("Invalid form or user information. Deletion cannot proceed.");
      return;
    }
    
    // Confirm before deletion
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    try {  
      const url = `${API_BASE_URL}/deleteByFormIdAndUser/${formData.id}/${userType}/${userId}`;
      console.log('Delete URL:', url); // Log the URL to ensure it's correct
  
      // Send DELETE request to the API
      const response = await axios.delete(url);
  
      if (response.status === 200) {
        alert('Form deleted successfully.');
        // Optionally refresh data after deletion
        // fetchForms(); // or update your state manually
      } else {
        alert('Failed to delete the form. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Failed to delete the form.');
    }
  };
  
  
  const handleUpdate = (row) => {
    setFormData(row);       // Load row into form
    setEditForm(row);       // Optionally track current editing row
    window.scrollTo(0, 0);  // Scroll to form
  };
console.log(formData.pfChallan);
  return (
    <>
    {
      loading && <Loader/> 
}
  {
    displayOfferLetter ? (
    <IssueOfferLetter propOfDataFromOfferForm={offerLetterData}/>
    ) : (
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
       
      />
    </label>
  </div>
))}

      
<h2 className="h2classnameforformcomapnyofferform">Candidate Onboarding Form</h2>
{[
  { label: "Full Name", name: "fullName"},
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
        value={formData[name]?? ""}
        onChange={handleInputChange}
        required={name === "fullName"}
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
    value={formData.remarks ?? ""}
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
        value={formData[name] ?? ""}
        onChange={handleInputChange}
        
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
        value={formData[name] ?? ""}
        onChange={handleInputChange}
        
      />
    </label>
  </div>
))}
      <label className="formlabelforcompanyofferform">
        Recruiter Name:
        <input className="inputantsametextareastyleforcompanyofferform"
          type="text"
          name="recruiterName"
          value={formData.recruiterName ?? ""}
          onChange={handleInputChange}
          
        />
      </label>
      <label className="formlabelforcompanyofferform">
        Candidate Name:
        <input className="inputantsametextareastyleforcompanyofferform"
          type="text"
          name="candidateName"
          value={formData.candidateName ?? ""}
          onChange={handleInputChange}
          
        />
      </label>
      <label className="formlabelforcompanyofferform">
        BGB Comment:
        <textarea className="textareaclassnameforcompanyofferform inputantsametextareastyleforcompanyofferform"
          name="bgbComment"
          value={formData.bgbComment ?? ""}
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
        value={formData[name] ?? ""}
        onChange={handleInputChange}
        
      />
    </label>
  </div>
))}

<label className="formlabelforcompanyofferform">
  Policy Terms:
  <textarea className="textareaclassnameforcompanyofferform inputantsametextareastyleforcompanyofferform"
    name="policyTerms"
    value={formData.policyTerms ?? ""}
    onChange={handleInputChange}
  />
</label>

<label className="formlabelforcompanyofferform">
  Upload Insurance Card:
  <input className="inputantsametextareastyleforcompanyofferform"
    type="file"
    name="insuranceCard"
    onChange={handleFileChange}
    
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
        value={formData[name] ?? ""}
        onChange={handleInputChange}
        
      />
    </label>
  </div>
))}
      </div>
 </div>
      <button className="lineUp-Filter-btn" type="submit" onClick={handleSubmit}>Submit</button>
      <button onClick={() => setFormData({})}>Cancel</button>

    </form>
    </div>

{/* table start */}
<div>
      <h2 className="h2classnameforformcomapnyofferform">Candidate, Bank, Service/Invoice & Health Insurance Data</h2>
      <div className="attendanceTableData">
      <table className="attendance-table">
        <thead>
          <tr className="attendancerows-head">
          <th  className="attendanceheading">Sr. No.</th>
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
            <th  className="attendanceheading">Action</th>
            <th  className="attendanceheading">Update</th>
            <th  className="attendanceheading">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="attendancerows">
                <td  className="tabledata">{index+1}</td>
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
      <DownloadCloudIcon/>
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
           <DownloadCloudIcon/>
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
           <DownloadCloudIcon/>
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
           <DownloadCloudIcon/>
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
           <DownloadCloudIcon/>
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
           <DownloadCloudIcon/>
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
           <DownloadCloudIcon/>
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
           <DownloadCloudIcon/>
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
                 <td  className="tabledata" onClick={()=>handleOpenOfferLetter(row)}><i className="fa-regular fa-pen-to-square"></i></td>
                <td className="tabledata">
  <button onClick={() => handleUpdate(row)}>Update</button>
</td>
<td className="tabledata">
  <button onClick={() => handleDelete(row, userType, userId)}>Delete</button>
</td>
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
    )
  }
    </>

  );
};



export default UnifiedFormComponent;
