import React, { useState } from 'react';
import './jobDescriptionForm.css';

const JobDescriptionForm = () => {
  const [formData, setFormData] = useState({
    PositionOverview: [''], 
    Responsibilities: [''],
    Requirements: [''],
    PreferredQualifications: ['']
  });

  const [showPopup, setShowPopup] = useState(true);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const handleInputChange = (e, field, index) => {
    const { value } = e.target;
    const newFormData = { ...formData };
    newFormData[field][index] = value;
    setFormData(newFormData);
  };

  const handleKeyDown = (e, field, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (formData[field][index].trim() !== '') {
        const newFormData = { ...formData };
        newFormData[field][index] = formData[field][index].trim();
        newFormData[field].push('');
        setFormData(newFormData);
      }
    }
  };

  const handleAddMore = (field) => {
    const newFormData = { ...formData };
    newFormData[field].push('');
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const anyFieldEmpty = Object.values(formData).some(
      (fieldArray) => fieldArray.some((value) => value.trim() === '')
    );
    if (anyFieldEmpty) {
      setShowValidationPopup(true);
    } else {
      console.log('Form data submitted:', formData);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeValidationPopup = () => {
    setShowValidationPopup(false);
  };

  return (
    <div className="form-container">
      <div className="clouds">  </div>
      {/* {showPopup && (
        <div className="modal-background">
          <div className="modal-content">
            <p>Welcome to the Job Description Form. Please fill in all the details.</p>
            <button className="close-button" onClick={closePopup}>Proceed</button>
          </div>
        </div>
      )} */}
      {showValidationPopup && (
        <div className="modal-background">
          <div className="modal-content">
            <p>Please fill in all description details.</p>
            <button className="close-button" onClick={closeValidationPopup}>OK</button>
          </div>
        </div>
      )}
      
        <div className="card-main-form">
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <div className="section-header">{field.split(/(?=[A-Z])/).join(' ')}</div>
                <div className="form-field">
                  {formData[field].map((item, index) => (
                    <div key={index}>
                      <textarea
                        value={item}
                        placeholder={`Enter ${field.split(/(?=[A-Z])/).join(' ')}`}
                        onChange={(e) => handleInputChange(e, field, index)}
                        onKeyDown={(e) => handleKeyDown(e, field, index)}
                      ></textarea>
                    </div>
                  ))}
                  <div className="add-more-container">
                    <button 
                      type="button" 
                      className="add-more-button" 
                      onClick={() => handleAddMore(field)}
                    >
                      Add More
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
    
    </div>
  );
};

export default JobDescriptionForm;