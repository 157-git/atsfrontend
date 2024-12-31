{/* Name:-Prachi Parab Component:-Report data page
           End LineNo:-1 to 249 Date:-04/07 */}
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import "../Reports/MainReportDatapage.css";
import CreateReportTable from "../Reports/CreateReportTable";
import axios from "axios";
import { json, useParams } from "react-router-dom";
import "../Reports/MainReportDatapage.css";
import { API_BASE_URL } from "../api/api";


const MonthReport = () => {
  const { userType } = useParams();
  const { employeeId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMainAdmin, setSelectedMainAdmin] = useState(null);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [allSelected, setAllSelected] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [columnName, setColumnName] = useState(null);
  const [editRecruiter, setEditRecruiter] = useState(null);
  const [openCategory, setOpenCategory] = useState(null); // New state for open category
  const [showReport, setShowReport] = useState(false); // State to control the visibility of the report
  const [SelectedManagerName, setSelectedManagerName] = useState({});
  const [manager, setManager] = useState([]);  //prachi

  //Name:-Akash Pawar Component:-Team_Leadder Subcategory:-Assign Column TeamLeader Names and Recruiter Names(changed) Start LineNo:-17  Date:-03/07
  const [teamLeaderNames, setTeamLeaderNames] = useState([]);
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); //Prachi
  const [teamLeaderUnderManager, setTeamLeaderUnderManager] = useState([]);  //Prachi
  const [recruiterUnderTeamLeaderData, setRecruiterUnderTeamLeaderData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  const [showReportData, setshowReportData] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  const [reportSelectedDate, setreportSelectedDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [candidatesDatewiseData, setcandidatesDatewiseData] = useState([]);
  // State to track the currently selected month
  const [selectedMonth, setSelectedMonth] = useState('lastMonth');
  const [reportDataDatewise, setReportDataDatewise] = useState(null);

  useEffect(() => {
    const fetchManagerNames = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/get-all-managers`
      );
      setManager(response.data);
    };
    fetchManagerNames();
  }, []);

  useEffect(() => {
    const fetchTeamLeaderNames = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${selectedManager.managerId}`
      );
      setTeamLeaderUnderManager(response.data);

    };
    if (selectedManager.managerId != "") {
      fetchTeamLeaderNames();
    }

  }, [selectedManager]);

  const fetchRecruiterUnderTeamLeaderData = useCallback(async () => {
    const response = await axios.get(
      `${API_BASE_URL}/employeeId-names/${selectedTeamLeader.teamLeaderId}`
    );
    setRecruiterUnderTeamLeaderData(response.data);
  }, [selectedTeamLeader]);

  useEffect(() => {
    if (selectedTeamLeader != null) {
      fetchRecruiterUnderTeamLeaderData();


    }
  }, [selectedTeamLeader]);

  const today = new Date();

  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  useEffect(() => {

    const fetchDateData = async () => {

    }
    fetchDateData();

  }, []);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  }
  const showDataReport = () => {
    setshowReportData(true);
  }

  const handleToggle = () => {

    setShowToggle(!showToggle);
    setShowCustomDiv(false);
    setshowReportData(false)
  };

  const fetchLastMonthData = () => {

    const today = new Date();
    const lastMonthStartDate1 = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEndDate1 = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastMonthStartDate = lastMonthStartDate1.toISOString().slice(0, 10);
    const lastMonthEndDate = lastMonthEndDate1.toISOString().slice(0, 10);

    const FetchDataDatewise = async () => {

      let baseURL = '';

      if (selectedManager.managerId) {
        baseURL = `${selectedManager.managerId}/${selectedManager.managerJobRole}`;
      }
      if (selectedManager.managerId && selectedTeamLeader.teamLeaderId) {
        baseURL = `${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}`
      } if (selectedManager.managerId && selectedTeamLeader.teamLeaderId && selectedRecruiters.recruiterId) {
        baseURL = `${selectedRecruiters.recruiterId} /${selectedRecruiters.recruiterJobRole}`
      }
      console.log(baseURL);


      const response = await axios.get(
        `${API_BASE_URL}/report-count/${baseURL}/${lastMonthStartDate}/${lastMonthEndDate}`
      )
      setReportDataDatewise(response.data);
      console.log(response.data);
      // console.log(baseURL+"hhhhhhhhh");
    };
    FetchDataDatewise();

  }

  // Custom Date

  const handleCustomDate = () => {
    const today = new Date();
    const lastThreeMonthStartDate = startDate;
    const lastThreeMonthEndDate = endDate;

    const FetchDataDatewise = async () => {

      let baseURL = '';

      if (selectedManager.managerId) {
        baseURL = `${selectedManager.managerId}/${selectedManager.managerJobRole}`;
      }
      if (selectedManager.managerId && selectedTeamLeader.teamLeaderId) {
        baseURL = `${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}`
      } if (selectedManager.managerId && selectedTeamLeader.teamLeaderId && selectedRecruiters.recruiterId) {
        baseURL = `${selectedRecruiters.recruiterId} /${selectedRecruiters.recruiterJobRole}`
      }

      const response = await axios.get(
        `${API_BASE_URL}/report-count/${baseURL}/${lastThreeMonthStartDate}/${lastThreeMonthEndDate}`
      )
      setReportDataDatewise(response.data);
      console.log(response.data);
    };
    FetchDataDatewise();
    setshowReportData(true);


  }

  const fetchthreeMonthData = () => {
    const today = new Date();
    const lastThreeMonthStartDate1 = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    const lastThreeMonthEndDate1 = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastThreeMonthStartDate = lastThreeMonthStartDate1.toISOString().slice(0, 10);
    const lastThreeMonthEndDate = lastThreeMonthEndDate1.toISOString().slice(0, 10);
  
    const FetchDataDatewise = async () => {

      let baseURL = '';

      if (selectedManager.managerId) {
        baseURL = `${selectedManager.managerId}/${selectedManager.managerJobRole}`;
      }
      if (selectedManager.managerId && selectedTeamLeader.teamLeaderId) {
        baseURL = `${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}`
      } if (selectedManager.managerId && selectedTeamLeader.teamLeaderId && selectedRecruiters.recruiterId) {
        baseURL = `${selectedRecruiters.recruiterId} /${selectedRecruiters.recruiterJobRole}`
      }

      const response = await axios.get(
        `${API_BASE_URL}/report-count/${baseURL}/${lastThreeMonthStartDate}/${lastThreeMonthEndDate}`
      )
      setReportDataDatewise(response.data);
      console.log(response.data);
    };
    FetchDataDatewise();
  }

  const fetchSixMonthData = () => {

    const today = new Date();

    const lastSixMonthStartDate1 = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    const lastSixMonthEndDate1 = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastSixMonthStartDate = lastSixMonthStartDate1.toISOString().slice(0, 10);
    const lastSixMonthEndDate = lastSixMonthEndDate1.toISOString().slice(0, 10);

    const FetchDataDatewise = async () => {

      let baseURL = '';

      if (selectedManager.managerId) {
        baseURL = `${selectedManager.managerId}/${selectedManager.managerJobRole}`;
      }
      if (selectedManager.managerId && selectedTeamLeader.teamLeaderId) {
        baseURL = `${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}`
      } if (selectedManager.managerId && selectedTeamLeader.teamLeaderId && selectedRecruiters.recruiterId) {
        baseURL = `${selectedRecruiters.recruiterId} /${selectedRecruiters.recruiterJobRole}`
      }

      const response = await axios.get(
        `${API_BASE_URL}/report-count/${baseURL}/${lastSixMonthStartDate}/${lastSixMonthEndDate}`
      )
      setReportDataDatewise(response.data);
      console.log(response.data);
    };
    FetchDataDatewise();
  }

  const fetchOneYearData = () => {
    const today = new Date();
    const lastOneYearStartDate1 = new Date(today.getFullYear(), today.getMonth() - 12, 1);
    const lastOneYearEndDate1 = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastOneYearStartDate = lastOneYearStartDate1.toISOString().slice(0, 10);
    const lastOneYearEndDate = lastOneYearEndDate1.toISOString().slice(0, 10);
    const FetchDataDatewise = async () => {

      let baseURL = '';

      if (selectedManager.managerId) {
        baseURL = `${selectedManager.managerId}/${selectedManager.managerJobRole}`;
      }
      if (selectedManager.managerId && selectedTeamLeader.teamLeaderId) {
        baseURL = `${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}`
      } if (selectedManager.managerId && selectedTeamLeader.teamLeaderId && selectedRecruiters.recruiterId) {
        baseURL = `${selectedRecruiters.recruiterId} /${selectedRecruiters.recruiterJobRole}`
      }

      const response = await axios.get(
        `${API_BASE_URL}/report-count/${baseURL}/${lastOneYearStartDate}/${lastOneYearEndDate}`
      )
      setReportDataDatewise(response.data);
      console.log(response.data);
    };
    FetchDataDatewise();
  }
  const fetchJoiningDateData = () => {
    const today = new Date();
    const lastOneYearStartDate1 = new Date(today.getFullYear(), today.getMonth() - 12, 1);
    const lastOneYearEndDate1 = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastOneYearStartDate = lastOneYearStartDate1.toISOString().slice(0, 10);
    const lastOneYearEndDate = lastOneYearEndDate1.toISOString().slice(0, 10);
    console.log(lastOneYearStartDate + " Start date");
    console.log(lastOneYearEndDate + " End date");


    console.log(selectedTeamLeader.teamLeaderId);
    console.log(selectedTeamLeader.teamLeaderJobRole);

    const FetchDataDatewise = async () => {

      let baseURL = '';

      if (selectedManager.managerId) {
        baseURL = `${selectedManager.managerId}/${selectedManager.managerJobRole}`;
      }
      if (selectedManager.managerId && selectedTeamLeader.teamLeaderId) {
        baseURL = `${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}`
      } if (selectedManager.managerId && selectedTeamLeader.teamLeaderId && selectedRecruiters.recruiterId) {
        baseURL = `${selectedRecruiters.recruiterId} /${selectedRecruiters.recruiterJobRole}`
      }
      const response = await axios.get(
        `${API_BASE_URL}/report-count/${baseURL}/${lastOneYearStartDate}/${lastOneYearEndDate}`
      )
      setReportDataDatewise(response.data);
      console.log(response.data);
    };
    FetchDataDatewise();
  }

  const fetchCurrentMonthData = () => {

    const today = new Date();
    const firstDateOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastOneYearEndDate1 = today;
    const year = firstDateOfCurrentMonth.getFullYear();
    const month = String(firstDateOfCurrentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(firstDateOfCurrentMonth.getDate()).padStart(2, '0');
    const lastCurrentMonthStartDate = `${year}-${month}-${day}`;
    const lastCurrentMonthEndDate = lastOneYearEndDate1.toISOString().slice(0, 10);
    console.log(lastCurrentMonthStartDate + " Start date current month");
    console.log(lastCurrentMonthEndDate + " End date current month");
    console.log(selectedTeamLeader.teamLeaderId);
    console.log(selectedTeamLeader.teamLeaderJobRole);

    const FetchDataDatewise = async () => {

      let baseURL = '';

      if (selectedManager.managerId) {
        baseURL = `${selectedManager.managerId}/${selectedManager.managerJobRole}`;
      }
      if (selectedManager.managerId && selectedTeamLeader.teamLeaderId) {
        baseURL = `${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}`
      } if (selectedManager.managerId && selectedTeamLeader.teamLeaderId && selectedRecruiters.recruiterId) {
        baseURL = `${selectedRecruiters.recruiterId} /${selectedRecruiters.recruiterJobRole}`
      }

      const response = await axios.get(
        `${API_BASE_URL}/report-count/${baseURL}/${lastCurrentMonthStartDate}/${lastCurrentMonthEndDate}`
      )
      setReportDataDatewise(response.data);
      console.log(response.data);
    };
    FetchDataDatewise();

  }

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);

    if (event.target.value === 'CurrentMonth') {
      fetchCurrentMonthData();
    }
    else if (event.target.value === 'LastMonth') {
      fetchLastMonthData();
    } else if (event.target.value === 'Last3Months') {
      fetchthreeMonthData();
    } else if (event.target.value === 'Last6Months') {
      fetchSixMonthData();
    } else if (event.target.value === 'Last1Year') {
      fetchOneYearData();
    }
    else if (event.target.value === 'JoiningDate') {
      fetchJoiningDateData();
    }

  };

  const showCustomDateDiv = () => {
    setShowCustomDiv(true);

  }
  const hideCustomDateDiv = () => {
    setShowCustomDiv(false);
  }



  // Filtered data based on selected month
  // const filteredData = data.find(entry => entry.month === selectedMonth);

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
    if (selectedManager.managerId != "") {
      setDropdownOpen(false);
      setShowReport(true);
    }
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
      setSelectedManagers([]);
      setSelectedTeamLeaders([]);
      setSelectedRecruiters([]);
    } else {
      setSelectedManagers(manager.map((id) => id.managerId));
      setSelectedTeamLeaders(teamLeaderUnderManager.map((teamleader) => teamleader.teamLeaderId));
      setSelectedRecruiters(recruiterUnderTeamLeaderData.map((recruiter) => recruiter.employeeId));
    }
    setAllSelected(!allSelected);
  }

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
          !updatedAssignments[recruiter][category].inudes(option)
        ) {
          updatedAssignments[recruiter][category].push(option);
        }
      });
    });
    setAssignments(updatedAssignments);
    setSelectedMainAdmin(null);
    setSelectedTeamLeader([]);
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

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedRecruiters([]);
    } else {
      setSelectedRecruiters(filteredRecruiters);
    }
    setAllSelected((prev) => !prev);
  }, [allSelected, filteredRecruiters]);
