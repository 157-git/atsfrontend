import React, { useEffect, useRef, useState } from "react";

const FilterComponent = ({ filteredLineUpItems, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState({}); // Store selected subcategories per category
  const [activeFilterOption, setActiveFilterOption] = useState(null); // Track active category dropdown
  const [lastSelectedCategory, setLastSelectedCategory] = useState(null); // Track last selected category
  const filterRef = useRef(null);

  const categories = {
    "Source Name": "sourceName",
    "Job Designation": "jobDesignation",
    "Recruiter's Name": "recruiterName",
    "Applying Company": "requirementCompany",
    "Experience": "experienceYear",
    "Gender": "gender",
    "Holding Any Offer": "holdingAnyOffer",
    "Notice Period": "noticePeriod",
    "Qualification": "qualification",
    "Relevant Experience": "relevantExperience",
    "Job Id": "requirementId",
    "Status Type": "selectYesOrNo",
    "Year Of Passing": "yearOfPassing",
    "Availability For Interview": "availabilityForInterview",
    "Calling Feedback": "callingFeedback",
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setActiveFilterOption((prev) => (prev === category ? null : category));
  };

  // Get unique values for the selected category
  const uniqueValues = activeFilterOption
    ? [...new Set(filteredLineUpItems.map((item) => item[categories[activeFilterOption]]))]
    : [];

  // Handle subcategory selection
  const handleSubCategorySelect = (category, subCategory) => {
    setSelectedCategories((prev) => {
      let updatedCategories = { ...prev };

      // If switching to a new category and selecting first checkbox, reset the previous category
      if (lastSelectedCategory !== category) {
        updatedCategories = { [category]: [] };
      }

      // Add/remove the checkbox selection
      updatedCategories[category] = updatedCategories[category]?.includes(subCategory)
        ? updatedCategories[category].filter((item) => item !== subCategory) // Remove if already selected
        : [...(updatedCategories[category] || []), subCategory]; // Add if not selected

      // Call the filter function with updated values
      onFilterChange(category, updatedCategories[category]);

      // Update the last selected category
      setLastSelectedCategory(category);

      return updatedCategories;
    });
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest(".filter-option button") // Prevent closing when clicking inside the button
      ) {
        setActiveFilterOption(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="newsetPositionrelative">
      <div className="filter-dropdowns">
        <div className="filter-section">
          {Object.keys(categories).map((category) => (
            <div className="filter-option" key={category}>
            <button
  className="white-Btn"
  onClick={() => handleCategorySelect(category)}
  style={{
    backgroundColor: selectedCategories[category]?.length > 0 ? "#ffcb9b" : "transparent",
  }}
>
  {category}  
  {selectedCategories[category]?.length > 0 ? ` ${selectedCategories[category]?.length}` : ""}
  <span className="filter-icon">▼</span> 
</button>



              {activeFilterOption === category && (
                <div ref={filterRef} className="city-filter">
                  <div className="optionDiv">
                    {uniqueValues.map((option) => (
                      <label className="selfcalling-filter-value" key={option}>
                        <input
                          className="newinputclassmargin"
                          type="checkbox"
                          checked={selectedCategories[category]?.includes(option) || false}
                          onChange={() => handleSubCategorySelect(category, option)}
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
