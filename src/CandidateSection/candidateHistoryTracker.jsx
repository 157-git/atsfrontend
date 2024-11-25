import React, { useState, useEffect, useRef } from "react";
import "../CandidateSection/candidateHistoryTracker.css";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import {
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
  subYears,
} from "date-fns";

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
  useEffect(() => {
    fetchData();
  }, [startDate, endDate, openDropdown]);

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
        // implemented by sahil karnekar to toggle status dive date 18-11-2024
        setshowCustomDiv(false);
        start = startOfMonth(today);
        end = today;
        break;
      case "Last Month":
        setshowCustomDiv(false);
        start = startOfMonth(subMonths(today, 1));
        end = endOfMonth(subMonths(today, 1));
        break;
      case "Last 3 Months":
        setshowCustomDiv(false);
        start = startOfMonth(subMonths(today, 2));
        end = endOfMonth(today);
        break;
      case "Last 6 Months":
        setshowCustomDiv(false);
        start = startOfMonth(subMonths(today, 5));
        end = endOfMonth(today);
        break;
      case "Last 1 Year":
        setshowCustomDiv(false);
        start = startOfMonth(subYears(today, 1));
        end = today;
        console.log(start, end);
        break;
      case "custom":
        // Don't set dates for custom option
        setshowCustomDiv(true);
        return;
      default:
        return;
    }

    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
    console.log(startDate);
    console.log(endDate);
  };
  console.log(startDate);
  console.log(endDate);
  const handleCustomStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setCustomStartDate(event.target.value);
    // updated by sahil karnekar dat 18-11-2024
    setStartDate(format(date, "yyyy-MM-dd"));
  };

  const handleCustomEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setCustomEndDate(event.target.value);
    // updated by sahil karnekar dat 18-11-2024
    setEndDate(format(date, "yyyy-MM-dd"));
  };
  const selectAllFilters = (event) => {
    if (selectAll) {
      const allFilters = [
        "extraCertificationCounts",
        "onRoleCounts",
        "distanceCounts",
        "genderCounts",
        "ageCounts",
        "jobDesignationCounts",
        "salaryCounts",
        "communicationRatingCounts",
        "lastCompanyCounts",
        "companyTypeCounts",
        "sourceNameCounts",
        "pickUpAndDropCounts",
        "experienceCounts",
        "holdingAnyOfferCounts",
        "tatReportsCounts",
        "requirementCompanyCounts",
        "noticePeriodCounts",
        "incentiveCounts",
        "qualificationCounts",
        "maritalStatusCounts",
        // "On Role Third Party",
        // "Salary"
      ];
      setSelectedFilters(allFilters);
    } else {
      setSelectedFilters([]);
    }
    setSelectAll(!selectAll);
  };