const [openSelectDate, setOpenSelectDate] = useState(false);
const handleOpenSelectDate = ()=>{
setOpenSelectDate(!openSelectDate);
}
const [managersList, setManagersList]= useState([]);
const handleDisplayManagers = async()=>{
  const response = await axios.get(
    `${API_BASE_URL}/get-all-managers`
  );
  setManagersList(response.data);
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


  return (
    <>
   <div className="listofButtons11">

    <button className="scrollButton left" onClick={scrollLeft}>
    &#8249;
  </button>


<div className="typesOfReportDiv">

      <div className="typeofReportSubDiv"
      onClick={handleOpenSelectDate}
      >
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Candidate Report
          </div>
        </div>
      </div>

      <div className="typeofReportSubDiv">
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Invoice Report
          </div>
        </div>
      </div>

      <div className="typeofReportSubDiv">
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Recruiters Report
          </div>
        </div>
      </div>

      <div className="typeofReportSubDiv">
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Candidate Report
          </div>
        </div>
      </div>

      <div className="typeofReportSubDiv">
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Candidate Report
          </div>
        </div>
      </div>

      <div className="typeofReportSubDiv">
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Candidate Report
          </div>
        </div>
      </div>

      <div className="typeofReportSubDiv">
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Candidate Report
          </div>
        </div>
      </div>

      

      <div className="typeofReportSubDiv">
        <div className="subdiviconandtext">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z"/></svg>
        </div>
        <div className="subdiviconandtext1">
          <div className="textDiv1">
Candidate Report
          </div>
        </div>
      </div>
      </div>
      <button className="scrollButton right" onClick={scrollRight}>
    &#8250;
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
             
            />
            Current Month
          </label>
          <label className="PI-radio-label">
            <input
              type="radio"
              value="Last Month"
              id="LastMonth"
              name="reportOption"
             
            />
            Last Month
          </label>
          <label className="PI-radio-label">
            <input
              type="radio"
              value="Last 3 Months"
              id="Last3Months"
              name="reportOption"
             
            />
            Last 3 Months
          </label>
          <label className="PI-radio-label">
            <input
              type="radio"
              value="Last 6 Months"
              name="reportOption"
              id="Last6Months"
             
            />
            Last 6 Months
          </label>
          <label className="PI-radio-label">
            <input
              type="radio"
              value="Last 1 Year"
              name="reportOption"
              id="Last1Year"
             
            />
            Last 1 Year
          </label>
          <label className="PI-radio-label">
            <input
              type="radio"
              value="custom"
              
              name="reportOption"
              id="CustomDate"
             
            />
            Custom Date
          </label>
          </div>
          <center>
          <div className="history-tracker-custom-dates">
            {showCustomDiv && (
                <div className="date-inputs">
                  <label>
                    Start Date:
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={handleCustomStartDateChange}
                    />
                 
                  <label>
                    End Date:
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={handleCustomEndDateChange}
                    />
                
                  {/* <div className="filterDataButton">
                    <button className="Candi-History-tracker-button">
                      Filter Data
                    </button>
                  </div> */}
                </div>
              
            )}
          </div>
          </center>
        </div>
  )
}

