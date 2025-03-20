import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const FilterComponent = ({ filteredLineUpItems, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [displaySelectCategories, setDisplaySelectCategories] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const filterRef=useRef(null);

  const categories = {
    "Source Name": "sourceName",
    "Job Designation": "jobDesignation",
    "Recruiter's Name": "recruiterName",
    "Applying Company": "requirementCompany",
    "Experience": "experienceYear",
    "Gender" : "gender",
    "Holding Any Offer":"holdingAnyOffer",
    "Notice Period" : "noticePeriod",
    "Qualification": "qualification",
    "Relevant Experience" : "relevantExperience",
    "Job Id" : "requirementId",
    "Status Type" : "selectYesOrNo",
    "Year Of Passing" : "yearOfPassing",
    "Availability For Interview" : "availabilityForInterview",
    "Calling Feedback" : "callingFeedback"
  };

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      // If the same category is clicked again, keep selections
      setActiveFilterOption(prev => (prev === category ? null : category));
    } else {
      // If switching to a new category, reset subcategories
      setSelectedCategory(category);
      setSelectedSubCategories([]); // Clear previous selections
      setActiveFilterOption(category); // Set new active category
    }
  };
  

  const uniqueValues = selectedCategory
    ? [...new Set(filteredLineUpItems.map(item => item[categories[selectedCategory]]))]
    : [];

    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategories(prev => {
          const updatedSubCategories = prev.includes(subCategory)
            ? prev.filter(item => item !== subCategory) // Remove if already selected
            : [...prev, subCategory]; // Add if not selected
          
          // Call onFilterChange with the updated subcategories
          onFilterChange(selectedCategory, updatedSubCategories);
      
          return updatedSubCategories; // Ensure state updates correctly
        });
      };

        useEffect(() => {
            const handleClickOutside = (event) => {
              if (filterRef.current && !filterRef.current.contains(event.target)) {
                setActiveFilterOption(null); // Close filter dropdown when clicking outside
              }
            };
        
            document.addEventListener("mousedown", handleClickOutside);
        
            return () => {
              document.removeEventListener("mousedown", handleClickOutside);
            };
          }, []);

  return (
    <div className='newsetPositionrelative'>

        <div className="filter-dropdowns">
          <div className="filter-section">
            {Object.keys(categories).map((category) => (
              <div className='filter-option' key={category}>
                <button className="white-Btn" onClick={() => handleCategorySelect(category)}>
                  {categories[category] || category} <span className="filter-icon">▼</span>
                </button>

                {activeFilterOption === category && selectedCategory && (
                  <div ref={filterRef} className="city-filter">
                    <div className="optionDiv">
                      {uniqueValues.map((option) => (
                        <label className='selfcalling-filter-value' key={option}>
                          <input
                            className='newinputclassmargin'
                            type="checkbox"
                            checked={selectedSubCategories.includes(option)}
                            onChange={() => {handleSubCategorySelect(option)
                            
                            }
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

    </div>
  );
};

export default FilterComponent;
