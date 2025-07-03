import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-icons/font/bootstrap-icons.css'
import './candidatedoc.css'
import axios from 'axios'
import { API_BASE_URL } from '../api/api'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

function CandidateSubmitDoc() {
  const [candidateInfo, setCandidateInfo] = useState({ candidateName: '', contactNumber: '', candidateEmail: '', jobDesignation: '' })
  const [error, setError] = useState(null);
  const { candidateId, employeeId, userType } = useParams();

  const [formData, setForm] = useState({
    selectionMailRecieved: '',
      aadhaarCard: '',
      panCard: '',
      drivingLicense: '',
      degreeMarkSheet: '',
      hscMarkSheet:'',
      sscMarkSheet:'',
      optionalDocuments:[],
      requirementId:''

  })
 
  console.log('form data:',formData)
 useEffect(() => {
  axios.get(`${API_BASE_URL}/specific-data/${candidateId}`)
    .then(response => {
      console.log('Full API response:', response.data)

      const data = response.data || {}

      const mappedInfo = {
        candidateName: data.candidateName || '',
        contactNumber: data.contactNumber || '',
        candidateEmail: data.candidateEmail || '',
        jobDesignation: data.jobDesignation || ''
      }

      console.log(' Setting candidate info to:', mappedInfo)
      setCandidateInfo(mappedInfo)

      console.log('Adhaar Card URL:', data.documents?.aadhaar_card)
      console.log('FULL DOCUMENTS OBJECT:', data.documents)

      
      const name = data.candidateName || 'Candidate';

      setForm(prev => ({
  ...prev,
  requirementId: data.requirementId,
  selectionMailRecieved: data.selection_mail_received || '',
  aadhaarCard: data.documents?.aadhaar_card || '',
  panCard: data.documents?.pan_card || '',
  drivingLicense: data.documents?.driving_license || '',
  degreeMarkSheet: data.documents?.degree_MarkSheet || '',
  optionalDocuments: Array.isArray(data.documents?.optional_documents)
    ? data.documents.optional_documents
    : []
}));

    })

    
    .catch(error => console.error('Error fetching candidate info:', error))
}, [])

useEffect(()=>{
      fetchPerformanceId();

},[]);
const [performanceId,setPerformanceId]=useState({performanceId:''})


  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage]=useState(null);
  const [recordExists, setRecordExists] = useState(false);
  const [existingOptionalDocs, setExistingOptionalDocs] = useState([]);
  
  const resetFormAndDocuments = () => {
    setForm({
      ...formData,
      mailReceived: "",
      offerLetterReceived: "",
      offerLetterAccepted: "",
      joinStatus: "",
      reasonForNotJoin: "",
      reasonForRejectionOfferLetter: "",
      joiningType: "",
      joinDate: "",
    });
    
  };

  const populateFormData = (data) => {
    setForm({
      ...formData,
      mailReceived: data.mailReceived || "",
      offerLetterReceived: data.offerLetterReceived || "",
      offerLetterAccepted: data.offerLetterAccepted || "",
      joinStatus: data.joinStatus || "",
      reasonForNotJoin: data.reasonForNotJoin || "",
      reasonForRejectionOfferLetter: data.reasonForRejectionOfferLetter || "",
      joiningType: data.joiningType || "",
      joinDate: data.joinDate || "",
    });
    if (data.optionalDocuments && Array.isArray(data.optionalDocuments)) {
      setExistingOptionalDocs(
        data.optionalDocuments.map((doc) =>
          typeof doc === "string" ? doc : doc.name
        )
      );
    }
    
  };



