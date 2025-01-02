{/* Name:-Prachi Parab Component:-Report data page
           End LineNo:-1 to 249 Date:-04/07 */}
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import "../Reports/MainReportDatapage.css";
import CreateReportTable from "../Reports/CreateReportTable";
import axios from "axios";
import { json, useParams } from "react-router-dom";
import "../Reports/MainReportDatapage.css";
import { API_BASE_URL } from "../api/api";
import { data } from 'autoprefixer';


const MonthReport = () => {
  const { userType } = useParams();
  const { employeeId } = useParams();
  const [reportDataDatewise, setReportDataDatewise] = useState(null);
  const [showReportData, setshowReportData] = useState(false);

  const [openSelectDate, setOpenSelectDate] = useState(false);
  const handleOpenSelectDate = () => {
    setOpenSelectDate(!openSelectDate);
  }
  const [managersList, setManagersList] = useState([]);
  const handleDisplayManagers = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/get-all-managers`
    );
    setManagersList(response.data);
    setDisplayManagers(true);
  }
  console.log(managersList);

  const scrollLeft = () => {
    const container = document.querySelector(".typesOfReportDiv");
    container.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = document.querySelector(".typesOfReportDiv");
    container.scrollBy({ left: 300, behavior: "smooth" });
  };
const [teamLeadersList, setTeamLeadersList]= useState([]);
  const handleOpenDownArrowContent = (managerid)=>{
    const fetchTeamLeaderNames = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${managerid}`
      );
      setTeamLeadersList(response.data);
setDisplayTeamLeaders(true);

    };
    if (managerid != "") {
      fetchTeamLeaderNames();
    }
    
  }
const [recruitersList, setRecruitersList] = useState([]);
  const handleOpenDownArrowContentForRecruiters = async (teamLeaderId)=>{
    setDisplayRecruiters(false);
    const response = await axios.get(
      `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
    );
    setRecruitersList(response.data);
    console.log(response.data);
    setDisplayRecruiters(true);
  }

const [openReport, setOpenReport]= useState(false);
const handleRadioChange = async (completeValueObject) => {
  let userTypeForApi = "";
  let userIdForApi = "";

  if (completeValueObject.jobRole === "Manager") {
      userTypeForApi = completeValueObject.jobRole;
      userIdForApi = completeValueObject.managerId;
      setDisplayTeamLeaders(false);
      setDisplayRecruiters(false);
  } else if (completeValueObject.jobRole === "TeamLeader") {
      userTypeForApi = completeValueObject.jobRole;
      userIdForApi = completeValueObject.teamLeaderId;
      setDisplayRecruiters(false);
  } else if (completeValueObject.jobRole === "Recruiters") {
      userTypeForApi = completeValueObject.jobRole;
      userIdForApi = completeValueObject.employeeId;
  }

  console.log("Complete Value Object:", completeValueObject);
console.log(showCustomDiv);
if (showCustomDiv === true) {
  setStartDate1(customStartDate);
  setEndDate1(customEndDate);
}

  try {
      const response = await axios.get(
          `http://rg.157careers.in/api/ats/157industries/report-count/${userIdForApi}/${userTypeForApi}/${startDate1}/${endDate1}`
      );
      console.log("API Response:", response.data);
      setReportDataDatewise(response.data);
      setshowReportData(true);
      setOpenReport(true);
  } catch (error) {
      console.error("Error fetching report data:", error);
     
  }
};


console.log(reportDataDatewise);
 const [displayManagers, setDisplayManagers] = useState(false);
 const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false);
 const [displayRecruiters, setDisplayRecruiters] = useState(false);


