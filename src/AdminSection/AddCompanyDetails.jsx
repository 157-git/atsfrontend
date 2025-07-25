import React, { useEffect, useState } from "react";
import "./AddCompany.css";
import jsPDF from "jspdf";
import Modal from "react-bootstrap/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import { Empty } from "antd";
import { EditOutlined } from "@ant-design/icons";

// const AddCompanyDetails = () => {
//   /*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_11*/
//   const { employeeId } = useParams();
//   const [showEmailButton, setShowEmailButton] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [addedCompanyDetailsId, setAddedCompanyDetailsId] = useState(null);
//   const [onOptionChange, setOnOptionChange] = useState(null);
//   const [latestAddedData, setLatestAddedCompanyData] = useState();
//   const [response, setResponse] = useState("");
//   const [responseError, setResponseError] = useState("");
//   const [initialFormData, setInitialFormData] = useState({
//     companyName: "",
//     companyLogoImg: null,
//     companyAddress: "",
//     companyDisplayName: "",
//     companyWebsite: "",
//     companyServices: "",
//     tlInformation: "",
//     sop: "",
//     charges: "",
//     contactNumber: "",
//     aboutUs: "",
//     companyPanCardImg: null,
//     companyPanCardNumber: "",
//     companyTanNumberImg: null,
//     tanNumber: "",
//     incorporationCertificateImg: null,
//     incorporationCertificateNumber: "",
//     cinImg: null,
//     cinNumber: "",
//     dinImg: null,
//     dinNumber: "",
//     udyamCertificateNumberImg: null,
//     udyamCertificateNumber: "",
//     shopActCertificateImg: null,
//     shopActCertificateNumber: "",
//     cgst: "",
//     sgst: "",
//     igst: "",
//     totalGst: "",
//     grandTotal: "",
//     pfCertificateImg: null,
//     pfCertificateNumber: "",
//     professionalTaxCertificateImg: null,
//     professionalTaxCertificateNumber: "",
//     moaCertificateImg: null,
//     moaCertificateNumber: "",
//     aoaCertificateImg: null,
//     aoaCertificateNumber: "",
//     rocCertificateImg: null,
//     rocCertificateNumber: "",
//     bankHolderName: "",
//     branchName: "",
//     accountNumber: "",
//     ifscCode: "",
//     micrNumber: "",
//     companyEmail: "",
//   });

//   const fetchPreviousCompanyDetailsId = async () => {
//     const response = await axios.get(`${API_BASE_URL}/fetch-details-ids`);
//     if (addedCompanyDetailsId < response.data.length) {
//       setLatestAddedCompanyData(response.data[0]);
//     }
//     setAddedCompanyDetailsId(response.data);
//   };
//   useEffect(() => {
//     fetchPreviousCompanyDetailsId();
//   }, []);

//   const handleSelectChange = (e) => {
//     setShowEmailButton(true);
//     const selectedValue = e.target.value;
//     setOnOptionChange(selectedValue);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setInitialFormData({ ...initialFormData, [name]: files[0] });
//     } else {
//       setInitialFormData({ ...initialFormData, [name]: value });
//     }
//   };

//   const generatePdf = (formData) => {
//     const doc = new jsPDF();

//     // Set a smaller font size and reduce line height
//     const fontSize = 12; // Adjust as needed
//     const lineHeightFactor = 0.7; // Adjust line height factor to reduce padding
//     doc.setFontSize(fontSize);