const fetchDetails = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/fetch-joining-details/${candidateId}`);
    
    if (!response.ok) {
      console.log('Error fetching details from server.');
      return;
    }

    const textData = await response.text();

    let data;
    try {
      data = JSON.parse(textData);
    } catch (err) {
      console.warn("Response was not valid JSON:", textData);
      data = textData;
    }

    // 🔍 Handle based on the type of response
    if (typeof data === "string") {
      // 🔴 No record case
      setRecordExists(false);
      console.log("Details not found. Using save API.");
    } else if (typeof data === "object" && Object.keys(data).length > 0) {
      // 🟢 Record exists
      setRecordExists(true);
      console.log("Record found. Using update API.");
      
      populateFormData(data);

      setForm((prev) => ({
        ...prev,
        panCard: data.panCard || "",
        aadhaarCard: data.aadhaarCard || "",
        drivingLicense: data.drivingLicense || "",
        degreeMarkSheet: data.degreeMarkSheet || "",
                hscMarkSheet: data.hscMarkSheet || "",
        sscMarkSheet: data.sscMarkSheet || "",
        selectionMailRecieved: data.mailReceived || "",

        optionalDocuments: Array.isArray(data.documentNames)
          ? data.documentNames
          : []
      }));
    }

  } catch (error) {
    console.error("Error fetching details:", error);
  } finally {
    setLoading(false);
  }
};
console.log(formData);





const fetchPerformanceId = async () => {
    try {
      const performanceId = await axios.get(
        `${API_BASE_URL}/fetch-performance-id/${candidateId}`
      );
          console.log(performanceId);

      setPerformanceId(performanceId.data);
      //fetchDetails();
    } catch (error) {
      console.log(error);
    }
  };


useEffect(() => {
    console.log('UI will now re-render with:', candidateInfo)
  if (candidateInfo.candidateName) {
    console.log("Candidate info available:", candidateInfo);

    fetchDetails(); // only when candidate name is available
    
  }
}, [candidateInfo]);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prevData) => ({
    ...prevData,
    [name]: value,
  }));

 
};


//   const handleFileChange = async (e) => {
//   const { name, files } = e.target;

//   if (!files || files.length === 0) {
//     setForm(prev => ({ ...prev, [name]: '' }));
//     return;
//   }

//   if (name === 'optionalDocuments') {
//     const base64List = await Promise.all(
//       Array.from(files).map(file => fileToBase64converter(file))
//     );
//     setForm(prev => ({
//       ...prev,
//       optionalDocuments: base64List
//     }));
//   } else {
//     const file = files[0];
//     const base64String = await fileToBase64converter(file);
//     setForm(prev => ({
//       ...prev,
//       [name]: base64String
//     }));
//   }
// };
console.log(formData);

const handleFileChange = (e) => {
  const { name, files } = e.target;

  if (!files || files.length === 0) {
    setForm(prev => ({ ...prev, [name]: '' }));
    return;
  }

  if (name === 'optionalDocuments') {
    // Multiple files
    setForm(prev => ({
      ...prev,
      optionalDocuments: Array.from(files) // Store actual File objects
    }));
  } else {
    // Single file
    setForm(prev => ({
      ...prev,
      [name]: files[0] // Store single File object
    }));
  }
};




//  const handleSubmitJoiningDetails = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError(null);

//   console.log('Sending JSON Payload:', formData); // DEBUG
//   // console.log(' Final Payload Before PUT:', JSON.stringify(formData, null, 2));

//   try {
//     const url = recordExists
//       ? `${API_BASE_URL}/update-documents/${candidateId}`
//       : `${API_BASE_URL}/save-join-data`;
//     const method = recordExists ? 'PUT' : 'POST';

//     const response = await fetch(url, {
//       method,
//       headers: {
//         'Content-Type': 'application/json'
//       },
      
//       body: JSON.stringify(formData)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.text();

//     setSuccessMessage(
//       recordExists
//         ? 'Details updated successfully!'
//         : 'Details submitted successfully!'
//     );
//     setTimeout(() => setSuccessMessage(null), 3000);

//     await fetchDetails(); // Refresh data
//   } catch (error) {
//     setError(error.message);
//     console.error('❌ Submission error:', error);
//   } finally {
//     setLoading(false);
//   }
// };


const handleSubmitJoiningDetails = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const url = recordExists
      ? `${API_BASE_URL}/update-documents/${candidateId}`
      : `${API_BASE_URL}/save-join-data`;
    const method = recordExists ? 'PUT' : 'POST';
console.log(method);

    const formDataToSend = new FormData();
// Append normal fields
    formDataToSend.append('employeeId', employeeId);
    formDataToSend.append('candidateId', candidateId);

    formDataToSend.append('requirementId', formData.requirementId);
    console.log(formData.selectionMailRecieved);
    
    formDataToSend.append('mailReceived', formData.selectionMailRecieved);

          formDataToSend.append('offerLetterReceived','');
    formDataToSend.append('offerLetterAccepted', '');
    // formDataToSend.append('reasonForRejectionOfferLetter', '');
    formDataToSend.append('joinStatus', '');
    // formDataToSend.append('reasonForNotJoin', '');
    formDataToSend.append('joinDate', '');
    

    

    formDataToSend.append('dataUpdatedBy', "User");
    formDataToSend.append('comment', "User Comment");

    // Append file fields if they exist
    if (formData.aadhaarCard) formDataToSend.append('aadhaarCard', formData.aadhaarCard);
    if (formData.panCard) formDataToSend.append('panCard', formData.panCard);
    if (formData.drivingLicense) formDataToSend.append('drivingLicense', formData.drivingLicense);
    if (formData.degreeMarkSheet) formDataToSend.append('degreeMarkSheet', formData.degreeMarkSheet);
    if (formData.hscMarkSheet) formDataToSend.append('hscMarkSheet', formData.hscMarkSheet);
    if (formData.sscMarkSheet) formDataToSend.append('sscMarkSheet', formData.sscMarkSheet);

    // Append optionalDocuments (multiple files)
   Array.from(formData.optionalDocuments).forEach(file => {
  formDataToSend.append('optionalDocuments', file);
});
    const response = await fetch(url, {
      method,
      body: formDataToSend, // no content-type, browser sets it with boundary
    },{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
console.log(result);

toast.success("Documents Saved Successfully", );

    setTimeout(() => setSuccessMessage(null), 1000);

    // await fetchDetails(); // Refresh data
  } catch (error) {
    toast.error(error.message);
    console.error('❌ Submission error:', error);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className='form-container-outlinenewclassnameaddedbysakshi'>
    <form className='form-wrapperaddedbysakshinewclass' onSubmit={handleSubmitJoiningDetails}>

      {/* User Info Grid */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2"><strong>Name :</strong> {candidateInfo.candidateName}</div>
<div className="col-md-6 mb-2"><strong>Email :</strong> {candidateInfo.candidateEmail}</div>
<div className="col-md-6 mb-2"><strong>Contact :</strong> {candidateInfo.contactNumber}</div>
<div className="col-md-6 mb-2"><strong>Designation :</strong> {candidateInfo.jobDesignation}</div>

      </div>

      {/* Form Fields */}
      <div className="row g-3">
  {/* Selection Mail */}
  <div className="col-md-6 border-styleaddedbysakshinewclassname">
    <label className="form-label sakshilabeladdedclass">Selection Mail Received ?</label>
    <i className="bi bi-envelope-at-fill"></i>
   <select
  className="custom-selectaddedbysakshifornewclass inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi"
  name="selectionMailRecieved"
  value={formData.selectionMailRecieved}
  onChange={handleChange}
>
  <option value="">Select option</option> {/* ✅ value added for default */}
  <option value="received">Yes</option>
  <option value="Not received">No</option>
</select>

  </div>

  {/* Adhaar Card */}
  <div className="col-md-6">
    <label className="form-label sakshilabeladdedclass">Adhaar Card</label> 
    <i className="bi bi-upload"></i>
    {formData.aadhaarCard && (
  <p className="text-success small">Uploaded: Adhaar_Card.pdf<i className="bi bi-check-circle-fill"></i></p>
  
)}

    <input type="file" name="aadhaarCard" onChange={handleFileChange} className="form-control inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi" />
    {formData.aadhaarCard instanceof File && (
      <small className="text-muted">Selected: {formData.aadhaarCard.name}</small>
    )}
  </div>

  {/* Pan Card */}
  <div className="col-md-6">
    <label className="form-label sakshilabeladdedclass">Pan Card</label> 
    <i className="bi bi-upload"></i>
    {formData.panCard && (
  <p className="text-success small">Uploaded: Pan_Card.pdf<i className="bi bi-check-circle-fill"></i></p>
)}

    <input type="file" name="panCard" onChange={handleFileChange} className="form-control inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi" />
    {formData.panCard instanceof File && (
      <small className="text-muted">Selected: {formData.panCard.name}</small>
    )}
    
  </div>

  {/* Driving License */}
  <div className="col-md-6">
    <label className="form-label sakshilabeladdedclass">Driving License</label> 
    <i className="bi bi-upload"></i>
    {formData.drivingLicense && (
  <p className="text-success small">Uploaded: Driving_License.pdf<i className="bi bi-check-circle-fill"></i></p>
)}
    <input type="file" name="drivingLicense" onChange={handleFileChange} className="form-control inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi" />
    {formData.drivingLicense instanceof File && (
      <small className="text-muted">Selected: {formData.drivingLicense.name}</small>
    )}
  </div>



  {/* ssc */}
  <div className="col-md-6">
    <label className="form-label sakshilabeladdedclass">SSC Certificate</label> 
    <i className="bi bi-upload"></i>
    {formData.sscMarkSheet && (
  <p className="text-success small">Uploaded: SSC_Certificate.pdf<i className="bi bi-check-circle-fill"></i></p>
)}

    <input type="file" name="sscMarkSheet" onChange={handleFileChange} className="form-control inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi" />
    {formData.sscMarkSheet instanceof File && (
      <small className="text-muted">Selected: {formData.sscMarkSheet.name}</small>
    )}
    
  </div>

  {/* hsc */}
  <div className="col-md-6">
    <label className="form-label sakshilabeladdedclass">HSC Certificate</label> 
    <i className="bi bi-upload"></i>
    {formData.hscMarkSheet && (
  <p className="text-success small">Uploaded: HSC_Certificate.pdf<i className="bi bi-check-circle-fill"></i></p>
)}
    <input type="file" name="hscMarkSheet" onChange={handleFileChange} className="form-control inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi" />
    {formData.hscMarkSheet instanceof File && (
      <small className="text-muted">Selected: {formData.hscMarkSheet.name}</small>
    )}
  </div>



  {/* Degree Marksheet */}
  <div className="col-md-6">
    <label className="form-label sakshilabeladdedclass">Degree Marksheet</label> 
    <i className="bi bi-upload"></i>
    {formData.degreeMarkSheet && (
  <p className="text-success small">Uploaded: Degree_Marksheet.pdf<i className="bi bi-check-circle-fill"></i></p>
)}
    <input type="file" name="degreeMarkSheet" onChange={handleFileChange} className="form-control inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi" />
    {formData.degreeMarkSheet instanceof File && (
      <small className="text-muted">Selected: {formData.degreeMarkSheet.name}</small>
    )}
  </div>

  {/* Optional Documents (multiple) */}
  <div className="col-md-6">
    <label className="form-label sakshilabeladdedclass">Optional Document(s)</label> 
    <i className="bi bi-upload"></i>
  {
    formData.optionalDocuments.length > 0 && (
        <p className="text-success small" style={{
           maxHeight: '100px',
          overflow: 'scroll',
          display: 'grid',
        }}>Uploaded: {formData.optionalDocuments.map((doc, index) => (
          <span key={index}>
            {doc.name || doc}  
            <i className="bi bi-check-circle-fill"></i>
          </span>
        ))}</p>
    )
  }

    <input
      type="file"
      name="optionalDocuments"
      onChange={handleFileChange}
      className="form-control inputtypefileclassnameaddedbysakshi addedforresponsivebysakshi"
      multiple
    />

  </div>
</div>


      {/* Submit Button */}
      <div className="text-center mt-4">
        <button type="submit" className="submit-btnewclassbysakshi">
          Add Documents
        </button>
      </div>
    </form>
    </div>
  )
}

export default CandidateSubmitDoc