// date inputs
const [selectedOption, setSelectedOption] = useState("");
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const[startDate1, setStartDate1]=useState('');
  const[endDate1, setEndDate1]=useState('');

  const calculateDateRange = (option) => {
    const today = new Date();
    let startDate, endDate;

    switch (option) {
      case "Current Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "Last Month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "Last 3 Months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "Last 6 Months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "Last 1 Year":
        startDate = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      default:
        break;
    }

    return { startDate, endDate };
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "custom") {
      setShowCustomDiv(true);
    } else {
      setShowCustomDiv(false);

      // Calculate date range for predefined options and apply the changes
      const { startDate, endDate } = calculateDateRange(value);
      console.log("Date Range Applied:", {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      setStartDate1(startDate.toISOString().split("T")[0]);
      setEndDate1(endDate.toISOString().split("T")[0]);
      setDisplayMnagerDivWithBtn(true);
      // Call your API or apply the filter logic here
    }
  };

  const handleCustomStartDateChange = (event) => {
    setCustomStartDate(event.target.value);
    if (event.target.value && customEndDate) {
      applyCustomDateRange(event.target.value, customEndDate);
      setDisplayMnagerDivWithBtn(true);
    }
  };

  const handleCustomEndDateChange = (event) => {
    setCustomEndDate(event.target.value);
    if (customStartDate && event.target.value) {
      applyCustomDateRange(customStartDate, event.target.value);
      setDisplayMnagerDivWithBtn(true);
    }
  };

  const applyCustomDateRange = (start, end) => {
    console.log("Custom Date Range Applied:", {
      startDate: start,
      endDate: end,
    });
  };

  const[displayMnagerDivWithBtn, setDisplayMnagerDivWithBtn] = useState(false);

  return (
    <>
      <div className="listofButtons11">

        <button className="scrollButton left" onClick={scrollLeft}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        </button>


        <div className="typesOfReportDiv">

          <div className="typeofReportSubDiv"
            onClick={handleOpenSelectDate}
          >
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Candidate Report
              </div>
            </div>
          </div>

          <div className="typeofReportSubDiv">
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Invoice Report
              </div>
            </div>
          </div>

          <div className="typeofReportSubDiv">
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Recruiters Report
              </div>
            </div>
          </div>

          <div className="typeofReportSubDiv">
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Candidate Report
              </div>
            </div>
          </div>

          <div className="typeofReportSubDiv">
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Candidate Report
              </div>
            </div>
          </div>

          <div className="typeofReportSubDiv">
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Candidate Report
              </div>
            </div>
          </div>

          <div className="typeofReportSubDiv">
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Candidate Report
              </div>
            </div>
          </div>



          <div className="typeofReportSubDiv">
            <div className="subdiviconandtext">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" /></svg>
            </div>
            <div className="subdiviconandtext1">
              <div className="textDiv1">
                Candidate Report
              </div>
            </div>
          </div>
        </div>
        <button className="scrollButton right" onClick={scrollRight}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
        </button>
      </div>


      {
        openSelectDate && (
          <div className="tracker-date-report-option">
          <div className="histry-date-div">
            <label className="PI-radio-label">
              <input
                type="radio"
                value="Current Month"
                id="CurrentMonth"
                name="reportOption"
                checked={selectedOption === "Current Month"}
                onChange={handleOptionChange}
              />
              Current Month
            </label>
            <label className="PI-radio-label">
              <input
                type="radio"
                value="Last Month"
                id="LastMonth"
                name="reportOption"
                checked={selectedOption === "Last Month"}
                onChange={handleOptionChange}
              />
              Last Month
            </label>
            <label className="PI-radio-label">
              <input
                type="radio"
                value="Last 3 Months"
                id="Last3Months"
                name="reportOption"
                checked={selectedOption === "Last 3 Months"}
                onChange={handleOptionChange}
              />
              Last 3 Months
            </label>
            <label className="PI-radio-label">
              <input
                type="radio"
                value="Last 6 Months"
                name="reportOption"
                id="Last6Months"
                checked={selectedOption === "Last 6 Months"}
                onChange={handleOptionChange}
              />
              Last 6 Months
            </label>
            <label className="PI-radio-label">
              <input
                type="radio"
                value="Last 1 Year"
                name="reportOption"
                id="Last1Year"
                checked={selectedOption === "Last 1 Year"}
                onChange={handleOptionChange}
              />
              Last 1 Year
            </label>
            <label className="PI-radio-label">
              <input
                type="radio"
                value="custom"
                name="reportOption"
                id="CustomDate"
                checked={selectedOption === "custom"}
                onChange={handleOptionChange}
              />
              Custom Date
            </label>
          </div>
          <center>
            <div className="history-tracker-custom-dates">
              {showCustomDiv && (
                <div className="date-inputs">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={handleCustomStartDateChange}
                  />
  
                  <label>End Date:</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={handleCustomEndDateChange}
                  />
                </div>
              )}
            </div>
          </center>
        </div>
        )
      }

{
  displayMnagerDivWithBtn && (
    <div className="mainUserDropdown1">
    <button
      onClick={handleDisplayManagers}
    >Manager</button>

    <div className="mainForLists">

   
   {
    displayManagers && (
      <div className="listviewofmanagerswithcheckboxandarrow">
      {
        managersList.map((managerList, index) => (
          <div key={index} className="manager-item">
            <input type="radio" name="selectManager" 
            onChange={() =>
                handleRadioChange(
                    managerList
                )
            }
            />
            <span
              className='spanformanagerlistname'
            >{managerList.managerName}
              <svg
              onClick={((e)=>handleOpenDownArrowContent(managerList.managerId))}
              xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>
            </span>
          </div>
        ))
      }
    </div>
    )
   }
   {
    displayTeamLeaders && (
      <div className="listviewofmanagerswithcheckboxandarrow">
      {
        teamLeadersList.map((teamLeadersList, index) => (
          <div key={index} className="manager-item">
            <input type="radio" name="selectManager" 
             onChange={() =>
              handleRadioChange(
                teamLeadersList
              )
          }
            />
            <span
              className='spanformanagerlistname'
            >{teamLeadersList.teamLeaderName}
              <svg
              onClick={((e)=>handleOpenDownArrowContentForRecruiters(teamLeadersList.teamLeaderId))}
              xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>
            </span>
          </div>
        ))
      }
    </div>
    )
   }
   
{
displayRecruiters && (
<div className="listviewofmanagerswithcheckboxandarrow">
{
recruitersList.map((recruiterList, index) => (
  <div key={index} className="manager-item">
    <input type="radio" name="selectManager" 
       onChange={() =>
        handleRadioChange(
          recruiterList
        )
    }
    />
    <span
      className='spanformanagerlistname'
    >{recruiterList.employeeName}
      
    </span>
  </div>
))
}
</div>
)
}

   

    </div>


  </div>
  )
}
    

{
  openReport && (
<CreateReportTable reportDataDatewise={reportDataDatewise}/>
  )
}
      
    </>
  );
};

export default MonthReport;