<div className="mainUserDropdown1">
  <button
  onClick={handleDisplayManagers}
  >Manager</button>
 <div className="listviewofmanagerswithcheckboxandarrow">
  {
    managersList.map((managerList, index) => (
      <div key={index} className="manager-item">
        <input type="radio" name="selectManager" />
        <span
        className='spanformanagerlistname'
        >{managerList.managerName}
       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
        </span>
      </div>
    ))
  }
</div>

</div>









      <div className="report-AppsTL">
        <div className="reports-selection-containerTL">

          <div className="report-hierarchy-sectionTL">

            <div className="report-custom-dropdownTL">

              <div className="reports-Admin-Dropdown" onClick={toggleDropdown}>
                {selectedRecruiters.length === 0
                  ? "Manager"
                  : "Manager"
                }
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
                  <div className='team-leadersTL'>
                    {
                      manager.map((id, index) => (
                        <div
                          key={index}
                          className="team-leader-itemTL checkbox-teamleader-assign radio-teamleader-assign"

                        >
                          <label>
                            <input
                              type='checkbox'
                              name={`manager${manager.employeeId}`}

                              value={id.managerId}
                              checked={selectedManagers.includes(id.managerId)}
                              onChange={() => {
                                setSelectedManager({
                                  managerId: id.managerId,
                                  managerJobRole: id.jobRole,

                                })

                              }}

                            />

                            {id.managerName}

                          </label>

                          {
                            selectedManager.managerId === id.managerId &&
                            teamLeaderUnderManager && (
                              <div className='recruitersTL'>
                                {
                                  teamLeaderUnderManager.map(
                                    (teamleader, tIndex) => (
                                      <div>
                                        <label key={tIndex}>
                                          <input
                                            type='checkbox'
                                            name={`teamleader${teamleader.employeeId}`}

                                            value={teamleader.teamLeaderId}
                                            checked={selectedTeamLeaders.includes(teamleader.teamLeaderId)}

                                            onChange={() =>
                                              setSelectedTeamLeader({
                                                teamLeaderId: teamleader.teamLeaderId,
                                                teamLeaderJobRole: teamleader.jobRole
                                              })

                                            }

                                          />

                                          {teamleader.teamLeaderName}

                                        </label>

                                        {
                                          selectedTeamLeader.teamLeaderId === teamleader.teamLeaderId &&
                                          recruiterUnderTeamLeaderData && (
                                            <div className='recruitersTL'>
                                              {
                                                recruiterUnderTeamLeaderData.map((recruiter, rIndex) => (
                                                  <label key={rIndex}>
                                                    <input
                                                      className='checkBox-css'
                                                      type='checkbox'
                                                      name={`recruiter${recruiter.employeeId}`}
                                                      value={recruiter.employeeId}
                                                      checked={selectedRecruiters.includes(recruiter.employeeId)}

                                                      onChange={() =>
                                                        setSelectedRecruiters((prevRecruiters) => [...prevRecruiters, recruiter.employeeId])
                                                      }

                                                    />
                                                    {recruiter.employeeName}



                                                  </label>
                                                ))
                                              }
                                            </div>
                                          )

                                        }
                                      </div>
                                    )
                                  )
                                }
                              </div>
                            )
                          }
                        </div>

                      ))
                    }
                  </div>

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
          </div>
        </div>

        {showReport && (
          <div>
            <div className="month-report">

              <div className='month-report-sub-Div'>

                <div className="month-selector">


                  {selectedDate && <PDFGenerator selectedDate={selectedDate} />}
                  <label>
                    <input
                      type="radio"
                      value="CurrentMonth"
                      id='CurrentMonth'
                      name="reportOption"

                      checked={selectedMonth === 'CurrentMonth'}
                      onChange={handleMonthChange}
                      onClick={handleToggle}

                    />
                    Current Month
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="LastMonth"
                      id='LastMonth'
                      name="reportOption"

                      checked={selectedMonth === 'LastMonth'}
                      onChange={handleMonthChange}
                      onClick={handleToggle}

                    />
                    Last Month
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Last3Months"
                      id='Last3Months'
                      name='reportOption'
                      checked={selectedMonth === 'Last3Months'}
                      onChange={handleMonthChange}
                      onClick={handleToggle}

                    />
                    Last 3 Months
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Last6Months"
                      name='reportOption'
                      id='Last6Months'
                      checked={selectedMonth === 'Last6Months'}
                      onChange={handleMonthChange}
                      onClick={handleToggle}

                    />
                    Last 6 Months
                  </label>

                  <label>
                    <input
                      type='radio'
                      value="Last1Year"
                      name='reportOption'
                      id='Last1Year'
                      checked={selectedMonth === "Last1Year"}
                      onChange={handleMonthChange}
                      onClick={handleToggle}

                    />
                    Last 1 Year
                  </label>


                  <label>
                    <input
                      type='radio'
                      value="CustomDate"
                      name='reportOption'
                      id='CustomDate'
                      checked={selectedMonth === "CustomDate"}
                      // onChange={handleMonthChange}
                      onClick={showCustomDateDiv}
                    />
                    Custom Date
                  </label>
                  <label>
                    <input
                      type='radio'
                      value="JoiningDate"
                      name='reportOption'
                      id='JoiningDate'
                      checked={selectedMonth === "JoiningDate"}
                      onChange={handleMonthChange}
                      onClick={handleToggle}
                    />
                    Joining Date
                  </label>


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
                          <button onClick={handleCustomDate}>Filter Data</button>

                        </div>
                      </div>
                    </div>

                  )}

              </div>
              <div className='get-report-main-div '>
                {(
                  <div className='filterDataButton'>
                    <button className='filterDataButton1' onClick={showDataReport} >Get Report</button>

                  </div>
                )}
              </div>
            </div>
            {showReportData ? (
              <div>
                <CreateReportTable reportDataDatewise={reportDataDatewise} />
              </div>
            ) : (<p></p>)}
          </div>
        )}
      </div>
    </>
  );
};

export default MonthReport;
