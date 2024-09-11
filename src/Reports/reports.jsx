/* Ajhar-reports.jsx-10-07-2024-lineNo-1-to-633 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../Reports/reports.css"
import CreateReportTable from "../Reports/CreateReportTable";
import ReportsPieChart from "../Reports/reportsPieChart"
// import ProgressBar from "./progressBar";
import axios from "axios";
import { API_BASE_URL } from "../api/api";


function Accesstable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedMainAdmin, setSelectedMainAdmin] = useState(null);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);
    const [selectedRecruiters, setSelectedRecruiters] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [allSelected, setAllSelected] = useState(false);
    const [editRecruiter, setEditRecruiter] = useState(null);
    const [openCategory, setOpenCategory] = useState(null); // New state for open category
    const [showReport, setShowReport] = useState(false); // State to control the visibility of the report

  
    //Name:-Akash Pawar Component:-Team_Leadder Subcategory:-Assign Column TeamLeader Names and Recruiter Names(changed) Start LineNo:-17  Date:-03/07
    const [teamLeaderNames, setTeamLeaderNames] = useState([]);
    const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]);
  

    const [startDate,setStartDate]=useState('');
  const [endDate,setEndDate]=useState('');
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  const [showReportData, setshowReportData] = useState(false);
  const [showToggle, setShowToggle] = useState(false);



  const [data, setData] = useState([
    { month: 'Last Month', value: ["Selected: 100 ","Rejected :200 ","LineUp :300 "] },
    { month: 'Last 3 Months', value:["Selected: 100 ","Rejected :200 ","LineUp :300 "] },
    { month: 'Last 6 Months', value: ["Selected: 100 ","Rejected :10 ","LineUp :300 "] },
    { month:'Last 1 Year',value:["Selected: 100 ","Rejected :200 ","LineUp :300 "] } ,
    { month:'Custom Date',value:["Selected: 100 ","Rejected :200 ","LineUp :300 "] },
    { month:'Joining Date',value:["Selected: 10 ","Rejected :20 ","LineUp :600 "]}
    
  ]);

  const [date1,setDate1]=useState([
    { date: '2024-06-01', value: 100 },
    { date: '2024-06-05', value: 150 },
    { date: '2024-06-10', value: 200 },
    { date: '2024-05-15', value: 120 }, // Last month data
    { date: '2024-05-20', value: 180 },
  ])

 
  const handleStartDateChange=(event)=>{
    setStartDate(event.target.value);
  }

  const handleEndDateChange=(event)=>{
    setEndDate(event.target.value);
  }
  
  const showDataReport=()=>{
    setshowReportData(true);
  }
  
  const handleToggle = () => {
    
    setShowToggle(!showToggle); 
    setShowCustomDiv(false);
    setshowReportData(false)
  };
 
  const handleFilterData = () => {
    const filtered = data.filter(entry => {
      return entry.date >= startDate && entry.date <= endDate;
    });
    setFilteredData(filtered);
  };
  
  // State to track the currently selected month
  const [selectedMonth, setSelectedMonth] = useState('Last 6 Months');

  // Handler function for radio button change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const showCustomDateDiv=()=>{
    setShowCustomDiv(true);
  }
  const hideCustomDateDiv=()=>{
    setShowCustomDiv(false);
  }
 // Filtered data based on selected month
  const filteredData = data.find(entry => entry.month === selectedMonth);



    useEffect(() => {
      const fetchTeamLeaderNames = async () => {
        const response = await axios.get(
          `${API_BASE_URL}/tl-namesIds`
        );
        setTeamLeaderNames(response.data);
      };
      fetchTeamLeaderNames();
    }, []);
  
    const fetchRecruiterUnderTeamLeader = useCallback(async () => {
    //   const response = await axios.get(
    //     ` http://192.168.1.42:7676/emp-stats/api/dailywork/api/work-summary/${selectedTeamLeader}`
    
    //   );
      const response = await axios.get(
        `${API_BASE_URL}/byTeamLeader/${selectedTeamLeader}`
      );
      setRecruiterUnderTeamLeader(response.data);
    }, [selectedTeamLeader]);
  
    useEffect(() => {
      if (selectedTeamLeader != null) {
        fetchRecruiterUnderTeamLeader();
      }
    }, [selectedTeamLeader, fetchRecruiterUnderTeamLeader]);
  
    //Name:-Akash Pawar Component:-Team_Leadder Subcategory:-Assign Column TeamLeader Names and Recruiter Names(changed) End LineNo:-44  Date:-03/07
  
    const teamLeaders = useMemo(
      () => [
        {
          label: "Team Leader 1",
          recruiters: [
            "Recruiter 1",
            "Recruiter 2",
            "Recruiter 3",
            "Recruiter 4",
            "Recruiter 5",
          ],
        },
        {
          label: "Team Leader 2",
          recruiters: [
            "Recruiter 6",
            "Recruiter 7",
            "Recruiter 8",
            "Recruiter 9",
            "Recruiter 10",
          ],
        },
      ],
      []
    );
  
    const options = useMemo(
      () => [
        { label: "Date", category: "Common Assign" },
        { label: "Recruiter Name", category: "Common Assign" },
        { label: "Candidate ID", category: "Common Assign" },
        { label: "Date Of Birth", category: "Common Assign" },
        { label: "Candidate Name", category: "Common Assign" },
        { label: "Candidate Email", category: "Common Assign" },
        { label: "Contact Number", category: "Common Assign" },
        { label: "Alternate Number", category: "Common Assign" },
        { label: "Education", category: "Common Assign" },
        { label: "Current Location", category: "Common Assign" },
        { label: "Gender", category: "Common Assign" },
        { label: "Year of passing", category: "Common Assign" },
        { label: "Resume uploaded", category: "Common Assign" },
        { label: "Any Extra Certification", category: "Common Assign" },
        { label: "Experience", category: "Common Assign" },
        { label: "Candidate interested /not", category: "Common Assign" },
  
        { label: "Source Name", category: "Important Assign" },
        { label: "Applying Company ID", category: "Important Assign" },
        { label: "Applying For Position", category: "Important Assign" },
        { label: "Applying Company Name", category: "Important Assign" },
        { label: "Current company Location", category: "Important Assign" },
        { label: "Communication Rating", category: "Important Assign" },
        { label: "Candidate Interested", category: "Important Assign" },
  
        { label: "Calling Feedback", category: "Most Important Assign" },
        { label: "Interview Feedback", category: "Most Important Assign" },
        { label: "Candidate Feedback", category: "Most Important Assign" },
        { label: "Job ID", category: "Most Important Assign" },
        { label: "Current Company Location", category: "Most Important Assign" },
      ],
      []
    );
    const handleOkClick = () => {
        setDropdownOpen(false);
        setShowReport(true);
      };
    const handleSearchChange = useCallback((event) => {
      setSearchTerm(event.target.value);
    }, []);
  
    const toggleDropdown = useCallback(() => {
      setDropdownOpen((prev) => !prev);
    }, []);
  
    const handleOptionChange = useCallback((event) => {
      const { value, checked } = event.target;
      setSelectedOptions((prev) =>
        checked ? [...prev, value] : prev.filter((option) => option !== value)
      );
    }, []);

    const handleSelectAll = () => {
        if (allSelected) {
          setSelectedOptions([]);
        } else {
          const allRowIds = columnName
            .filter((cat) => openCategory === cat.columnCategory)
            .map((item) => item.columnId);
          setSelectedOptions(allRowIds);
        }
        setAllSelected(!allSelected);
      };
  
    const assignOptionsToRecruiters = useCallback(() => {
      const updatedAssignments = { ...assignments };
  
      const recruitersToUpdate =
        selectedRecruiters.length > 0
          ? selectedRecruiters
          : selectedTeamLeader
          ? [selectedTeamLeader]
          : selectedMainAdmin
          ? [selectedMainAdmin]
          : [];
  
      recruitersToUpdate.forEach((recruiter) => {
        if (!updatedAssignments[recruiter]) {
          updatedAssignments[recruiter] = {
            "Common Assign": [],
            "Important Assign": [],
            "Most Important Assign": [],
          };
        }
        selectedOptions.forEach((option) => {
          const category = options.find((opt) => opt.label === option)?.category;
          if (
            category &&
            !updatedAssignments[recruiter][category].includes(option)
          ) {
            updatedAssignments[recruiter][category].push(option);
          }
        });
      });
  
      setAssignments(updatedAssignments);
      setSelectedMainAdmin(null);
      setSelectedTeamLeader(null);
      setSelectedRecruiters([]);
      setSelectedOptions([]);
      setEditRecruiter(null);
    }, [
      assignments,
      selectedMainAdmin,
      selectedTeamLeader,
      selectedRecruiters,
      selectedOptions,
      options,
    ]);
  
    const filteredRecruiters = useMemo(() => {
      return teamLeaderNames.reduce((acc, leader) => {
        const leaderNameMatch = leader.teamLeaderName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const recruiters = leader.recruiters || []; // Ensure recruiters is defined
        const filteredRecruiters = recruiters.filter((recruiter) =>
          recruiter[1].toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        if (leaderNameMatch || filteredRecruiters.length > 0) {
          acc.push({
            ...leader,
            recruiters: leaderNameMatch ? recruiters : filteredRecruiters,
          });
        }
  
        return acc;
      }, []);
    }, [teamLeaderNames, searchTerm]);
  
    const groupedOptions = useMemo(
      () =>
        options.reduce((grouped, option) => {
          const category = option.category;
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(option);
          return grouped;
        }, {}),
      [options]
    );
  
    const toggleCategoryDropdown = (category) => {
      setOpenCategory((prev) => (prev === category ? null : category));
    };
  
    // const toggleSelectAll = useCallback(() => {
    //   if (allSelected) {
    //     setSelectedRecruiters([]);
    //   } else {
    //     setSelectedRecruiters(filteredRecruiters);
    //   }
    //   setAllSelected((prev) => !prev);
    // }, [allSelected, filteredRecruiters]);
  
    const handleUpdateClick = (recruiter) => {
      setEditRecruiter(recruiter);
      setSelectedRecruiters([recruiter]);
      setSelectedOptions(
        Object.keys(assignments[recruiter] || {}).reduce(
          (options, category) => [
            ...options,
            ...assignments[recruiter][category],
          ],
          []
        )
      );
      setDropdownOpen(false);
    };
  
    const handleRemoveClick = (recruiter) => {
      setSelectedRecruiters((prev) => prev.filter((item) => item !== recruiter));
      const updatedAssignments = { ...assignments };
      delete updatedAssignments[recruiter];
      setAssignments(updatedAssignments);
    };
  
    function getClassForCategory(category) {
      switch (category) {
        case "Common Assign":
          return "common-assign";
        case "Important Assign":
          return "important-assign";
        case "Most Important Assign":
          return "most-important-assign";
        default:
          return "";
      }
    }
  
    return (
      <div className="report-AppsTL">
        <div className="reports-selection-containerTL">
          
          <div className="report-hierarchy-sectionTL">

            <div className="report-custom-dropdownTL">
          
              <div className="reports-Admin-Dropdown" onClick={toggleDropdown}>
                {selectedRecruiters.length === 0
                  ? "Admin"
                  : `${selectedRecruiters.length} Recruiter(s) selected`}
                <span
                  className={`dropdown-icon_open ${dropdownOpen ? "open" : ""}`}
                >
                  &#9660;
                </span>
              </div>
              {dropdownOpen && (
                <div className="report-dropdown-bodyTL">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-inputTL"
                  />
                  
                  
                  <div className="report-buttons-div">
                  <button
                    className="report-category-share-btn"
                    onClick={handleSelectAll}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>

                  <button className="report-ok-button" onClick={handleOkClick}     
                  >
                    OK
                  </button>
                  
                  <button
                    className="report-reset-selectTL-button"
                    onClick={() => {
                      setSelectedTeamLeader(null);
                      setSelectedRecruiters([]);
                    }}
                  >
                    Reset
                  </button>
                </div>
                  <div className="team-leadersTL">
                    {filteredRecruiters.map((leader, index) => (
                      <div
                        key={index}
                        className="team-leader-itemTL checkbox-teamleader-assign radio-teamleader-assign"
                      >
                        <label>
                          <input
                            type="checkbox"
                            name="teamLeader"
                            value={leader.teamLeaderId}
                            checked={selectedTeamLeader === leader.teamLeaderId}
                            onChange={() =>
                              setSelectedTeamLeader(leader.teamLeaderId)
                            }
                          />
                          {leader.teamLeaderName}
                        </label>
                        {selectedTeamLeader === leader.teamLeaderId &&
                          recruiterUnderTeamLeader && (
                            <div className="recruitersTL">
                              {recruiterUnderTeamLeader.map(
                                (recruiter, rIndex) => (
                                  <label key={rIndex}>
                                    <input
                                      type="checkbox"
                                      name="recruiter"
                                      value={recruiter[0]}
                                      checked={selectedRecruiters.includes(
                                        recruiter[0]
                                      )}
                                      onChange={() =>
                                        setSelectedRecruiters([recruiter[0]])
                                      }
                                    />
                                    {recruiter[1]}
                                  </label>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
  
          <div className="options-section">
           
            {/* <div className="report-DetailsReport-btn">
              <button
                onClick={()=>setShowReport(true)}
                
                className="report-assign-optionbtn"
              >
                {editRecruiter ? "Update Options" : "Details Report"}

              </button>
            </div> */}
          </div>
        </div>
        

        {/* ---------------------------------------------------------------------? */}
        {showReport && (
   
    <div>
        <div className="month-report">
          <div className="reports-heading-report">
           {/* <h2>Report</h2> */}
          </div>
      <div className="month-selector">
        <label>
          <input
            type="radio"
            value="Last Month"
            checked={selectedMonth === 'Last Month'}
            onChange={handleMonthChange}
            onClick={handleToggle} 
            // onClick={hideCustomDateDiv}
          />
          Last Month
        </label>
        <label>
          <input
            type="radio"
            value="Last 3 Months"
            checked={selectedMonth === 'Last 3 Months'}
            onChange={handleMonthChange}
            onClick={handleToggle} 
            // onClick={hideCustomDateDiv}
          />
          Last 3 Months
        </label>
        <label>
          <input
            type="radio"
            value="Last 6 Months"
            checked={selectedMonth === 'Last 6 Months'}
            onChange={handleMonthChange}
            onClick={handleToggle} 
            // onClick={hideCustomDateDiv}
          />
          Last 6 Months
        </label>

        <label>
          <input
            type='radio'
            value="Last 1 Year"
            checked={selectedMonth==="Last 1 Year"}
            onChange={handleMonthChange}
            onClick={handleToggle} 
            // onClick={hideCustomDateDiv}
            />
            Last 1 Year
        </label>
        

      <label>
        <input 
          type='radio'
          value="Custom Date"
          checked={selectedMonth==="Custom Date"}
          onChange={handleMonthChange}
          // onClick={handleToggle} 
           onClick={showCustomDateDiv}
          />
          Custom Date
      </label>
      <label>
        <input 
          type='radio'
          value="Joining Date"
          checked={selectedMonth==="Joining Date"}
          onChange={handleMonthChange}
          onClick={handleToggle} 
          // onClick={hideCustomDateDiv}
          />
          Joining Date
      </label>

      {filteredData &&  (
          <div className='filterDataButton'>
            <button className='filterDataButton1' onClick={showDataReport} >Get Report</button>
          </div>
      )}
      
      </div>
      {
      showCustomDiv && (
        <div>
      <div className="date-inputs" >

        <label>
          Start Date:
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </label>
      
      
      <div className='filterDataButton'>
        <button onClick={handleFilterData}>Filter Data</button>
        </div>
      </div>
      </div>
      )}
      
    
      
     
      </div>

           {showReportData ? (

            <div className="kingmaker">
              {/* <ProgressBar/> */}
              <CreateReportTable/>
              <ReportsPieChart  />

            </div>

        //   <div className="report">
        //   <h3>{filteredData.month} Report</h3>

        //   <div className='candidate-report'>

        //   <select>

        // {selectedCandidate.map((option, index) => (
        //   <option key={index} value={option.value}>{option.label}</option>
        // ))}
        // </select>

        // <select>
        // {rejectedCandidate.map((option, index) => (
        //   <option key={index} value={option.value}>{option.label}</option>
        // ))}
        // </select>

        // <select>
        // {linedUpCandidate.map((option, index) => (
        //   <option key={index} value={option.value}>{option.label}</option>
        // ))}
        // </select>

        // </div>
        
        //   </div>
        
      ):(<p></p>)} 
    
    </div>
    

        )}

   


      </div>
    );
  }
  
  export default Accesstable;







  

  
 









  