//     // Company details
//     let yPos = 10;
//     doc.text(`Company Name: ${formData.companyName || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Company Address: ${formData.companyAddress || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(
//       `Company Display Name: ${formData.companyDisplayName || ""}`,
//       10,
//       yPos
//     );
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Company Website: ${formData.companyWebsite || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Company Services: ${formData.companyServices || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`TL Information: ${formData.tlInformation || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`SOP: ${formData.sop || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Charges: ${formData.charges || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Contact Number: ${formData.contactNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`About Us: ${formData.aboutUs || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;

//     // Legal details
//     doc.text(`Company PAN: ${formData.companyPanCardNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Company TAN: ${formData.tanNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`CIN: ${formData.cinNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`DIN: ${formData.dinNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;

//     // Certificates and taxes
//     doc.text(
//       `Udyam Certificate: ${formData.udyamCertificateNumber || ""}`,
//       10,
//       yPos
//     );
//     yPos += fontSize * lineHeightFactor;
//     doc.text(
//       `Shopact Certificate: ${formData.shopActCertificateNumber || ""}`,
//       10,
//       yPos
//     );
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`CGST: ${formData.cgst || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`SGST: ${formData.sgst || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`IGST: ${formData.igst || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Total GST: ${formData.totalGst || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Grand Total: ${formData.grandTotal || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;

//     // Financial details
//     doc.text(`PF Certificate: ${formData.pfCertificateNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(
//       `Professional Tax Certificate: ${
//         formData.professionalTaxCertificateNumber || ""
//       }`,
//       10,
//       yPos
//     );
//     yPos += fontSize * lineHeightFactor;
//     doc.text(
//       `MOA Certificate: ${formData.moaCertificateNumber || ""}`,
//       10,
//       yPos
//     );
//     yPos += fontSize * lineHeightFactor;
//     doc.text(
//       `AOA Certificate: ${formData.aoaCertificateNumber || ""}`,
//       10,
//       yPos
//     );
//     yPos += fontSize * lineHeightFactor;
//     doc.text(
//       `ROC Certificate: ${formData.rocCertificateNumber || ""}`,
//       10,
//       yPos
//     );
//     yPos += fontSize * lineHeightFactor;

//     // Bank details
//     doc.text(`Bank Name: ${formData.bankHolderName || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Branch Name: ${formData.branchName || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Account Number: ${formData.accountNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`IFSC Code: ${formData.ifscCode || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`MICR Number: ${formData.micrNumber || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;
//     doc.text(`Email: ${formData.companyEmail || ""}`, 10, yPos);
//     yPos += fontSize * lineHeightFactor;

//     // Save the PDF
//     doc.save("company-details.pdf");

//     // Convert PDF to Blob and return
//     const pdfBytes = doc.output("arraybuffer");
//     return new Blob([pdfBytes], { type: "application/pdf" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Generate the PDF blob
//     const pdfBlob = generatePdf(initialFormData);
//     initialFormData.detailsPdf = pdfBlob;
//     console.log(initialFormData);
//     try {
//       // Send the form data to the backend
//       const response = await axios.post(
//         `${API_BASE_URL}/save-our-company`,
//         initialFormData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Ensure correct content type for form data
//           },
//         }
//       );

//       if (response.status === 200) {
//         setResponse(response.data);
//         setShowEmailButton(true);
//         fetchPreviousCompanyDetailsId();
//         setInitialFormData({});
//         // Create the PDF if the submission is successful
//       } else {
//         setResponseError(response.data);
//       }
//     } catch (error) {
//       console.error("Error submitting form data", error);
//     }
//   };
//   const handleClose = () => {
//     setShowModal(false);
//     setOnOptionChange(null);
//   };
//   /*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_170*/
//   return (
//     <>
//       <main className="ACD-desc">
//         <section className="ACD-performance">
//           <form onSubmit={handleSubmit}>
//             {/* <center>
//               <h1>Add Our Company Information</h1>
//             </center> */}
//             <div className="ACD-desc-form">
//               {/* Align AddJob  Description name center and changing color to gray */}
//               <h2 className="text-center text-[20px] text-gray-500 py-2">
//                 Add Client Details
//               </h2>
//               <div className="ACD_Field-column">
//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label>Company Name</label>
//                     <input
//                       type="text"
//                       name="companyName"
//                       placeholder="Enter Company Name"
//                       value={initialFormData.companyName}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Company Logo</label>
//                     <input
//                       type="file"
//                       name="companyLogoImg"
//                       onChange={handleChange}
//                       className="uploadcompanydocs"
//                       style={{ width: "50%" }}
//                       accept=".pdf"
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label>Company Address</label>
//                     <input
//                       type="text"
//                       name="companyAddress"
//                       placeholder="Company Address"
//                       value={initialFormData.companyAddress}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Company Display Name</label>
//                     <input
//                       type="text"
//                       name="companyDisplayName"
//                       placeholder="Company Display Name"
//                       value={initialFormData.companyDisplayName}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label>Company Website</label>
//                     <input
//                       type="text"
//                       name="companyWebsite"
//                       placeholder="Company Website"
//                       value={initialFormData.companyWebsite}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Company Services</label>
//                     <input
//                       type="text"
//                       name="companyServices"
//                       placeholder="Enter Company Services"
//                       value={initialFormData.companyServices}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label>TL Information</label>
//                     <input
//                       type="text"
//                       name="tlInformation"
//                       placeholder="Enter TL Information"
//                       value={initialFormData.tlInformation}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Company SOP</label>
//                     <input
//                       type="text"
//                       name="sop"
//                       placeholder="Enter SOP"
//                       value={initialFormData.sop}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label>Company Charges</label>
//                     <input
//                       type="text"
//                       name="charges"
//                       placeholder="Charges"
//                       value={initialFormData.charges}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Contact Number</label>
//                     <input
//                       type="text"
//                       name="contactNumber"
//                       placeholder="Enter Contact Number"
//                       value={initialFormData.contactNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label>About us</label>
//                     <input
//                       type="text"
//                       name="aboutUs"
//                       placeholder="About Us"
//                       value={initialFormData.aboutUs}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label htmlFor="companyemail">Company Email</label>
//                     <input
//                       type="email"
//                       name="companyemail"
//                       id=""
//                       value={initialFormData.email}
//                       placeholder="Enter Company Email Id"
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label>Upload Pancard</label>
//                     <input
//                       type="file"
//                       name="companyPanCardImg"
//                       onChange={handleChange}
//                       className="uploadcompanydocs"
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label> Enter Pan Card No</label>
//                     <input
//                       type="text"
//                       placeholder="Enter Pan Card No."
//                       name="companyPanCardNumber"
//                       value={initialFormData.companyPanCardNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label>Upload TAN </label>
//                     <input
//                       type="file"
//                       name="companyTanNumberImg"
//                       onChange={handleChange}
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter TAN Number</label>
//                     <input
//                       type="text"
//                       placeholder="Enter TAN No."
//                       name="tanNumber"
//                       value={initialFormData.tanNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label>Upload Incarporation certificate</label>
//                     <input
//                       type="file"
//                       name="incorporationCertificateImg"
//                       onChange={handleChange}
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter Incarporation Number</label>
//                     <input
//                       type="text"
//                       placeholder="Enter In No."
//                       name="incorporationCertificateNumber"
//                       value={initialFormData.incorporationCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label> Upload CIN</label>
//                     <input
//                       type="file"
//                       name="cinImg"
//                       onChange={handleChange}
//                       className="uploadcompanydocs"
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter CIN No</label>
//                     <input
//                       type="text"
//                       placeholder="Enter CIN No."
//                       name="cinNumber"
//                       value={initialFormData.cinNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label> Upload DIN</label>
//                     <input
//                       className="uploadcompanydocs"
//                       type="file"
//                       name="dinImg"
//                       onChange={handleChange}
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter DIN NO</label>
//                     <input
//                       type="text"
//                       placeholder="Enter DIN No."
//                       name="dinNumber"
//                       value={initialFormData.dinNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label> Upload Udyam Certificate</label>
//                     <input
//                       className="uploadcompanydocs"
//                       type="file"
//                       name="udyamCertificateNumberImg"
//                       onChange={handleChange}
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter Udyam No</label>
//                     <input
//                       type="text"
//                       placeholder="Enter Udyam Certificate No."
//                       name="udyamCertificateNumber"
//                       value={initialFormData.udyamCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label> Professional tax Certificate</label>

//                     <input
//                       type="file"
//                       className="uploadcompanydocs"
//                       name="professionalTaxCertificateImg"
//                       onChange={handleChange}
//                       placeholder=""
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label> Enter PTC No</label>
//                     <input
//                       type="text"
//                       name="professionalTaxCertificateNumber"
//                       placeholder="Enter PTC Certificate No."
//                       value={initialFormData.professionalTaxCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label> Upload Shopact Certificate</label>
//                     <input
//                       type="file"
//                       name="shopActCertificateImg"
//                       onChange={handleChange}
//                       className="uploadcompanydocs"
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label> Enter Shopact Certificate</label>
//                     <input
//                       type="text"
//                       placeholder="Enter Shopact Certificate No."
//                       name="shopActCertificateNumber"
//                       value={initialFormData.shopActCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label> Upload PF Certificate</label>
//                     <input
//                       type="file"
//                       name="pfCertificateImg"
//                       onChange={handleChange}
//                       className="uploadcompanydocs"
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter PF Certificate No</label>
//                     <input
//                       type="text"
//                       placeholder="Enter PF Certificate No."
//                       name="pfCertificateNumber"
//                       value={initialFormData.pfCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label>Upload MOA Certificate</label>
//                     {/* Memorandum of Association Certification */}
//                     <input
//                       type="file"
//                       name="moaCertificateImg"
//                       placeholder=""
//                       onChange={handleChange}
//                       className="uploadcompanydocs"
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter MOA Certificate No</label>
//                     <input
//                       type="text"
//                       name="moaCertificateNumber"
//                       placeholder="Enter MOA No."
//                       value={initialFormData.moaCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label> Upload AOA Certificate</label>
//                     <input
//                       type="file"
//                       name="aoaCertificateImg"
//                       onChange={handleChange}
//                       className="uploadcompanydocs"
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label> Enter AOA Certificate No</label>
//                     <input
//                       type="text"
//                       name="aoaCertificateNumber"
//                       placeholder="Enter AOA Certificate No."
//                       value={initialFormData.aoaCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label>Upload ROC Certificate</label>
//                     <input
//                       type="file"
//                       name="rocCertificateImg"
//                       onChange={handleChange}
//                       placeholder=" "
//                       className="uploadcompanydocs"
//                       accept=".pdf"
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Enter ROC Certificate</label>
//                     <input
//                       type="text"
//                       name="rocCertificateNumber"
//                       placeholder="Enter ROC Certificate No."
//                       value={initialFormData.rocCertificateNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-white">
//                   <div className="ACD_Field">
//                     <label>CGST</label>
//                     <input
//                       type="text"
//                       name="cgst"
//                       placeholder="Cgst"
//                       value={initialFormData.cgst}
//                       onChange={handleChange}
//                     />
//                     <label>SGST</label>
//                     <input
//                       type="text"
//                       name="sgst"
//                       placeholder="Sgst"
//                       value={initialFormData.sgst}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>IGST NO</label>
//                     <input
//                       type="text"
//                       name="igst"
//                       placeholder="Igst No"
//                       value={initialFormData.igst}
//                       onChange={handleChange}
//                     />
//                     <label>Total Gst</label>
//                     <input
//                       type="text"
//                       name="totalGst"
//                       placeholder="Total Gst"
//                       value={initialFormData.totalGst}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="ACD_Field-Row-Gray">
//                   <div className="ACD_Field">
//                     <label>Grand Total</label>
//                     <input
//                       type="text"
//                       name="grandTotal"
//                       placeholder="Grand Total"
//                       value={initialFormData.grandTotal}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>Bank Details</label>
//                     <input
//                       type="text"
//                       name="bankHolderName"
//                       placeholder=" Holder"
//                       value={initialFormData.bankHolderName}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div
//                   className="ACD_Field-Row-white"
//                   style={{ borderBottom: "1px solid gray" }}
//                 >
//                   <div className="ACD_Field">
//                     <label htmlFor="">Branch Name</label>
//                     <input
//                       type="text"
//                       name="branchName"
//                       placeholder="Enter Bank Branch Name."
//                       value={initialFormData.branchName}
//                       onChange={handleChange}
//                     />
//                     <label>Account Number </label>
//                     <input
//                       type="text"
//                       name="accountNumber"
//                       placeholder="Enter Account No."
//                       value={initialFormData.accountNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="ACD_Field">
//                     <label>IFSC</label>
//                     <input
//                       type="text"
//                       name="ifscCode"
//                       placeholder=" Enter IFSC Code"
//                       value={initialFormData.ifscCode}
//                       onChange={handleChange}
//                     />

//                     <label>MICR No</label>
//                     <input
//                       type="text"
//                       name="micrNumber"
//                       placeholder="Enter MICR No."
//                       value={initialFormData.micrNumber}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="ACD_buttons">
//               <button className="addcompanybutton" type="submit">
//                 Add Details
//               </button>

//               {addedCompanyDetailsId != null && (
//                 <select
//                   id="previousId"
//                   className="addcompanybutton"
//                   onChange={handleSelectChange}
//                 >
//                   <option value="">Select Previous Id</option>
//                   {addedCompanyDetailsId.map((item, index) => (
//                     <option key={index} value={item}>
//                       {item}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {(onOptionChange != null || showEmailButton) && (
//                 <button
//                   className="addcompanybutton"
//                   type="button"
//                   onClick={() => setShowModal(true)}
//                 >
//                   Send Email
//                 </button>
//               )}
//             </div>
//           </form>
//           <center>
//             {response != "" && (
//               <div class="alert alert-success" role="alert">
//                 {response}
//               </div>
//             )}
//             {responseError != "" && (
//               <div class="alert alert-danger" role="alert">
//                 {responseError}
//               </div>
//             )}
//           </center>
//         </section>
//       </main>
//       {/*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_737-740*/}
//       {showModal && (
//         <SendEmailPopup
//           show={showModal}
//           handleClose={handleClose}
//           onOptionChange={onOptionChange}
//           latestAddedData={latestAddedData}
//           employeeId={employeeId}
//         />
//       )}
//     </>
//   );
// };


const AddCompanyDetails = () => {
  /*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_11*/
  const { employeeId, userType } = useParams();
  const [showEmailButton, setShowEmailButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addedCompanyDetailsId, setAddedCompanyDetailsId] = useState(null);
  const [onOptionChange, setOnOptionChange] = useState(null);
  const [latestAddedData, setLatestAddedCompanyData] = useState();
  const [response, setResponse] = useState("");
  const [responseError, setResponseError] = useState("");
  const [clientsList, setClientsList]= useState([]);
  const [initialFormData, setInitialFormData] = useState({
    companyName: "",
    companyLogoImg: null,
    companyAddress: "",
    companyDisplayName: "",
    companyWebsite: "",
    companyServices: "",
    tlInformation: "",
    sop: "",
    charges: "",
    contactNumber: "",
    aboutUs: "",
    companyPanCardImg: null,
    companyPanCardNumber: "",
    companyTanNumberImg: null,
    tanNumber: "",
    incorporationCertificateImg: null,
    incorporationCertificateNumber: "",
    cinImg: null,
    cinNumber: "",
    dinImg: null,
    dinNumber: "",
    udyamCertificateNumberImg: null,
    udyamCertificateNumber: "",
    shopActCertificateImg: null,
    shopActCertificateNumber: "",
    cgst: "",
    sgst: "",
    igst: "",
    totalGst: "",
    grandTotal: "",
    pfCertificateImg: null,
    pfCertificateNumber: "",
    professionalTaxCertificateImg: null,
    professionalTaxCertificateNumber: "",
    moaCertificateImg: null,
    moaCertificateNumber: "",
    aoaCertificateImg: null,
    aoaCertificateNumber: "",
    rocCertificateImg: null,
    rocCertificateNumber: "",
    bankHolderName: "",
    branchName: "",
    accountNumber: "",
    ifscCode: "",
    micrNumber: "",
    companyEmail: "",
  });

  const fetchPreviousCompanyDetailsId = async () => {
    const response = await axios.get(`${API_BASE_URL}/save/${employeeId}`);
    if (addedCompanyDetailsId < response.data.length) {
      setLatestAddedCompanyData(response.data[0]);
    }
    setAddedCompanyDetailsId(response.data);
  };

  const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // data:*/*;base64,...
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // strip off "data:application/pdf;base64,"
      resolve(base64);
    };
    reader.onerror = reject;
  });

  useEffect(() => {
    fetchPreviousCompanyDetailsId();
  }, []);

  const handleSelectChange = (e) => {
    setShowEmailButton(true);
    const selectedValue = e.target.value;
    setOnOptionChange(selectedValue);
  };
// Nikita Shirsath : 4-07-2025

  const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Remove prefix
      setInitialFormData((prevData) => ({
        ...prevData,
        [name]: base64String, // Store as Base64 string
      }));
    };
    reader.readAsDataURL(file);
  } else {
    setInitialFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};


  const generatePdf = (formData) => {
    const doc = new jsPDF();

    // Set a smaller font size and reduce line height
    const fontSize = 12; // Adjust as needed
    const lineHeightFactor = 0.7; // Adjust line height factor to reduce padding
    doc.setFontSize(fontSize);

    // Company details
    let yPos = 10;
    doc.text(`Company Name: ${formData.companyName || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Company Address: ${formData.companyAddress || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(
      `Company Display Name: ${formData.companyDisplayName || ""}`,
      10,
      yPos
    );
    yPos += fontSize * lineHeightFactor;
    doc.text(`Company Website: ${formData.companyWebsite || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Company Services: ${formData.companyServices || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`TL Information: ${formData.tlInformation || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`SOP: ${formData.sop || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Charges: ${formData.charges || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Contact Number: ${formData.contactNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`About Us: ${formData.aboutUs || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;

    // Legal details
    doc.text(`Company PAN: ${formData.companyPanCardNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Company TAN: ${formData.tanNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`CIN: ${formData.cinNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`DIN: ${formData.dinNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;

    // Certificates and taxes
    doc.text(
      `Udyam Certificate: ${formData.udyamCertificateNumber || ""}`,
      10,
      yPos
    );
    yPos += fontSize * lineHeightFactor;
    doc.text(
      `Shopact Certificate: ${formData.shopActCertificateNumber || ""}`,
      10,
      yPos
    );
    yPos += fontSize * lineHeightFactor;
    doc.text(`CGST: ${formData.cgst || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`SGST: ${formData.sgst || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`IGST: ${formData.igst || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Total GST: ${formData.totalGst || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Grand Total: ${formData.grandTotal || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;

    // Financial details
    doc.text(`PF Certificate: ${formData.pfCertificateNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(
      `Professional Tax Certificate: ${
        formData.professionalTaxCertificateNumber || ""
      }`,
      10,
      yPos
    );
    yPos += fontSize * lineHeightFactor;
    doc.text(
      `MOA Certificate: ${formData.moaCertificateNumber || ""}`,
      10,
      yPos
    );
    yPos += fontSize * lineHeightFactor;
    doc.text(
      `AOA Certificate: ${formData.aoaCertificateNumber || ""}`,
      10,
      yPos
    );
    yPos += fontSize * lineHeightFactor;
    doc.text(
      `ROC Certificate: ${formData.rocCertificateNumber || ""}`,
      10,
      yPos
    );
    yPos += fontSize * lineHeightFactor;

    // Bank details
    doc.text(`Bank Name: ${formData.bankHolderName || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Branch Name: ${formData.branchName || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Account Number: ${formData.accountNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`IFSC Code: ${formData.ifscCode || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`MICR Number: ${formData.micrNumber || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;
    doc.text(`Company Email: ${formData.companyEmail || ""}`, 10, yPos);
    yPos += fontSize * lineHeightFactor;

    // Save the PDF
    doc.save("company-details.pdf");

    // Convert PDF to Blob and return
    const pdfBytes = doc.output("arraybuffer");
    return new Blob([pdfBytes], { type: "application/pdf" });
  };

  // Nikita Shirsath : 04-07-2025
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      companyName: initialFormData.companyName,
      companyAddress: initialFormData.companyAddress,
      companyWebsite: initialFormData.companyWebsite,
      tlInformation: initialFormData.tlInformation,
      companyCharges: initialFormData.charges,
      aboutUs: initialFormData.aboutUs,
      companyDisplayName: initialFormData.companyDisplayName,
      companyServices: initialFormData.companyServices,
      companySOP: initialFormData.sop,
      contactNumber: initialFormData.contactNumber,
      companyEmail: initialFormData.companyEmail,

      companyLogo: initialFormData.companyLogoImg,
      pancardFile: initialFormData.companyPanCardImg,
      pancardNumber: initialFormData.companyPanCardNumber,

      tanFile: initialFormData.companyTanNumberImg,
      tanNumber: initialFormData.tanNumber,

      incorporationFile: initialFormData.incorporationCertificateImg,
      incorporationNumber: initialFormData.incorporationCertificateNumber,

      cinFile: initialFormData.cinImg,
      cinNumber: initialFormData.cinNumber,

      dinFile: initialFormData.dinImg,
      dinNumber: initialFormData.dinNumber,

      udyamFile: initialFormData.udyamCertificateNumberImg,
      udyamNumber: initialFormData.udyamCertificateNumber,

      professionalTaxFile: initialFormData.professionalTaxCertificateImg,
      professionalTaxNumber: initialFormData.professionalTaxCertificateNumber,

      shopactFile: initialFormData.shopActCertificateImg,
      shopactNumber: initialFormData.shopActCertificateNumber,

      pfFile: initialFormData.pfCertificateImg,
      pfNumber: initialFormData.pfCertificateNumber,

      moaFile: initialFormData.moaCertificateImg,
      moaNumber: initialFormData.moaCertificateNumber,

      aoaFile: initialFormData.aoaCertificateImg,
      aoaNumber: initialFormData.aoaCertificateNumber,

      rocFile: initialFormData.rocCertificateImg,
      rocNumber: initialFormData.rocCertificateNumber,

      cgst: initialFormData.cgst,
      sgst: initialFormData.sgst,
      igstNo: initialFormData.igst,
      totalGst: initialFormData.totalGst,

      bankName: initialFormData.bankHolderName,
      branchName: initialFormData.branchName,
      accountNumber: initialFormData.accountNumber,
      ifscCode: initialFormData.ifscCode,
      micrNo: initialFormData.micrNumber,
    };
    console.log(payload);
    
    const res = await axios.post(
      `${API_BASE_URL}/saveClientByManagerId/${employeeId}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.status === 200 || res.status === 201) {
      alert("Client saved successfully!");
      
      setInitialFormData({}); // Clear form
      fetchClientDetailsList();
    }
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Error occurred while saving");
  }
};


  const handleClose = () => {
    setShowModal(false);
    setOnOptionChange(null);
  };



  const fetchClientDetailsList = async ()=>{
    try {
       const resp = await axios.get(`${API_BASE_URL}/getClientByManagerId/${employeeId}`);
    if (resp.status === 200 || resp.status === 201) {
      setClientsList(resp.data);
    }
    } catch (error) {
      console.log(error);
    }
  }  
  
  useEffect(()=>{
fetchClientDetailsList();
  },[]);

  /*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_170*/
  return (
    <>
      <main className="ACD-desc">
        <section className="ACD-performance">
          <form onSubmit={handleSubmit}>
            {/* <center>
              <h1>Add Our Company Information</h1>
            </center> */}
            <div className="ACD-desc-form">
              {/* Align AddJob  Description name center and changing color to gray */}
              <h2 className="text-center text-[20px] text-gray-500 py-2">
                Add Client Details
              </h2>
              <div className="ACD_Field-column">
                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Enter Company Name"
                      value={initialFormData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Company Logo</label>
                    <input
                      type="file"
                      name="companyLogoImg"
                      onChange={handleChange}
                      className="uploadcompanydocs"
                      style={{ width: "50%" }}
                      accept=".pdf"
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label>Company Address</label>
                    <input
                      type="text"
                      name="companyAddress"
                      placeholder="Company Address"
                      value={initialFormData.companyAddress}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Company Display Name</label>
                    <input
                      type="text"
                      name="companyDisplayName"
                      placeholder="Company Display Name"
                      value={initialFormData.companyDisplayName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label>Company Website</label>
                    <input
                      type="text"
                      name="companyWebsite"
                      placeholder="Company Website"
                      value={initialFormData.companyWebsite}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Company Services</label>
                    <input
                      type="text"
                      name="companyServices"
                      placeholder="Enter Company Services"
                      value={initialFormData.companyServices}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label>TL Information</label>
                    <input
                      type="text"
                      name="tlInformation"
                      placeholder="Enter TL Information"
                      value={initialFormData.tlInformation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Company SOP</label>
                    <input
                      type="text"
                      name="sop"
                      placeholder="Enter SOP"
                      value={initialFormData.sop}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label>Company Charges</label>
                    <input
                      type="text"
                      name="charges"
                      placeholder="Charges"
                      value={initialFormData.charges}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Contact Number</label>
                    <input
                      type="text"
                      name="contactNumber"
                      placeholder="Enter Contact Number"
                      value={initialFormData.contactNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label>About us</label>
                    <input
                      type="text"
                      name="aboutUs"
                      placeholder="About Us"
                      value={initialFormData.aboutUs}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Nikita Shirsath : 04-07-2025 */}

                  <div className="ACD_Field">
                    <label>Company Email</label>
                    <input
                      type="email"
                      name="companyEmail"
                      onChange={handleChange}
                      value={initialFormData.companyEmail}
                      placeholder="Enter Company Email Id"
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label>Upload Pancard</label>
                    <input
                      type="file"
                      name="companyPanCardImg"
                      onChange={handleChange}
                      className="uploadcompanydocs"
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label> Enter Pan Card No</label>
                    <input
                      type="text"
                      placeholder="Enter Pan Card No."
                      name="companyPanCardNumber"
                      value={initialFormData.companyPanCardNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label>Upload TAN </label>
                    <input
                      type="file"
                      name="companyTanNumberImg"
                      onChange={handleChange}
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter TAN Number</label>
                    <input
                      type="text"
                      placeholder="Enter TAN No."
                      name="tanNumber"
                      value={initialFormData.tanNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label>Upload Incarporation certificate</label>
                    <input
                      type="file"
                      name="incorporationCertificateImg"
                      onChange={handleChange}
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter Incarporation Number</label>
                    <input
                      type="text"
                      placeholder="Enter In No."
                      name="incorporationCertificateNumber"
                      value={initialFormData.incorporationCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label> Upload CIN</label>
                    <input
                      type="file"
                      name="cinImg"
                      onChange={handleChange}
                      className="uploadcompanydocs"
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter CIN No</label>
                    <input
                      type="text"
                      placeholder="Enter CIN No."
                      name="cinNumber"
                      value={initialFormData.cinNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label> Upload DIN</label>
                    <input
                      className="uploadcompanydocs"
                      type="file"
                      name="dinImg"
                      onChange={handleChange}
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter DIN NO</label>
                    <input
                      type="text"
                      placeholder="Enter DIN No."
                      name="dinNumber"
                      value={initialFormData.dinNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label> Upload Udyam Certificate</label>
                    <input
                      className="uploadcompanydocs"
                      type="file"
                      name="udyamCertificateNumberImg"
                      onChange={handleChange}
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter Udyam No</label>
                    <input
                      type="text"
                      placeholder="Enter Udyam Certificate No."
                      name="udyamCertificateNumber"
                      value={initialFormData.udyamCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label> Professional tax Certificate</label>

                    <input
                      type="file"
                      className="uploadcompanydocs"
                      name="professionalTaxCertificateImg"
                      onChange={handleChange}
                      placeholder=""
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label> Enter PTC No</label>
                    <input
                      type="text"
                      name="professionalTaxCertificateNumber"
                      placeholder="Enter PTC Certificate No."
                      value={initialFormData.professionalTaxCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label> Upload Shopact Certificate</label>
                    <input
                      type="file"
                      name="shopActCertificateImg"
                      onChange={handleChange}
                      className="uploadcompanydocs"
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label> Enter Shopact Certificate</label>
                    <input
                      type="text"
                      placeholder="Enter Shopact Certificate No."
                      name="shopActCertificateNumber"
                      value={initialFormData.shopActCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label> Upload PF Certificate</label>
                    <input
                      type="file"
                      name="pfCertificateImg"
                      onChange={handleChange}
                      className="uploadcompanydocs"
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter PF Certificate No</label>
                    <input
                      type="text"
                      placeholder="Enter PF Certificate No."
                      name="pfCertificateNumber"
                      value={initialFormData.pfCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label>Upload MOA Certificate</label>
                    {/* Memorandum of Association Certification */}
                    <input
                      type="file"
                      name="moaCertificateImg"
                      placeholder=""
                      onChange={handleChange}
                      className="uploadcompanydocs"
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter MOA Certificate No</label>
                    <input
                      type="text"
                      name="moaCertificateNumber"
                      placeholder="Enter MOA No."
                      value={initialFormData.moaCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label> Upload AOA Certificate</label>
                    <input
                      type="file"
                      name="aoaCertificateImg"
                      onChange={handleChange}
                      className="uploadcompanydocs"
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label> Enter AOA Certificate No</label>
                    <input
                      type="text"
                      name="aoaCertificateNumber"
                      placeholder="Enter AOA Certificate No."
                      value={initialFormData.aoaCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label>Upload ROC Certificate</label>
                    <input
                      type="file"
                      name="rocCertificateImg"
                      onChange={handleChange}
                      placeholder=" "
                      className="uploadcompanydocs"
                      accept=".pdf"
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Enter ROC Certificate</label>
                    <input
                      type="text"
                      name="rocCertificateNumber"
                      placeholder="Enter ROC Certificate No."
                      value={initialFormData.rocCertificateNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-white">
                  <div className="ACD_Field">
                    <label>CGST</label>
                    <input
                      type="text"
                      name="cgst"
                      placeholder="Cgst"
                      value={initialFormData.cgst}
                      onChange={handleChange}
                    />
                    <label>SGST</label>
                    <input
                      type="text"
                      name="sgst"
                      placeholder="Sgst"
                      value={initialFormData.sgst}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>IGST NO</label>
                    <input
                      type="text"
                      name="igst"
                      placeholder="Igst No"
                      value={initialFormData.igst}
                      onChange={handleChange}
                    />
                    <label>Total Gst</label>
                    <input
                      type="text"
                      name="totalGst"
                      placeholder="Total Gst"
                      value={initialFormData.totalGst}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="ACD_Field-Row-Gray">
                  <div className="ACD_Field">
                    <label>Grand Total</label>
                    <input
                      type="text"
                      name="grandTotal"
                      placeholder="Grand Total"
                      value={initialFormData.grandTotal}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>Bank Details</label>
                    <input
                      type="text"
                      name="bankHolderName"
                      placeholder=" Holder"
                      value={initialFormData.bankHolderName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div
                  className="ACD_Field-Row-white"
                  style={{ borderBottom: "1px solid gray" }}
                >
                  <div className="ACD_Field">
                    <label htmlFor="">Branch Name</label>
                    <input
                      type="text"
                      name="branchName"
                      placeholder="Enter Bank Branch Name."
                      value={initialFormData.branchName}
                      onChange={handleChange}
                    />
                    <label>Account Number </label>
                    <input
                      type="text"
                      name="accountNumber"
                      placeholder="Enter Account No."
                      value={initialFormData.accountNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ACD_Field">
                    <label>IFSC</label>
                    <input
                      type="text"
                      name="ifscCode"
                      placeholder=" Enter IFSC Code"
                      value={initialFormData.ifscCode}
                      onChange={handleChange}
                    />

                    <label>MICR No</label>
                    <input
                      type="text"
                      name="micrNumber"
                      placeholder="Enter MICR No."
                      value={initialFormData.micrNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="ACD_buttons">
              <button className="addcompanybutton" type="submit">
                Add Details
              </button>

              {addedCompanyDetailsId != null && (
                <select
                  id="previousId"
                  className="addcompanybutton"
                  onChange={handleSelectChange}
                >
                  <option value="">Select Previous Id</option>
                  {addedCompanyDetailsId.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}

              {(onOptionChange != null || showEmailButton) && (
                <button
                  className="addcompanybutton"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  Send Email
                </button>
              )}
            </div>
          </form>
          <center>
            {response != "" && (
              <div class="alert alert-success" role="alert">
                {response}
              </div>
            )}
            {responseError != "" && (
              <div class="alert alert-danger" role="alert">
                {responseError}
              </div>
            )}
          </center>
        </section>
      </main>
      {/*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_737-740*/}
      {showModal && (
        <SendEmailPopup
          show={showModal}
          handleClose={handleClose}
          onOptionChange={onOptionChange}
          latestAddedData={latestAddedData}
          employeeId={employeeId}
        />
      )}

 {
    clientsList.length > 0 ? (
      <div className="attendanceTableData">

     
 <table className="attendance-table">
                <thead>
                  <tr className="attendancerows-head">
                  
                    <th className="attendanceheading">Company Name</th>

                    <th className="attendanceheading">Company Address</th>
                    <th className="attendanceheading">Company Website</th>
                    <th className="attendanceheading">Company Charges</th>
                    <th className="attendanceheading">Company Display Name</th>
                    <th className="attendanceheading">Company Services</th>
                    <th className="attendanceheading">companySOP</th>
                    <th className="attendanceheading">Contact Number</th>
                    <th className="attendanceheading">Company Email</th>
                    <th className="attendanceheading">Pancard Number</th>
                    <th className="attendanceheading">cinNumber</th>
                    <th className="attendanceheading">dinNumber</th>
                    <th className="attendanceheading">udyamNumber</th>
                    <th className="attendanceheading">PF Number</th>
                    <th className="attendanceheading">CGST</th>
                    <th className="attendanceheading">SGST</th>
                    <th className="attendanceheading">total Gst</th>
                    <th className="attendanceheading">Manager Name</th>

                    <th className="attendanceheading">Action</th>
                  </tr>
                </thead>

               {
               clientsList.map((item, index) => (
                      <tr key={item.id} className="attendancerows">
 <td
                          className="tabledata"
                        >
                          {
                            item.companyName
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companyName 
}                            </span>
                          </div>
                        </td>


 <td
                          className="tabledata"
                        >
                          {
                            item.companyAddress
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companyAddress 
}                            </span>
                          </div>
                        </td>

                         <td
                          className="tabledata"
                        >
                          {
                            item.companyWebsite
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companyWebsite 
}                            </span>
                          </div>
                        </td>

                            <td
                          className="tabledata"
                        >
                          {
                            item.companyCharges
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companyCharges 
}                            </span>
                          </div>
                        </td>

                             <td
                          className="tabledata"
                        >
                          {
                            item.companyDisplayName
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companyDisplayName 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.companyServices
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companyServices 
}                            </span>
                          </div>
                        </td>

                         <td
                          className="tabledata"
                        >
                          {
                            item.companySOP
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companySOP 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.contactNumber
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.contactNumber 
}                            </span>
                          </div>
                        </td>

                         <td
                          className="tabledata"
                        >
                          {
                            item.companyEmail
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.companyEmail 
}                            </span>
                          </div>
                        </td>

                         <td
                          className="tabledata"
                        >
                          {
                            item.pancardNumber
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.pancardNumber 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.cinNumber
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.cinNumber 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.dinNumber
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.dinNumber 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.udyamNumber
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.udyamNumber 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.pfNumber
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.pfNumber 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.cgst
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.cgst 
}                            </span>
                          </div>
                        </td>

                           <td
                          className="tabledata"
                        >
                          {
                            item.sgst
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.sgst 
}                            </span>
                          </div>
                        </td>

                           <td
                          className="tabledata"
                        >
                          {
                            item.totalGst
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.totalGst 
}                            </span>
                          </div>
                        </td>

                          <td
                          className="tabledata"
                        >
                          {
                            item.manager_name
                          }
                          <div className="tooltip">
                            <span className="tooltiptext">
{                                item.manager_name 
}                            </span>
                          </div>
                        </td>


                            <td
                          className="tabledata"
                        >
<EditOutlined />                        
                        </td>


</tr>
             )
             )
             
               }
            </table>

             </div>
              ):(
                <Empty/>
              )
            }




    </>
  );
};
/*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_744*/
const SendEmailPopup = ({
  show,
  handleClose,
  onOptionChange,
  latestAddedData,
  employeeId,
}) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [isMailSending, setIsMailSending] = useState(false);
  const [getResponse, setResponse] = useState("");
  const [emailBody, setEmailBody] = useState(
    "Dear [Recipient's Name],\n\nI hope this message finds you well. Please find attached the necessary company documents and certificates for your review."
  );
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    const fetchCompanyDetailsById = async () => {
      let response;
      if (onOptionChange != null) {
        response = await axios.get(
          `${API_BASE_URL}/details-by-Id/${onOptionChange}`
        );
      } else {
        response = await axios.get(
          `${API_BASE_URL}/details-by-Id/${latestAddedData}`
        );
      }
      setCompanyDetails(response.data);
    };
    fetchCompanyDetailsById();
  }, [latestAddedData]);

  const handleStoreClientInformation = async () => {
    try {
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${day}-${month}-${year}`;
      const clientData = {
        receiverName: emailBody.replace(/Dear\s*,?\s*/i, "").split(",")[0],
        receiverEmail: to,
        sendDate: currentDate,
        sendTime: new Date().toLocaleTimeString(),
        detailsId: companyDetails.detailsId,
        employeeId: parseInt(employeeId),
      };

      const response = await axios.post(
        `${API_BASE_URL}/save-send-details`,
        clientData
      );
      if (response) {
        setIsMailSending(false);
        setResponse(response.data);
        handleClose();
      }
    } catch (error) {
      setIsMailSending(false);
      setResponse(error.message);
    }
  };

  const handleSendEmail = () => {
    const emailData = {
      to,
      cc,
      bcc,
      subject,
      body: emailBody.replace(/\n/g, "<br>"),
    };
    const attachments = [];
    // Attach byte string images as files
    if (companyDetails) {
      if (companyDetails.companyLogoImg) {
        attachments.push({
          fileName: "companyLogo.pdf",
          fileContent: companyDetails.companyLogoImg,
        });
      }
      if (companyDetails.detailsPdf) {
        attachments.push({
          fileName: "companyDetails.pdf",
          fileContent: companyDetails.detailsPdf,
        });
      }
      if (companyDetails.aoaCertificateImg) {
        attachments.push({
          fileName: "aoaCertificate.pdf",
          fileContent: companyDetails.aoaCertificateImg,
        });
      }
      if (companyDetails.cinImg) {
        attachments.push({
          fileName: "cin.pdf",
          fileContent: companyDetails.cinImg,
        });
      }
      if (companyDetails.companyPanCardImg) {
        attachments.push({
          fileName: "companyPanCard.pdf",
          fileContent: companyDetails.companyPanCardImg,
        });
      }
      if (companyDetails.companyTanNumberImg) {
        attachments.push({
          fileName: "companyTanNumber.pdf",
          fileContent: companyDetails.companyTanNumberImg,
        });
      }
      if (companyDetails.dinImg) {
        attachments.push({
          fileName: "din.pdf",
          fileContent: companyDetails.dinImg,
        });
      }
      if (companyDetails.incorporationCertificateImg) {
        attachments.push({
          fileName: "incorporationCertificate.pdf",
          fileContent: companyDetails.incorporationCertificateImg,
        });
      }
      if (companyDetails.moaCertificateImg) {
        attachments.push({
          fileName: "moaCertificate.pdf",
          fileContent: companyDetails.moaCertificateImg,
        });
      }
      if (companyDetails.pfCertificateImg) {
        attachments.push({
          fileName: "PFCertificate.pdf",
          fileContent: companyDetails.pfCertificateImg,
        });
      }
      if (companyDetails.professionalTaxCertificateImg) {
        attachments.push({
          fileName: "professionalTaxCertificate.pdf",
          fileContent: companyDetails.professionalTaxCertificateImg,
        });
      }
      if (companyDetails.rocCertificateImg) {
        attachments.push({
          fileName: "rocCertificate.pdf",
          fileContent: companyDetails.rocCertificateImg,
        });
      }
      if (companyDetails.shopActCertificateImg) {
        attachments.push({
          fileName: "shopActCertificate.pdf",
          fileContent: companyDetails.shopActCertificateImg,
        });
      }
      if (companyDetails.udyamCertificateNumberImg) {
        attachments.push({
          fileName: "udyamCertificate.pdf",
          fileContent: companyDetails.udyamCertificateNumberImg,
        });
      }
    }
    emailData.attachments = attachments;

    setIsMailSending(true);

    axios
      .post(`${API_BASE_URL}/company-detail-email`, emailData)
      .then((response) => {
        handleStoreClientInformation();
        setIsMailSending(false);
        console.log("Email sent successfully:", response.data);
      })
      .catch((error) => {
        setIsMailSending(false);
        setResponse("Error Sending Email");
        console.error("Error sending email:", error);
      });
  };

  const saveAsPdf = (filename, base64Data) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Example: create a link to download the PDF
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    // Return the blob URL if needed
    return url;
  };

  // Render attachments list
  const renderAttachments = () => {
    if (!companyDetails) return null;
    return (
      <>
        {Object.entries(companyDetails).map(([key, value], index) => {
          if (typeof value === "string" && key.endsWith("Img")) {
            const filename = `${key}.pdf`;
            return (
              <li>
                <button onClick={() => saveAsPdf(filename, value)}>
                  {filename}
                </button>
              </li>
            );
          }
          return null;
        })}
      </>
    );
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="text-secondary"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="to">
            <Form.Label>
              <strong>To:</strong>
            </Form.Label>
            <Form.Control
              type="email"
              className="text-secondary"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cc">
            <Form.Label>
              <strong>CC:</strong>
            </Form.Label>
            <Form.Control
              type="email"
              className="text-secondary"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </Form.Group>
          <Form.Group style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "100%" }}>
              <Form.Label>
                <strong>BCC</strong>
              </Form.Label>
              <Form.Control
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
              />
            </div>
            <div style={{ width: "100%" }}>
              <Form.Label>
                <strong>Subject:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                className="text-secondary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </Form.Group>
          <Form.Group controlId="emailBody">
            <Form.Label>
              <strong>Email Body:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              className="text-secondary"
              rows={5}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
          </Form.Group>
          <div className="ACD_Attachments">
            <strong>Attachments:</strong>
            <ul className="ACD_Attachments_list">{renderAttachments()}</ul>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          {getResponse != "" ? (
            <p style={{ color: "red" }}>
              <i>{getResponse}</i>
            </p>
          ) : (
            <p></p>
          )}
          <div className="gap-2 d-flex align-items-center">
            <button className="ACD-share-send-popup-btn" onClick={handleClose}>
              Close
            </button>
            <button
              className="ACD-close-send-popup-btn"
              onClick={handleSendEmail}
            >
              Send Email
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      {isMailSending && (
        <div className="ACD_Loading_Animation">
          <ClipLoader size={50} color="#ffb281" />
        </div>
      )}
    </>
  );
};
/*Akash_Pawar_EmpDashboard_AddedAddCompanyFunction_11/07_LineNo_917*/

export default AddCompanyDetails;
