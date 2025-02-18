import React, { useEffect, useState } from 'react'
import "../HandlerFunctions/FilterComp.css"

const FilterComponent = ({data, appliedFillters }) => {
    const [filters, setFilters] = useState({});
    const [uniqueOptions, setUniqueOptions] = useState({});
    const [activeFilterOption, setActiveFilterOption] = useState(null);

    const filterLabels = {
        candidateId: "Candidate ID",
        candidateAddedTime: "Candidate Added Time",
        recruiterName: "Recruiter Name",
        candidateName: "Candidate Name",
        candidateEmail: "Candidate Email",
        contactNumber:"Contact Number",
        sourceName: "Source Name",
        jobDesignation: "Job Designation",
        requirementId : "Requirement Id",
        requirementCompany: "Applying Company",
      
        currentLocation: "Current Location",
        selectYesOrNo:"Interested Or Not",
        companyName:"Current Company",
        holdingAnyOffer:"Holding Any Offer",
        noticePeriod:"Notice Period",
        availabilityForInterview:"Availability For Interview",
        finalStatus:"Final Status"
      };

     // Extract unique values for filters when data changes
  useEffect(() => {
    const extractUniqueValues = (key) => [
      ...new Set(data.map((item) => item[key]).filter(Boolean)),
    ];


    setUniqueOptions({
        candidateId: extractUniqueValues("candidateId"),
        candidateAddedTime: extractUniqueValues("candidateAddedTime"),
        recruiterName: extractUniqueValues("recruiterName"),
      candidateName: extractUniqueValues("candidateName"),
      candidateEmail: extractUniqueValues("candidateEmail"),
      contactNumber: extractUniqueValues("contactNumber"),
      sourceName: extractUniqueValues("sourceName"),
      jobDesignation: extractUniqueValues("jobDesignation"),
      requirementId: extractUniqueValues("requirementId"),
      requirementCompany: extractUniqueValues("requirementCompany"),
     
      currentLocation: extractUniqueValues("currentLocation"),
      selectYesOrNo: extractUniqueValues("selectYesOrNo"),
      companyName: extractUniqueValues("companyName"),
      holdingAnyOffer: extractUniqueValues("holdingAnyOffer"),
      noticePeriod: extractUniqueValues("noticePeriod"),
      availabilityForInterview: extractUniqueValues("availabilityForInterview"),
      finalStatus: extractUniqueValues("finalStatus"),
    });

    // Reset filters on new data
    setFilters({
        candidateId: [],
        candidateAddedTime:[],
        recruiterName:[],
      candidateName: [],
      candidateEmail: [],
      contactNumber:[],
      sourceName:[],
      jobDesignation: [],
      requirementId:[],
      requirementCompany: [],

      currentLocation: [],
      selectYesOrNo:[],
      companyName:[],
      holdingAnyOffer:[],
      noticePeriod:[],
      availabilityForInterview: [],
      finalStatus: [],
    });
  }, [data]);

  console.log(uniqueOptions);
  console.log(filters);
  
  
    // Function to update filters when checkboxes are clicked
  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter((v) => v !== value);
      } else {
        updatedFilters[category].push(value);
      }
appliedFillters(updatedFilters);
      return updatedFilters;
    });
  };
  const handleFilterOptionClick = (category) => {
    setActiveFilterOption((prev) => (prev === category ? null : category));
  };

  return (
    <div className="filter-option newFilterOptionReusable">
    {Object.keys(uniqueOptions).map((category) => (
      <div key={category}>
        <button className="white-Btn" onClick={() => handleFilterOptionClick(category)}>
            {filterLabels[category] || category} <span className="filter-icon">▼</span>
          </button>
  
        {/* Dropdown Content */}
        {activeFilterOption === category && (
          <div className="city-filter newcityfilter">
            {uniqueOptions[category].map((option) => (
              <div className="newOptionDiv" key={option}>
                <label style={{ display: "block" }}>
                  <input
                  className='newinputclassmargin'
                    type="checkbox"
                    checked={filters[category]?.includes(option)}
                    onChange={() => handleFilterChange(category, option)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
  
  )
}

export default FilterComponent
