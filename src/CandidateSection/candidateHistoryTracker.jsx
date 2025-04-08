
import { useState, useEffect, useRef } from "react"
import "../CandidateSection/candidateHistoryTracker.css";
import { useReactToPrint } from "react-to-print"
import axios from "axios"
import { API_BASE_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify"

import { endOfMonth, format, startOfMonth, subMonths, subYears } from "date-fns"

const CandidateHistoryTracker = () => {
  const [selectedFilters, setSelectedFilters] = useState([])
  const [data, setData] = useState([])
  const [popupData, setPopupData] = useState(null)
  const [OpenCompanyPosition, setOpenCompanyPosition] = useState(null)
  const [companyName, setCompanyName] = useState("")
  const [position, setPosition] = useState("")
  const [monthSelector, setmonthSelector] = useState("")
  const [showCustomDiv, setshowCustomDiv] = useState(false)
  const [selectAll, setSelectAll] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const popupRef = useRef()

  const policyRef = useRef() //Prachi Parab Filter Data pdf 156 to 207
  // Rajlaxmi jagadale updated taht code
  const handlePrint = useReactToPrint({
    contentRef: policyRef,
    subject: "No footer",
    documentTitle: "Report",
  })
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [pdfError, setPdfError] = useState("")
  const [expandedFilters, setExpandedFilters] = useState([])
  const [isPdfMode, setIsPdfMode] = useState(false)

  // Rajlaxmi Jagadale Added that code updated that code to full pdf dispaly
  const handleExportPDF = async () => {
    try {
      setIsPdfGenerating(true)
      setPdfError("")

      setIsPdfMode(true)

      setExpandedFilters([...selectedFilters])

      await new Promise((resolve) => setTimeout(resolve, 1500))

      handlePrint()

      setTimeout(() => {
        setIsPdfMode(false)
        setIsPdfGenerating(false)
      }, 2000)
    } catch (error) {
      console.error("PDF generation error:", error)
      setPdfError("Failed to generate PDF. Please try again.")
      setIsPdfMode(false)
      setIsPdfGenerating(false)
    }
  }

  const handleClearAll = () => {
    setSelectedFilters([])
  }
  // Rajlaxmi Jagadale Added that code line 76/83
  const toggleExpandFilter = (filter) => {
    setExpandedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  // Check if a filter is expanded
  const isFilterExpanded = (filter) => {
    return expandedFilters.includes(filter)
  }

  // const handleFilterChange = (e) => {
  //   const value = e.target.value
  //   setSelectedFilters((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]))
  // }

  //  Rajlaxmi JAgadale UPdated TAht code date 28/03/2025
  const allFilters = [
    "extraCertificationCounts",
    "genderCounts",
    "jobDesignationCounts",
    "salaryCounts",
    "communicationRatingCounts",
    "lastCompanyCounts",
    "sourceNameCounts",
    "pickUpAndDropCounts",
    "experienceCounts",
    "holdingAnyOfferCounts",
    "requirementCompanyCounts",
    "noticePeriodCounts",
    "incentiveCounts",
    "qualificationCounts",
    "maritalStatusCounts",
    "onRoleCounts",
    "ageCounts",
    "companyTypeCounts",
    "tatReportsCounts",
    "distanceCounts",
  ]

  const selectAllFilters = () => {
    if (selectedFilters.length === allFilters.length) {
      setSelectedFilters([])
      setSelectAll(false)
    } else {
      setSelectedFilters(allFilters)
      setSelectAll(true)
    }
  }

  const handleFilterChange = (e) => {
    const value = e.target.value
    setSelectedFilters((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]))
  }
/* Rajlaxmi JAgadale Upadted taht code Date 08/04/2025*/

  const handleDropdownToggle = (label) => {
    if (!startDate || !endDate) {
      toast.error("First select the date range", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }
    console.log(label)
    setOpenDropdown(label)
    selectAllFilters()
  }
  // Rajlaxmi jagadale adeed that code for genrate pdf line 137/273
  const renderTableRows = (items) => {
    return items
      .map((item, index) => {
        // Check if all required fields are valid
        if (
          item.gender !== "" &&
          item.gender !== null &&
          item.communicationRating !== "" &&
          item.communicationRating !== null &&
          item.companyType !== "" &&
          item.companyType !== null &&
          item.distanceRange !== "" &&
          item.distanceRange !== null &&
          item.extraCertification !== "" &&
          item.extraCertification !== null &&
          item.holdingAnyOffer !== "" &&
          item.holdingAnyOffer !== null &&
          item.incentiveRange !== "" &&
          item.incentiveRange !== null &&
          item.jobDesignation !== "" &&
          item.jobDesignation !== null &&
          item.lastCompany !== "" &&
          item.lastCompany !== null &&
          item.maritalStatus !== "" &&
          item.maritalStatus !== null &&
          item.onRole !== "" &&
          item.onRole !== null &&
          item.pickUpAndDrop !== "" &&
          item.pickUpAndDrop !== null &&
          item.qualification !== "" &&
          item.qualification !== null &&
          item.requirementCompany !== "" &&
          item.requirementCompany !== null &&
          item.salaryRange !== "" &&
          item.salaryRange !== null &&
          item.sourceName !== "" &&
          item.sourceName !== null &&
          item.tatReports !== "" &&
          item.tatReports !== null
        ) {
          return (
            <tr key={index}>
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
              <td style={{ textAlign: "center" }}>
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
                  item.ShortlistedCount ??
                  item.Joining ??
                  item.hrRoundCount ??
                  item.technicalRoundCount ??
                  item.l1RoundCount ??
                  item.l2RoundCount ??
                  item.l3RoundCount}
              </td>
              <td style={{ textAlign: "center" }}>
                {item.totalCount || item.COUNT || item.countCallingTracker || item.candidateCount}
              </td>
              <td style={{ textAlign: "center" }}>
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
                  ]

                  const firstNonNullValue = fields.find((value) => value != null) ?? 0

                  const percentage = ((firstNonNullValue / (item.totalCount ?? 1)) * 100).toFixed(2)

                  return item.totalCount ? `${percentage} %` : "N/A"
                })()}
              </td>
            </tr>
          )
        }
        return null
      })
      .filter(Boolean)
  }

  const calculatePercentages = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0)
    return data.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(2) : 0,
    }))
  }

  const showPopup = (filter) => {
    const setdata = data[filter] || []
    setPopupData({
      filter,
      data: calculatePercentages(setdata).sort((a, b) => b.count - a.count),
    })
  }

  // const handleClickOutside = (e) => {
  //   if (popupRef.current && !popupRef.current.contains(e.target)) {
  //     setPopupData(null);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
  // Rajlaxmi Jagadale Added this code line 122 to 151
  const [isVisible, setIsVisible] = useState(false)
  const dropdownRef = useRef(null)

  const handleButtonClick = () => {
    setIsVisible(!isVisible)
  }
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const [openDropdown, setOpenDropdown] = useState("")

  // const handleDropdownToggle = (label) => {
  //   console.log(label)
  //   setOpenDropdown(label)
  //   selectAllFilters()
  // }
  useEffect(() => {
    fetchData()
  }, [startDate, endDate, openDropdown])

  const handleDropDownCompany = (label) => {
    setOpenCompanyPosition(OpenCompanyPosition === label ? null : label)
  }

  const handleCompanyChange = (event) => {
    setCompanyName(event.target.value)
  }
  const handlePositionChange = (event) => {
    setPosition(event.target.value)
  }
  const handleDateRangeChange = (event) => {
    const selectedRange = event.target.value
    setDateRange(selectedRange)

    const today = new Date()
    let start, end

    switch (selectedRange) {
      case "Current Month":
        // implemented by sahil karnekar to toggle status dive date 18-11-2024
        setshowCustomDiv(false)
        start = startOfMonth(today)
        end = today
        break
      case "Last Month":
        setshowCustomDiv(false)
        start = startOfMonth(subMonths(today, 1))
        end = endOfMonth(subMonths(today, 1))
        break
      case "Last 3 Months":
        setshowCustomDiv(false)
        start = startOfMonth(subMonths(today, 2))
        end = endOfMonth(today)
        break
      case "Last 6 Months":
        setshowCustomDiv(false)
        start = startOfMonth(subMonths(today, 5))
        end = endOfMonth(today)
        break
      case "Last 1 Year":
        setshowCustomDiv(false)
        start = startOfMonth(subYears(today, 1))
        end = today
        console.log(start, end)
        break
      case "custom":
        // Don't set dates for custom option
        setshowCustomDiv(true)
        return
      default:
        return
    }

    setStartDate(format(start, "yyyy-MM-dd"))
    setEndDate(format(end, "yyyy-MM-dd"))
    console.log(startDate)
    console.log(endDate)
  }
  console.log(startDate)
  console.log(endDate)
  const handleCustomStartDateChange = (event) => {
    const date = new Date(event.target.value)
    setCustomStartDate(event.target.value)
    // updated by sahil karnekar dat 18-11-2024
    setStartDate(format(date, "yyyy-MM-dd"))
  }
  // Rajlaxmi JAgadale some changes if that code line 220 to257
  const handleCustomEndDateChange = (event) => {
    const date = new Date(event.target.value)
    setCustomEndDate(event.target.value)
    // updated by sahil karnekar dat 18-11-2024
    setEndDate(format(date, "yyyy-MM-dd"))
  }
  // const selectAllFilters = (event) => {
  //   if (selectAll) {
  //     const allFilters = [
  //       "extraCertificationCounts",
  //       "genderCounts",
  //       "jobDesignationCounts",
  //       "salaryCounts",
  //       "communicationRatingCounts",
  //       "lastCompanyCounts",
  //       "sourceNameCounts",
  //       "pickUpAndDropCounts",
  //       "experienceCounts",
  //       "holdingAnyOfferCounts",
  //       "requirementCompanyCounts",
  //       "noticePeriodCounts",
  //       "incentiveCounts",
  //       "qualificationCounts",
  //       "maritalStatusCounts",
  //       "onRoleCounts",
  //       "ageCounts",
  //       "companyTypeCounts",
  //       "tatReportsCounts",
  //       "distanceCounts",
  //       // "On Role Third Party",
  //       // "Salary"
  //     ]
  //     setSelectedFilters(allFilters)
  //   } else {
  //     setSelectedFilters([])
  //   }
  //   setSelectAll(selectAll)
  // }

  // conditional case created by sahil karnekar date 18-11-2024

  const getDisplayName = (filter) => {
    switch (filter) {
      case "extraCertificationCounts":
        return "Extra Certification"
      case "onRoleCounts":
        return "On Role"
      case "distanceCounts":
        return "Distance"
      case "genderCounts":
        return "Gender"
      case "ageCounts":
        return "Age"
      case "jobDesignationCounts":
        return "Job Designation"
      case "salaryCounts":
        return "Salary"
      case "communicationRatingCounts":
        return "Communication Rating"
      case "lastCompanyCounts":
        return "Last Company"
      case "companyTypeCounts":
        return "Company Type"
      case "sourceNameCounts":
        return "Source Name"
      case "pickUpAndDropCounts":
        return "Pick Up and Drop"
      case "experienceCounts":
        return "Experience"
      case "holdingAnyOfferCounts":
        return "Holding Any Offer"
      case "tatReportsCounts":
        return "TAT Reports"
      case "requirementCompanyCounts":
        return "Requirement Company"
      case "noticePeriodCounts":
        return "Notice Period"
      case "incentiveCounts":
        return "Incentive"
      case "qualificationCounts":
        return "Qualification"
      case "maritalStatusCounts":
        return "Marital Status"
      default:
        return filter // if no match, return the filter name itself
    }
  }

  const fetchData = async () => {
    if (startDate && endDate && openDropdown !== null) {
      console.log(" openDropdown --  " + openDropdown)

      try {
        const response = await axios.get(`${API_BASE_URL}/candidate-history-tracker`, {
          params: {
            startDate: startDate,
            endDate: endDate,
            status: openDropdown,
          },
        })
        console.log("API response:", response.data)
        setData(response.data)
        console.log(data)
      } catch (error) {
        console.error("Error fetching data from API:", error)
      }
    } else {
      console.warn("Missing parameters: startDate, endDate, or openDropdown")
    }
  }
  // Rajlaxmi Jagadale Updated Taht code line 334 to 429
  return (
    <div>
      <div className="HeadingHistory">Candidate History</div>
        {/* Rajlaxmi JAgadale Added taht code Date 08/04/2025 */}

      <ToastContainer position="top-right" autoClose={5000} />

      {/* here are some fields updated by sahil karnekar date 19-11-2024 */}
      <div className="setborderdiv">
        <div className="tracker-date-report-option">
          <div className="histry-date-div">
            <label className={`PI-radio-label ${dateRange === "Current Month" ? "selected" : ""}`}>
              <input
                type="radio"
                value="Current Month"
                id="CurrentMonth"
                name="reportOption"
                onChange={handleDateRangeChange}
              />
              Current Month
            </label>
            <label className={`PI-radio-label ${dateRange === "Last Month" ? "selected" : ""}`}>
              <input
                type="radio"
                value="Last Month"
                id="LastMonth"
                name="reportOption"
                onChange={handleDateRangeChange}
              />
              Last Month
            </label>
            <label className={`PI-radio-label ${dateRange === "Last 3 Months" ? "selected" : ""}`}>
              <input
                type="radio"
                value="Last 3 Months"
                id="Last3Months"
                name="reportOption"
                onChange={handleDateRangeChange}
              />
              Last 3 Months
            </label>
            <label className={`PI-radio-label ${dateRange === "Last 6 Months" ? "selected" : ""}`}>
              <input
                type="radio"
                value="Last 6 Months"
                name="reportOption"
                id="Last6Months"
                onChange={handleDateRangeChange}
              />
              Last 6 Months
            </label>
            <label className={`PI-radio-label ${dateRange === "Last 1 Year" ? "selected" : ""}`}>
              <input
                type="radio"
                value="Last 1 Year"
                name="reportOption"
                id="Last1Year"
                onChange={handleDateRangeChange}
              />
              Last 1 Year
            </label>
            <label className={`PI-radio-label ${dateRange === "custom" ? "selected" : ""}`}>
              <input
                type="radio"
                value="custom"
                checked={dateRange === "custom"}
                name="reportOption"
                id="CustomDate"
                onChange={handleDateRangeChange}
              />
              Custom Date
            </label>
          </div>
          <center>
            <div className="history-tracker-custom-dates">
              {showCustomDiv && (
                <div className="date-inputs">
                  <div className="date-container">
                    <label className="date-label">Start Date:</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={handleCustomStartDateChange}
                      className="date-picker"
                    />
                  </div>

                  <div className="date-container">
                    <label className="date-label">End Date:</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={handleCustomEndDateChange}
                      className="date-picker"
                    />
                  </div>
                </div>
              )}
            </div>
          </center>

          {/* Rajlaxmi JAgadale some changes that code line 432 to 475 */}
        </div>
        {/* LINE 356 to 403 updated by sahil karnekar dat 18-11-2024 */}
        <h4 className="history-tracker-Filter-heading">Filter Options ( Based On Candidate Status )</h4>
        {/* <hr className="hrline"></hr> */}
        <div style={{ marginTop: 0 }} className="history-button-main-div">
          <div className={`history-button-container`}>
            {[
              "Yet To Confirm", //1
              "Interview Schedule", //2
              "Attending After Some time", //3
              "Shortlisted For Hr Round", //4
              "Shortlisted For Technical Round", //5
              "Shortlisted For L1 Round", //6
              "Inactive", //19
              "Shortlisted For L2 Round", //7
              "Shortlisted For L3 Round", //8
              "Selected", //9
              "Rejected", //10
              "Hold", //11
              "Joining", //12
              "Drop Out", //13
              "To Join", //14
              "Joined", //15
              "Not Joined", //16
              "No Show", //17
              "Active", //18
            ].map((label) => (
              <div key={label} className="bha-dropdown">
                <button
                  className={`bhafilter-button ${openDropdown === label ? "active" : ""}`}
                  onClick={() => handleDropdownToggle(label)}
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {/* Rajlaxmi Jagadale some updated that field */}
        {openDropdown && (
          <div className="Candi-History-tracker-div">
            <div className="history-filtter-data-div">
              <div className="history-main-div">
                <button onClick={handleButtonClick} className="lineUp-Filter-btnhistory newclassforpaddingdata">
                  {isVisible ? "Hide Filters" : "Show Filters"}
                </button>
                &nbsp; &nbsp;
                {/* Rajlaxmi jagadale UPdated taht code */}
                {isVisible && selectedFilters.length !== allFilters.length && (
                  <button onClick={selectAllFilters} className="lineUp-Filter-btnhistory newclassforpaddingdata">
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
            {/* Rajlaxmi jagadale updated taht code */}
              {isVisible && selectedFilters.length > 0 && (
                <span className="handlePrintDivhistory">
                  <button className="lineUp-Filter-btnhistory margin-left-set newclassforpaddingdata" onClick={handleClearAll}>
                    Clear Filters
                  </button>
                </span>
              )}

              <div className="">
                {/* rajlaxmi jagadale Updated That code */}
                {selectedFilters.length > 0 && (
                  <span className="handlePrintDivhistory">
                    <button
                      className={`newclassforpaddingdata lineUp-Filter-btnhistory margin-left-set ${isPdfGenerating ? "pdf-generating" : ""}`}
                      onClick={handleExportPDF}
                      disabled={isPdfGenerating}
                    >
                      {isPdfGenerating ? "Generating PDF..." : "Export PDF"}
                    </button>
                  </span>
                )}
              </div>
            </div>
            {/* Rajlaxmi Jagadale work on filters  */}
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
                </div>
                <div className="inner-Candi-History-tracker-div">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="companyTypeCounts"
                      checked={selectedFilters.includes("companyTypeCounts")}
                      onChange={handleFilterChange}
                    />{" "}
                    Company Type Counts
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="tatReportsCounts"
                      checked={selectedFilters.includes("tatReportsCounts")}
                      onChange={handleFilterChange}
                    />{" "}
                    TAT Reports
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
              </div>
            )}
          </div>
        )}
      </div>
      {/* <h5>{openDropdown}</h5> */}
      <div className="can-history-filter-data-section" ref={policyRef} id="issue-containers">
        {/* rajlaxmi jagadale Updated That code */}
        {selectedFilters.map((filter) => {
          const setData = data[filter] || []
          // Show all data when in PDF mode, otherwise only show first 6 items
          const sortedData = isPdfMode
            ? setData.sort((a, b) => b.count - a.count)
            : setData.sort((a, b) => b.count - a.count).slice(0, 6)
          const hasMoreItems = setData.length > 6 && !isPdfMode

          // added by sahil karnekar
          const displayName = getDisplayName(filter)
          // Rajlaxmi Jaggadale update that code
          return (
            <div className="can-history-filter-data" key={filter}>
              <div className="history-tracker-table-header">
                {/* <p>
                  {" "}
                  <strong>Company Name :</strong> {companyName}
                </p>
                <p>
                  {" "}
                  <strong>Position :</strong> {position}
                </p> */}
                <p>
                  <strong>Category :</strong> {openDropdown} &nbsp; &nbsp; &nbsp;
                  <strong>Filtered Data by :</strong> {displayName}
                </p>
                {/* <p> <strong>Data for : - </strong> {monthSelector}</p> */}
              </div>
              <div className="can-history-filter-data-content">
                <div className="can-history-data-table-container">
                  <table className="can-history-data-table">
                    <thead>
                      <tr>
                        <th className="history-tracker-th">{displayName}</th>
                        <th className="history-tracker-th">{openDropdown + " Count"}</th>
                        <th className="history-tracker-th">Total Count</th>
                        <th className="history-tracker-th">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* updated by sahil karnekar date 18-11-2024 */}
                      {calculatePercentages(sortedData).map(
                        (item, index) =>
                          item.gender !== "" &&
                          item.gender !== null &&
                          item.communicationRating !== "" &&
                          item.communicationRating !== null &&
                          item.companyType !== "" &&
                          item.companyType !== null &&
                          item.distanceRange !== "" &&
                          item.distanceRange !== null &&
                          item.extraCertification !== "" &&
                          item.extraCertification !== null &&
                          item.holdingAnyOffer !== "" &&
                          item.holdingAnyOffer !== null &&
                          item.incentiveRange !== "" &&
                          item.incentiveRange !== null &&
                          item.jobDesignation !== "" &&
                          item.jobDesignation !== null &&
                          item.lastCompany !== "" &&
                          item.lastCompany !== null &&
                          item.maritalStatus !== "" &&
                          item.maritalStatus !== null &&
                          item.onRole !== "" &&
                          item.onRole !== null &&
                          item.pickUpAndDrop !== "" &&
                          item.pickUpAndDrop !== null &&
                          item.qualification !== "" &&
                          item.qualification !== null &&
                          item.requirementCompany !== "" &&
                          item.requirementCompany !== null &&
                          item.salaryRange !== "" &&
                          item.salaryRange !== null &&
                          item.sourceName !== "" &&
                          item.sourceName !== null &&
                          item.tatReports !== "" &&
                          item.tatReports !== null && (
                            <tr key={index}>
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
                              <td style={{ textAlign: "center" }}>
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
                                  item.ShortlistedCount ??
                                  item.Joining ??
                                  item.hrRoundCount ??
                                  item.technicalRoundCount ??
                                  item.l1RoundCount ??
                                  item.l2RoundCount ??
                                  item.l3RoundCount}
                              </td>

                              <td style={{ textAlign: "center" }}>
                                {item.totalCount || item.COUNT || item.countCallingTracker || item.candidateCount}
                              </td>
                              <td style={{ textAlign: "center" }}>
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
                                  ]

                                  // Find the first non-null or non-undefined value
                                  const firstNonNullValue = fields.find((value) => value != null) ?? 0

                                  // Calculate percentage
                                  const percentage = ((firstNonNullValue / (item.totalCount ?? 1)) * 100).toFixed(2)

                                  // Return percentage with a fallback for empty data
                                  return item.totalCount ? `${percentage} %` : "N/A"
                                })()}
                              </td>
                            </tr>
                          ),
                      )}
                    </tbody>
                  </table>
                </div>
                {hasMoreItems && (
                  <button className="can-history-more-items" onClick={() => showPopup(filter)}>
                    More Items
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {/* Rajlaxmi Jagadale work on Button header table */}
      {popupData && (
        <div className="can-history-popup">
          <div className="can-history-popup-contents" ref={popupRef}>
            <div className="can-history-popup-header-top-div">
              <div className="can-history-popup-header-fist-div">
                <h3 className="candidate-his-center-text">
                  <strong className="popheading">{getDisplayName(popupData.filter)}</strong>
                </h3>
              </div>
              <div>
                <button className="can-history-close-button" onClick={() => setPopupData(null)}>
                  ×
                </button>
              </div>
            </div>

            <div className="can-history-popup-content">
              <table className="can-history-data-table">
                <thead className="theading">
                  <tr>
                    <th className="history-tracker-th">{getDisplayName(popupData.filter)}</th>
                    <th className="history-tracker-th" style={{ textAlign: "center" }}>
                      {openDropdown + " " + "Count"}
                    </th>
                    <th className="history-tracker-th">Total Count</th>
                    <th className="history-tracker-th"> Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {/* updated by sahil karnekar date 18-11-2024 */}
                  {popupData.data.map(
                    (item, index) =>
                      item.gender !== "" &&
                      item.gender !== null &&
                      item.communicationRating !== "" &&
                      item.communicationRating !== null &&
                      item.companyType !== "" &&
                      item.companyType !== null &&
                      item.distanceRange !== "" &&
                      item.distanceRange !== null &&
                      item.extraCertification !== "" &&
                      item.extraCertification !== null &&
                      item.holdingAnyOffer !== "" &&
                      item.holdingAnyOffer !== null &&
                      item.incentiveRange !== "" &&
                      item.incentiveRange !== null &&
                      item.jobDesignation !== "" &&
                      item.jobDesignation !== null &&
                      item.lastCompany !== "" &&
                      item.lastCompany !== null &&
                      item.maritalStatus !== "" &&
                      item.maritalStatus !== null &&
                      item.onRole !== "" &&
                      item.onRole !== null &&
                      item.pickUpAndDrop !== "" &&
                      item.pickUpAndDrop !== null &&
                      item.qualification !== "" &&
                      item.qualification !== null &&
                      item.requirementCompany !== "" &&
                      item.requirementCompany !== null &&
                      item.salaryRange !== "" &&
                      item.salaryRange !== null &&
                      item.sourceName !== "" &&
                      item.sourceName !== null &&
                      item.tatReports !== "" &&
                      item.tatReports !== null && (
                        <tr key={index}>
                          <td style={{ width: "25px" }}>
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
                          <td style={{ textAlign: "center" }}>
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
                              item.ShortlistedCount ??
                              item.Joining}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {item.totalCount || item.COUNT || item.countCallingTracker || item.candidateCount}
                          </td>
                          <td style={{ textAlign: "center" }}>
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
                              ]

                              // Find the first non-null or non-undefined value
                              const firstNonNullValue = fields.find((value) => value != null) ?? 0

                              // Calculate percentage
                              const percentage = ((firstNonNullValue / (item.totalCount ?? 1)) * 100).toFixed(2)

                              // Return percentage with a fallback for empty data
                              return item.totalCount ? `${percentage} %` : "N/A"
                            })()}
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Rajlaxmi Jagadale Added that code  line 1253/1263*/}
      {/* Show loading overlay when generating PDF */}
      {isPdfGenerating && (
        <div className="pdf-loading-overlay">
          <div className="pdf-loading-spinner"></div>
          <div className="pdf-loading-text">Generating PDF...</div>
        </div>
      )}

      {/* Show error message if PDF generation fails */}
      {pdfError && <div className="pdf-error-message">{pdfError}</div>}
    </div>
  )
}

export default CandidateHistoryTracker