// conditional case created by sahil karnekar date 18-11-2024

  const getDisplayName = (filter) => {
    switch (filter) {
      case "extraCertificationCounts":
        return "Extra Certification";
      case "onRoleCounts":
        return "On Role";
      case "distanceCounts":
        return "Distance";
      case "genderCounts":
        return "Gender";
      case "ageCounts":
        return "Age";
      case "jobDesignationCounts":
        return "Job Designation";
      case "salaryCounts":
        return "Salary";
      case "communicationRatingCounts":
        return "Communication Rating";
      case "lastCompanyCounts":
        return "Last Company";
      case "companyTypeCounts":
        return "Company Type";
      case "sourceNameCounts":
        return "Source Name";
      case "pickUpAndDropCounts":
        return "Pick Up and Drop";
      case "experienceCounts":
        return "Experience";
      case "holdingAnyOfferCounts":
        return "Holding Any Offer";
      case "tatReportsCounts":
        return "TAT Reports";
      case "requirementCompanyCounts":
        return "Requirement Company";
      case "noticePeriodCounts":
        return "Notice Period";
      case "incentiveCounts":
        return "Incentive";
      case "qualificationCounts":
        return "Qualification";
      case "maritalStatusCounts":
        return "Marital Status";
      default:
        return filter; // if no match, return the filter name itself
    }
  };
  

  const fetchData = async () => {
    if (startDate && endDate && openDropdown !== null) {
      try {
        const response = await axios.get(`${API_BASE_URL}/candidate-history-tracker`, {
          params: {
            startDate: startDate,
            endDate: endDate,
            status: openDropdown,
          },
        });
        console.log("API response:", response.data);
        setData(response.data);
        console.log(data);
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
      {/* here are some fields updated by sahil karnekar date 19-11-2024 */}
      <div className="setborderdiv">
      <div className="tracker-date-report-option">
        <label
        className="PI-radio-label"
        >
          <input
            type="radio"
            value="Current Month"
            id="CurrentMonth"
            name="reportOption"
            onClick={handleDateRangeChange}
          />
          Current Month
        </label>
        <label
        className="PI-radio-label"
        >
          <input
            type="radio"
            value="Last Month"
            id="LastMonth"
            name="reportOption"
            onClick={handleDateRangeChange}
          />
          Last Month
        </label>
        <label
        className="PI-radio-label"
        >
          <input
            type="radio"
            value="Last 3 Months"
            id="Last3Months"
            name="reportOption"
            onClick={handleDateRangeChange}
          />
          Last 3 Months
        </label>
        <label
        className="PI-radio-label"
        >
          <input
            type="radio"
            value="Last 6 Months"
            name="reportOption"
            id="Last6Months"
            onClick={handleDateRangeChange}
          />
          Last 6 Months
        </label>
        <label
        className="PI-radio-label"
        >
          <input
            type="radio"
            value="Last 1 Year"
            name="reportOption"
            id="Last1Year"
            onClick={handleDateRangeChange}
          />
          Last 1 Year
        </label>
        <label
        className="PI-radio-label"
        >
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
      {/* LINE 356 to 403 updated by sahil karnekar dat 18-11-2024 */}


      <div className="setNewButtonsClass">
      <div className={`bhabutton-container`}>
        {[
          "Yet To Confirm",
          "Interview Schedule",
          "Attending After Some time",
          "Shortlisted",
          "Selected",
          "Rejected",
          "Hold",
          // "Joining",
          "Drop Out",
          "To Join",
          "Joined",
          "Not Joined",
          "No Show",
          "Active",
          "Inactive",
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
      </div>
      </div>

      
      {openDropdown && (
        <div className="Candi-History-tracker-div">
          <div className="history-filtter-data-div">
            <div className="history-main-div">
              <button
                onClick={handleButtonClick}
                className="Candi-History-tracker-button"
              >
                {isVisible ? "Hide Filters" : "Show Filters"}
              </button>
              &nbsp; &nbsp;
              {isVisible && (
                <button
                  onClick={selectAllFilters}
                  className="Candi-History-tracker-button"
                >
                  {selectAll ? "Select All" : "Deselect All"}
                </button>
              )}
            </div>
            {/* <div className="company-position-container">
              <div className="combobox-container">
                <select value={companyName} onChange={handleCompanyChange}>
                  <option value="">Select Company</option>
                  <option value="CompanyX">CompanyX</option>
                  <option value="CompanyY">CompanyY</option>
                </select>
              </div>
              <div className="combobox-container">
                <select value={position} onChange={handlePositionChange}>
                  <option value="">Select Position</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>
            </div> */}

            <div className="">
              {selectedFilters.length > 0 && (
                <span className="handlePrintDiv">
                  <button
                    className="Candi-History-tracker-button margin-left-set"
                    onClick={handlePrint}
                  >
                    Export PDF
                  </button>
                </span>
              )}
            </div>
          </div>

          {isVisible && (
            <div className="outer-Candi-History-tracker-div">
              <div className="inner-Candi-History-tracker-div">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="extraCertificationCounts"
                    checked={selectedFilters.includes("extraCertificationCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Extra Certification
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="onRoleCounts"
                    checked={selectedFilters.includes("onRoleCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  On Role
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="distanceCounts"
                    checked={selectedFilters.includes("distanceCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Distance
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="genderCounts"
                    checked={selectedFilters.includes("genderCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Gender
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="ageCounts"
                    checked={selectedFilters.includes("ageCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Age
                </label>
              </div>
              <div className="inner-Candi-History-tracker-div">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="jobDesignationCounts"
                    checked={selectedFilters.includes("jobDesignationCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Job Designation
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="salaryCounts"
                    checked={selectedFilters.includes("salaryCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Salary Counts
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="communicationRatingCounts"
                    checked={selectedFilters.includes("communicationRatingCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Communication Rating
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="lastCompanyCounts"
                    checked={selectedFilters.includes("lastCompanyCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Last Company
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="companyTypeCounts"
                    checked={selectedFilters.includes("companyTypeCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Company Type Counts
                </label>
              </div>

              <div className="inner-Candi-History-tracker-div">
              <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="sourceNameCounts"
                    checked={selectedFilters.includes("sourceNameCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Source Name
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="pickUpAndDropCounts"
                    checked={selectedFilters.includes("pickUpAndDropCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Pick Up and Drop
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="experienceCounts"
                    checked={selectedFilters.includes("experienceCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Experience Count
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="holdingAnyOfferCounts"
                    checked={selectedFilters.includes("holdingAnyOfferCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Holding Any Offer
                </label>
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
                    value="tatReportsCounts"
                    checked={selectedFilters.includes("tatReportsCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  TAT Reports
                </label>
              </div>
              <div className="inner-Candi-History-tracker-div">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="requirementCompanyCounts"
                    checked={selectedFilters.includes("requirementCompanyCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Requirement Company
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="noticePeriodCounts"
                    checked={selectedFilters.includes("noticePeriodCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Notice Period
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="incentiveCounts"
                    checked={selectedFilters.includes("incentiveCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Incentive Counts
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="qualificationCounts"
                    checked={selectedFilters.includes("qualificationCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Qualification
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="maritalStatusCounts"
                    checked={selectedFilters.includes("maritalStatusCounts")}
                    onChange={handleFilterChange}
                  />{" "}
                  Marital Status
                </label>
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
          const sortedData = setData
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
          const hasMoreItems = setData.length > 6;

          // added by sahil karnekar
          const displayName = getDisplayName(filter);

          return (
            <div className="can-history-filter-data" key={filter}>
              <div className="history-tracker-table-header">
               <p> <strong>Company Name :</strong> {companyName}</p>
               <p> <strong>Position :</strong> {position}</p>
               <p><strong>Category :</strong> {openDropdown}</p>
               <p><strong>Filtered Data by :</strong> {displayName}</p>
               {/* <p> <strong>Data for : - </strong> {monthSelector}</p> */}
              </div>
              <div className="can-history-filter-data-content">
                <div className="can-history-data-table-container">
                  <table className="can-history-data-table">
                    <thead>
                      <tr>
                        <th>{displayName}</th>
                        <th>{openDropdown +" "+ "Count"}</th>
                        <th>Total Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* updated by sahil karnekar date 18-11-2024 */}
                      {calculatePercentages(sortedData).map((item,index) => (
                       (((item.gender !== '' && item.gender !== null) 
                       && (item.communicationRating !== '' && item.communicationRating !== null) 
                       && (item.companyType !== '' && item.companyType !== null) 
                       && (item.distanceRange !== '' && item.distanceRange !== null) 
                       && (item.extraCertification !== '' && item.extraCertification !== null) 
                       && (item.holdingAnyOffer !== '' && item.holdingAnyOffer !== null) 
                       && (item.incentiveRange !== '' && item.incentiveRange !== null) 
                       && (item.jobDesignation !== '' && item.jobDesignation !== null) 
                       && (item.lastCompany !== '' && item.lastCompany !== null) 
                       && (item.maritalStatus !== '' && item.maritalStatus !== null) 
                       && (item.onRole !== '' && item.onRole !== null) 
                       && (item.pickUpAndDrop !== '' && item.pickUpAndDrop !== null) 
                       && (item.qualification !== '' && item.qualification !== null) 
                       && (item.requirementCompany !== '' && item.requirementCompany !== null) 
                       && (item.salaryRange !== '' && item.salaryRange !== null) 
                       && (item.sourceName !== '' && item.sourceName !== null) 
                       && (item.tatReports !== '' && item.tatReports !== null) 
          
                      ) && (
                       <tr
                       key={index}
                          // key={
                          //   item.companyName ||
                          //   item.ageRange ||
                          //   item.sourceName ||
                          //   item.certification ||
                          //   item.reportName ||
                          //   item.option ||
                          //   item.rating ||
                          //   item.maritalStatuses ||
                          //   item.gender ||
                          //   item.degree ||
                          //   item.requirement ||
                          //   item.recruiter ||
                          //   item.period ||
                          //   item.type ||
                          //   item.role ||
                          //   item.experience ||
                          //   item.skill ||
                          //   item.designation ||
                          //   item.salaryRange ||
                          //   item.distance ||
                          //   item.department ||
                          //   item.extraCertification
                          // }
                        >
                          <td>
                            {item.companyName ||
                              item.ageRange ||
                              item.sourceName ||
                              item.reportName ||
                              item.option ||
                              item.communicationRating ||
                              item.maritalStatus ||
                              item.gender ||
                              item.qualification ||
                              item.requirementCompany ||
                              item.recruiter ||
                              item.noticePeriod ||
                              item.type ||
                              item.onRole ||
                              item.experienceGroup ||
                              item.skill ||
                              item.jobDesignation ||
                              item.salaryRange ||
                              item.distanceRange ||
                              item.department ||
                              item.tat ||
                              item.holdingAnyOffer ||
                              item.position ||
                              item.pickUpAndDrop ||
                              item.joiningType ||
                              item.lastCompany ||
                              item.companyType ||
                              item.experienceRange ||
                              item.extraCertification ||
                              item.tatReports ||
                              item.incentiveRange
                              }
                          </td>
                          <td>
                            {/* updated by sahil karnekar date 18-11-2024 */}
  {item.SelectedCount ??
    item.YetToConfirmCount ??
    item.InterviewScheduleCount ??
    item.AttendingAfterSometimeCount ??
    item.RejectedCount ??
    item.HoldCount ??
    item.DropOutCount ??
    item.ToJoinCount ??
    item.JoinedCount ??
    item.NotJoinedCount ??
    item.NoShowCount ??
    item.ActiveCount ??
    item.InactiveCount ??
    item.ShortlistedCount
    }
</td>


                          <td>
                            {item.totalCount ||
                              item.COUNT ||
                              item.countCallingTracker ||
                              item.candidateCount}
                          </td>
                          <td>
                            {/* updated by sahil karnekar date 18-11-2024 */}
  {(() => {
    // Array of all possible fields
    const fields = [
      item.SelectedCount,
      item.YetToConfirmCount,
      item.InterviewScheduleCount,
      item.AttendingAfterSometimeCount,
      item.RejectedCount,
      item.HoldCount,
      item.DropOutCount,
      item.ToJoinCount,
      item.JoinedCount,
      item.NotJoinedCount,
      item.NoShowCount,
      item.ActiveCount,
      item.InactiveCount,
    ];

    // Find the first non-null or non-undefined value
    const firstNonNullValue = fields.find((value) => value != null) ?? 0;

    // Calculate percentage
    const percentage = ((firstNonNullValue / (item.totalCount ?? 1)) * 100).toFixed(2);

    // Return percentage with a fallback for empty data
    return item.totalCount ? `${percentage} %` : "N/A";
  })()}
</td>

                        </tr>))
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
              <strong>{getDisplayName(popupData.filter)}</strong>
            </h3>
            <table className="can-history-data-table">
              <thead>
                <tr>
                  <th>{getDisplayName(popupData.filter)}</th>
                  <th>{openDropdown +" "+ "Count"}</th>
                  <th>Total Count</th>
                  <th> Percentage</th>
                </tr>
              </thead>
              <tbody>
                {/* updated by sahil karnekar date 18-11-2024 */}
                {popupData.data.map((item,index) => (
                   (((item.gender !== '' && item.gender !== null) 
                   && (item.communicationRating !== '' && item.communicationRating !== null) 
                   && (item.companyType !== '' && item.companyType !== null) 
                   && (item.distanceRange !== '' && item.distanceRange !== null) 
                   && (item.extraCertification !== '' && item.extraCertification !== null) 
                   && (item.holdingAnyOffer !== '' && item.holdingAnyOffer !== null) 
                   && (item.incentiveRange !== '' && item.incentiveRange !== null) 
                   && (item.jobDesignation !== '' && item.jobDesignation !== null) 
                   && (item.lastCompany !== '' && item.lastCompany !== null) 
                   && (item.maritalStatus !== '' && item.maritalStatus !== null) 
                   && (item.onRole !== '' && item.onRole !== null) 
                   && (item.pickUpAndDrop !== '' && item.pickUpAndDrop !== null) 
                   && (item.qualification !== '' && item.qualification !== null) 
                   && (item.requirementCompany !== '' && item.requirementCompany !== null) 
                   && (item.salaryRange !== '' && item.salaryRange !== null) 
                   && (item.sourceName !== '' && item.sourceName !== null) 
                   && (item.tatReports !== '' && item.tatReports !== null) 
      
                  ) && (
                  <tr
                  key={index}
                  // key={
                  //   item.companyName ||
                  //   item.ageRange ||
                  //   item.sourceName ||
                  //   item.certification ||
                  //   item.reportName ||
                  //   item.option ||
                  //   item.rating ||
                  //   item.maritalStatuses ||
                  //   item.gender ||
                  //   item.degree ||
                  //   item.requirement ||
                  //   item.recruiter ||
                  //   item.period ||
                  //   item.type ||
                  //   item.role ||
                  //   item.experience ||
                  //   item.skill ||
                  //   item.designation ||
                  //   item.salaryRange ||
                  //   item.distance ||
                  //   item.department ||
                  //   item.extraCertification
                  // }
                >
                  <td>
                    {item.companyName ||
                              item.ageRange ||
                              item.sourceName ||
                              item.reportName ||
                              item.option ||
                              item.communicationRating ||
                              item.maritalStatus ||
                              item.gender ||
                              item.qualification ||
                              item.requirementCompany ||
                              item.recruiter ||
                              item.noticePeriod ||
                              item.type ||
                              item.onRole ||
                              item.experienceGroup ||
                              item.skill ||
                              item.jobDesignation ||
                              item.salaryRange ||
                              item.distanceRange ||
                              item.department ||
                              item.tat ||
                              item.holdingAnyOffer ||
                              item.position ||
                              item.pickUpAndDrop ||
                              item.joiningType ||
                              item.lastCompany ||
                              item.companyType ||
                              item.experienceRange ||
                              item.extraCertification ||
                              item.tatReports ||
                              item.incentiveRange}
                  </td>
                  <td>
  {item.SelectedCount ??
    item.YetToConfirmCount ??
    item.InterviewScheduleCount ??
    item.AttendingAfterSometimeCount ??
    item.RejectedCount ??
    item.HoldCount ??
    item.DropOutCount ??
    item.ToJoinCount ??
    item.JoinedCount ??
    item.NotJoinedCount ??
    item.NoShowCount ??
    item.ActiveCount ??
    item.InactiveCount ??
    item.ShortlistedCount
    }
</td>
                  <td>
                    {item.totalCount ||
                      item.COUNT ||
                      item.countCallingTracker ||
                      item.candidateCount}
                  </td>
                  <td>
  {(() => {
    // Array of all possible fields
    const fields = [
      item.SelectedCount,
      item.YetToConfirmCount,
      item.InterviewScheduleCount,
      item.AttendingAfterSometimeCount,
      item.RejectedCount,
      item.HoldCount,
      item.DropOutCount,
      item.ToJoinCount,
      item.JoinedCount,
      item.NotJoinedCount,
      item.NoShowCount,
      item.ActiveCount,
      item.InactiveCount,
    ];

    // Find the first non-null or non-undefined value
    const firstNonNullValue = fields.find((value) => value != null) ?? 0;

    // Calculate percentage
    const percentage = ((firstNonNullValue / (item.totalCount ?? 1)) * 100).toFixed(2);

    // Return percentage with a fallback for empty data
    return item.totalCount ? `${percentage} %` : "N/A";
  })()}
</td>
                </tr>))
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
