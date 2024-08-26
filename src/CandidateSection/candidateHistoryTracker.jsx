import React, { useState, useEffect, useRef } from "react";
import "../CandidateSection/candidateHistoryTracker.css";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import { endOfMonth, format, startOfMonth, subMonths, subYears } from "date-fns";
const CandidateHistoryTracker = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [data, setData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [OpenCompanyPosition, setOpenCompanyPosition] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [monthSelector, setmonthSelector] = useState("");
  const [showCustomDiv, setshowCustomDiv] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const popupRef = useRef();

  const policyRef = useRef(); //Prachi Parab Filter Data pdf 156 to 207

  const handleGeneratePDF = async () => {
    const issueContainer = document.getElementById("issue-containers");
    const canvas = await html2canvas(issueContainer, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 30; // Set margin size (in points)
    const borderWidth = 1; // Set border width (in points)

    const contentWidth = pdfWidth - 2 * margin;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.setLineWidth(borderWidth);

    let page = 1;
    while (heightLeft > 0) {
      if (page > 1) {
        pdf.addPage();
      }
      if (position !== margin) {
        pdf.addPage();
        position = margin;
      }
      pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
      pdf.rect(margin, margin, contentWidth, pdfHeight - 2 * margin); // Add border

      heightLeft -= pdfHeight - 2 * margin;
      position -= pdfHeight - 2 * margin; // Adjust position for next page

      page++;
    }

    // Saving the PDF
    pdf.save("Report.pdf");
  };

  const handlePrint = useReactToPrint({
    content: () => policyRef.current,
    documentTitle: "Report",
  });

  const handleFilterChange = (e) => {
    let value = e.target.value;
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const calculatePercentages = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(2) : 0,
    }));
  };

  const showPopup = (filter) => {
    const setdata = data[filter] || [];
    setPopupData({
      filter,
      data: calculatePercentages(setdata).sort((a, b) => b.count - a.count),
    });
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setPopupData(null);
    }
  };
  

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  const [openDropdown, setOpenDropdown] = useState("");

  const handleDropdownToggle = (label) => {
    console.log(label);
    setOpenDropdown(label);
  };
  useEffect(()=>{
    fetchData();
  },[startDate,endDate,openDropdown])

  const handleDropDownCompany = (label) => {
    setOpenCompanyPosition(OpenCompanyPosition === label ? null : label);
  };

  const handleCompanyChange = (event) => {
    setCompanyName(event.target.value);
  };
  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };
  const handleDateRangeChange = (event) => {
    const selectedRange = event.target.value;
    setDateRange(selectedRange);
  
    const today = new Date();
    let start, end;
  
    switch (selectedRange) {
      case "Current Month":
        start = startOfMonth(today);
        end = today;
        break;
      case "Last Month":
        start = startOfMonth(subMonths(today, 1));
        end = endOfMonth(subMonths(today, 1));
        break;
      case "Last 3 Months":
        start = startOfMonth(subMonths(today, 2));
        end = endOfMonth(today);
        break;
      case "Last 6 Months":
        start = startOfMonth(subMonths(today, 5));
        end = endOfMonth(today);
        break;
      case "Last 1 Year":
        start = startOfMonth(subYears(today, 1));
        end = today;
        break;
      case "custom":
        // Don't set dates for custom option
        return;
      default:
        return;
    }
  
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  };
  
  const handleCustomStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setCustomStartDate(event.target.value);
    setStartDate(format(startOfDay(date), "yyyy-MM-dd"));
  };

  const handleCustomEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setCustomEndDate(event.target.value);
    setEndDate(format(endOfDay(date), "yyyy-MM-dd"));
  };
  const selectAllFilters = (event) => {
    if (selectAll) {
      const allFilters = [
        "holdingAnyOffers",
        "sourceNames",
        "tatCounts",
        "pickUpAndDrops",
        "ageGroupCounts",
        "extraCertification",
        // "Communication Rating",
        "maritalStatuses",
        "genders",
        // "Last Company",
        "qualifications",
        "requirementCompanies",
        // "Incentive Recruiters",
        "noticePeriods",
        "companyNames",
        // "On Role Third Party",
        "experienceYearCounts",
        // "Skills Set",
        "positions",
        // "Salary",
        "distanceCounts",
        // "Department",
        "extraCertifications",
        "joiningTypeCounts"
      ];
      setSelectedFilters(allFilters);
    } else {
      setSelectedFilters([]);
    }
    setSelectAll(!selectAll);
  }; 
   
  const fetchData = async () => {
    console.log( startDate+" "+endDate+" "+openDropdown);
    
    if (startDate && endDate && openDropdown !== null) {
      try {
        const response = await axios.get(`${API_BASE_URL}/history-allCounts`, {
          params: {
            startDate: "2022-01-01",
            endDate: "2024-08-01",
            finalStatus: openDropdown,
          },
        });
        console.log("API response:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    } else {
      console.warn("Missing parameters: startDate, endDate, or openDropdown");
    }
  };


  return (
    <div>
      <div className="HeadingHistory">Candidate History</div>
      {/* Date */}
      <div className="tracker-date-report-option">
        <label>
          <input
            type="radio"
            value="Current Month"
            id="CurrentMonth"
            name="reportOption"
            onClick={handleDateRangeChange}
          />
          Current Month
        </label>
        <label>
          <input
            type="radio"
            value="Last Month"
            id="LastMonth"
            name="reportOption"
            onClick={handleDateRangeChange}
          />
          Last Month
        </label>
        <label>
          <input
            type="radio"
            value="Last 3 Months"
            id="Last3Months"
            name="reportOption"
            onClick={handleDateRangeChange}
          />
          Last 3 Months
        </label>
        <label>
          <input
            type="radio"
            value="Last 6 Months"
            name="reportOption"
            id="Last6Months"
            onClick={handleDateRangeChange}
          />
          Last 6 Months
        </label>
        <label>
          <input
            type="radio"
            value="Last 1 Year"
            name="reportOption"
            id="Last1Year"
            onClick={handleDateRangeChange}
          />
          Last 1 Year
        </label>
        <label>
          <input
            type="radio"
            value="custom"
            checked={dateRange === "custom"}
            name="reportOption"
            id="CustomDate"
            onClick={handleDateRangeChange}
          />
          Custom Date
        </label>
        <div>
          {showCustomDiv && (
            <div>
              <div className="date-inputs">
                <label>
                  Start Date:
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={handleCustomStartDateChange}
                  />
                </label>
                <label>
                  End Date:
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={handleCustomEndDateChange}
                  />
                </label>

                <div className="filterDataButton">
                  <button className="Candi-History-tracker-button">
                    Filter Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bhabutton-container">
        {[
          "Selected",
          "Rejected",
          "Hold",
          "Joined",
          "Not joined",
          "Active",
          "Inactive",
          "Dropout",
          "Noshow",
          "Yet to schedule",
        ].map((label) => (
          <div key={label} className="bha-dropdown">
            <button
              className={`bhafilter-button ${
                openDropdown === label ? "active" : ""
              }`}
              onClick={() => handleDropdownToggle(label)}
            >
              {label}
            </button>
          </div>
        ))}
      </div>

      {/* DropDown */}

      <div className="company-position-container">
        <div className="combobox-container">
          <select value={companyName} onChange={handleCompanyChange}>
            <option value="">Select Company</option>
            <option value="CompanyX">CompanyX</option>
            <option value="CompanyY">CompanyY</option>
            {/* Add more companies as needed */}
          </select>
        </div>
        <div className="combobox-container">
          <select value={position} onChange={handlePositionChange}>
            <option value="">Select Position</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            {/* Add more positions as needed */}
          </select>
        </div>
      </div>

      {openDropdown && (
        <div className="Candi-History-tracker-div">
          <button
            onClick={handleButtonClick}
            className="Candi-History-tracker-button"
          >
            {isVisible ? "Hide Filters" : "Show Filters"}
          </button>{" "}
          &nbsp; &nbsp;
          {isVisible && (
            <button
              onClick={selectAllFilters}
              className="Candi-History-tracker-button"
            >
              {selectAll ? "Select All" : "Deselect All"}
            </button>
          )}
          {selectedFilters.length > 0 && (
            <span className="handlePrintDiv">
              <button
                className="Candi-History-tracker-button"
                onClick={handlePrint}
              >
                Export PDF
              </button>
            </span>
          )}
          {isVisible && (
            <div className="outer-Candi-History-tracker-div">
              <div className="inner-Candi-History-tracker-div">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="ageGroupCounts"
                    checked={selectedFilters.includes("ageGroupCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Age
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="extraCertification"
                    checked={selectedFilters.includes("extraCertification")}
                    onChange={handleFilterChange}
                  />{" "}
                  Certification
                </label>
                {/* <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Communication Rating"
                    checked={selectedFilters.includes("Communication Rating")}
                    onChange={handleFilterChange}
                  />{" "}
                  Communication Rating
                </label> */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="companyNames"
                    checked={selectedFilters.includes("companyNames")}
                    onChange={handleFilterChange}
                  />{" "}
                  Company Type
                </label>
                {/* <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Department"
                    checked={selectedFilters.includes("Department")}
                    onChange={handleFilterChange}
                  />{" "}
                  Department
                </label> */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="positions"
                    checked={selectedFilters.includes("positions")}
                    onChange={handleFilterChange}
                  />{" "}
                  Designations
                </label>
              </div>
              <div className="inner-Candi-History-tracker-div">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="distanceCounts"
                    checked={selectedFilters.includes("distanceCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Distance ( Company Near Location)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="qualifications"
                    checked={selectedFilters.includes("qualifications")}
                    onChange={handleFilterChange}
                  />{" "}
                  Education
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="experienceYearCounts"
                    checked={selectedFilters.includes("experienceYearCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Experience
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="genders"
                    checked={selectedFilters.includes("genders")}
                    onChange={handleFilterChange}
                  />{" "}
                  Gender
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="holdingAnyOffers"
                    checked={selectedFilters.includes("holdingAnyOffers")}
                    onChange={handleFilterChange}
                  />{" "}
                  Holding Offer Letters
                </label>
                {/* <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Incentive Recruiters"
                    checked={selectedFilters.includes("Incentive Recruiters")}
                    onChange={handleFilterChange}
                  />{" "}
                  Incentive Recruiters
                </label> */}
              </div>
              <div className="inner-Candi-History-tracker-div">
                {/* <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Last Company"
                    checked={selectedFilters.includes("Last Company")}
                    onChange={handleFilterChange}
                  />{" "}
                  Last Company
                </label> */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="maritalStatuses"
                    checked={selectedFilters.includes("maritalStatuses")}
                    onChange={handleFilterChange}
                  />{" "}
                  Marital Status
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="noticePeriods"
                    checked={selectedFilters.includes("noticePeriods")}
                    onChange={handleFilterChange}
                  />{" "}
                  Notice Period
                </label>
                {/* <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="On Role Third Party"
                    checked={selectedFilters.includes("On Role Third Party")}
                    onChange={handleFilterChange}
                  />{" "}
                  On Role(Third Party)
                </label> */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="pickUpAndDrops"
                    checked={selectedFilters.includes("pickUpAndDrops")}
                    onChange={handleFilterChange}
                  />{" "}
                  Pick Up and Drop
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="requirementCompanies"
                    checked={selectedFilters.includes("requirementCompanies")}
                    onChange={handleFilterChange}
                  />{" "}
                  Requirements
                </label>
              </div>

              <div className="inner-Candi-History-tracker-div">
                {/* <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Salary"
                    checked={selectedFilters.includes("Salary")}
                    onChange={handleFilterChange}
                  />{" "}
                  Salary
                </label> */}
                {/* <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Skills Set"
                    checked={selectedFilters.includes("Skills Set")}
                    onChange={handleFilterChange}
                  />{" "}
                  Skills Set
                </label> */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="sourceNames"
                    checked={selectedFilters.includes("sourceNames")}
                    onChange={handleFilterChange}
                  />{" "}
                  Source Name
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="tatCounts"
                    checked={selectedFilters.includes("tatCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  TAT Reports
                </label>
                <br></br>
              </div>
            </div>
          )}
        </div>
      )}

      {/* <h5>{openDropdown}</h5> */}
      <div
        className="can-history-filter-data-section"
        ref={policyRef}
        id="issue-containers"
      >
        {selectedFilters.map((filter) => {
          const setData = data[filter] || [];
          const sortedData = setData.sort((a, b) => b.count - a.count).slice(0, 6);
          const hasMoreItems = setData.length > 6;

          return (
            <div className="can-history-filter-data" key={filter}>
              <h3>
                <strong>Company Name : {companyName}</strong>
                <br></br>
                <strong>Position : {position}</strong>
                <br></br>
                <strong>Category : {openDropdown}</strong>
                <br></br>
                <strong>Filtered Data by : {filter}</strong>
                <br></br>
                <strong>Data for {monthSelector}</strong>
              </h3>
              <div className="can-history-filter-data-content">
                <div className="can-history-data-table-container">
                  <table className="can-history-data-table">
                    <thead>
                      <tr>
                        <th>{filter}</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatePercentages(sortedData).map((item) => (
                        <tr
                          key={
                            item.companyName ||
                            item.ageRange ||
                            item.sourceName ||
                            item.certification ||
                            item.reportName ||
                            item.option ||
                            item.rating ||
                            item.maritalStatuses ||
                            item.gender ||
                            item.degree ||
                            item.requirement ||
                            item.recruiter ||
                            item.period ||
                            item.type ||
                            item.role ||
                            item.experience ||
                            item.skill ||
                            item.designation ||
                            item.salaryRange ||
                            item.distance ||
                            item.department ||
                            item.extraCertification
                          }
                        >
                          <td>
                            {
                              item.companyName ||
                              item.ageRange ||
                              item.sourceName ||
                              item.reportName ||
                              item.option ||
                              item.rating ||
                              item.maritalStatus ||
                              item.gender ||
                              item.qualification ||
                              item.requirementCompany ||
                              item.recruiter ||
                              item.noticePeriod ||
                              item.type ||
                              item.role ||
                              item.experienceGroup ||
                              item.skill ||
                              item.designation ||
                              item.salaryRange ||
                              item.distance ||
                              item.department ||
                              item.tat ||
                              item.holdingAnyOffer||
                              item.position ||
                              item.pickUpAndDrop||
                              item.joiningType ||
                              item.extraCertification
                              }
                          </td>
                          <td>{item.count || item.COUNT || item.countCallingTracker || item.candidateCount}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {hasMoreItems && (
                  <button
                    className="can-history-more-items"
                    onClick={() => showPopup(filter)}
                  >
                    More Items
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {popupData && (
        <div className="can-history-popup">
          <div className="can-history-popup-content" ref={popupRef}>
            <button
              className="can-history-close-button"
              onClick={() => setPopupData(null)}
            >
              ×
            </button>
            <h3>
              <strong>{popupData.filter}</strong>
            </h3>
            <table className="can-history-data-table">
              <thead>
                <tr>
                  <th>{popupData.filter}</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {popupData.data.map((item) => (
                  <tr
                    key={
                      item.companyNames ||
                      item.ageRange ||
                      item.sourceName ||
                      item.certification ||
                      item.reportName ||
                      item.option ||
                      item.rating ||
                      item.maritalStatuses ||
                      item.gender ||
                      item.degree ||
                      item.requirement ||
                      item.recruiter ||
                      item.period ||
                      item.type ||
                      item.role ||
                      item.experience ||
                      item.skill ||
                      item.designation ||
                      item.salaryRange ||
                      item.distance ||
                      item.department
                    }
                  >
                    <td>
                      {item.companyNames ||
                        item.ageRange ||
                        item.sourceName ||
                        item.certification ||
                        item.reportName ||
                        item.option ||
                        item.rating ||
                        item.maritalStatuses ||
                        item.gender ||
                        item.degree ||
                        item.requirement ||
                        item.recruiter ||
                        item.period ||
                        item.type ||
                        item.role ||
                        item.experience ||
                        item.skill ||
                        item.designation ||
                        item.salaryRange ||
                        item.distance ||
                        item.department}
                    </td>
                    <td>{item.count}</td>
                    <td>{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateHistoryTracker;
