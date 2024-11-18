import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Excel/callingExcelData.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "../api/api";
import { toast } from "react-toastify";

const CallingExcelList = ({
  updateState,
  funForGettingCandidateId,
  onCloseTable,
  loginEmployeeName,
  toggleSection,
  onsuccessfulDataAdditions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [callingList, setCallingList] = useState([]);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [showCallingForm, setShowCallingForm] = useState(false);
  const [callingToUpdate, setCallingToUpdate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState();
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("");
  const [showShareButton, setShowShareButton] = useState(true);
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [allSelected, setAllSelected] = useState(false); 
  const [fetchAllManager, setFetchAllManager] = useState([]); 
  const [fetchTeamleader, setFetchTeamleader] = useState([]); 
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); 
  const [isDataSending, setIsDataSending] = useState(false);

  const { employeeId, userType } = useParams();
  const employeeIdw = parseInt(employeeId);

  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);

  const navigator = useNavigate();

  const fetchUpdatedData = () => {
    setLoading(true); // Set loading to true before fetching the updated data
    fetch(`${API_BASE_URL}/fetch-excel-data/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        setCallingList(data);
        setFilteredCallingList(data);
        setLoading(false); // Set loading to false when data is successfully fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  };
  
  useEffect(() => {
    // Fetch initial data on component mount
    fetchUpdatedData();
  }, [employeeId, userType]);

  useEffect(() => {
    const options = Object.keys(filteredCallingList[0] || {}).filter(
      (key) => key !== "candidateId"
    );
    setFilterOptions(options);
  }, [filteredCallingList]);

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
  }, [selectedFilters]);

  useEffect(() => {
    console.log("Filtered Calling List:", filteredCallingList);
  }, [filteredCallingList]);


    //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_39
    const [oldselectedTeamLeader, setOldSelectedTeamLeader] = useState({
      oldTeamLeaderId: "",
      oldTeamLeaderJobRole: "",
    });
    const [newselectedTeamLeader, setNewSelectedTeamLeader] = useState({
      newTeamLeaderId: "",
      newTeamLeaderJobRole: "",
    });
  
    const [selectedRecruiters, setSelectedRecruiters] = useState({
      index: "",
      recruiterId: "",
      recruiterJobRole: "",
    });
  
    const [oldSelectedManager, setOldSelectedManager] = useState({
      oldManagerId: "",
      oldManagerJobRole: "",
    });
    const [newSelectedManager, setNewSelectedManager] = useState({
      newManagerId: "",
      newManagerJobRole: "",
    });
    //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_62
  

  // prachi parab callingExcelData data_filter_section 12/9
  const limitedOptions = [
    ["callingFeedback", "Calling Feedback"],
    ["candidateEmail", "Candidate Email"],
    ["candidateName", "Candidate Name"],
    ["contactNumber", "Contact Number"],
    ["currentLocation", "Current Location"],
    ["date", "Date"],
    ["fullAddress", "Full Address"],
    ["jobDesignation", "Job Designation"],
    ["requirementCompany", "Requirement Company"],
    ["empId", "Employee Id"],
    ["companyName", "Company Name"],
    ["currentCTCLakh", "Current CTC (Lakh)"],
    ["currentCTCThousand", "Current CTC (Thousand)"],
    ["dateOfBirth", "Date Of Birth"],
    ["expectedCTCLakh", "Expected CTC (Lakh)"],
    ["expectedCTCThousand", "Expected CTC (Thousand)"],
    ["experienceMonth", "Experience (Months)"],
    ["experienceYear", "Experience (Years)"],
    ["finalStatus", "Final Status"],
    ["holdingAnyOffer", "Holding Any Offer"],
    ["noticePeriod", "Notice Period"],
  ];

  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) => Object.keys(callingList[0] || {}).includes(key))
      .map(([key]) => key);

    setFilterOptions(options);
  }, [callingList]);

  //  filter problem solved updated by sahil karnekar date 22-10-2024 complete  handleFilterOptionClick method
  const handleFilterOptionClick = (key) => {
    if (activeFilterOption === key) {
      setActiveFilterOption(null);
    } else {
      setActiveFilterOption(key);
    }
    setSelectedFilters((prev) => {
      const newSelectedFilters = { ...prev };
      if (key in newSelectedFilters) {
      } else {
        newSelectedFilters[key] = [];
      }
      return newSelectedFilters;
    });
  };

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);

  useEffect(() => {
    const filtered = callingList.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (item.extra1 && item.extra1.toLowerCase().includes(searchTermLower)) ||
        (item.extra2 && item.extra2.toLowerCase().includes(searchTermLower)) ||
        (item.extra3 && item.extra3.toLowerCase().includes(searchTermLower)) ||
        (item.extra4 && item.extra4.toLowerCase().includes(searchTermLower)) ||
        (item.extra5 && item.extra5.toLowerCase().includes(searchTermLower)) ||
        (item.extra6 && item.extra6.toLowerCase().includes(searchTermLower)) ||
        (item.extra7 && item.extra7.toLowerCase().includes(searchTermLower)) ||
        (item.extra8 && item.extra8.toLowerCase().includes(searchTermLower)) ||
        (item.extra9 && item.extra9.toLowerCase().includes(searchTermLower)) ||
        (item.extra10 &&
          item.extra10.toLowerCase().includes(searchTermLower)) ||
        (item.date && item.date.toLowerCase().includes(searchTermLower)) ||
        (item.candidateAddedTime &&
          item.candidateAddedTime.toLowerCase().includes(searchTermLower)) ||
        (item.recruiterName &&
          item.recruiterName.toLowerCase().includes(searchTermLower)) ||
        (item.candidateName &&
          item.candidateName.toLowerCase().includes(searchTermLower)) ||
        (item.candidateEmail &&
          item.candidateEmail.toLowerCase().includes(searchTermLower)) ||
        (item.sourceName &&
          item.sourceName.toLowerCase().includes(searchTermLower)) ||
        (item.jobDesignation &&
          item.jobDesignation.toLowerCase().includes(searchTermLower)) ||
        (item.requirementCompany &&
          item.requirementCompany.toLowerCase().includes(searchTermLower)) ||
        (item.communicationRating &&
          item.communicationRating.toLowerCase().includes(searchTermLower)) ||
        (item.currentLocation &&
          item.currentLocation.toLowerCase().includes(searchTermLower)) ||
        (item.fullAddress &&
          item.fullAddress.toLowerCase().includes(searchTermLower)) ||
        (item.callingFeedback &&
          item.callingFeedback.toLowerCase().includes(searchTermLower)) ||
        (item.incentive &&
          item.incentive.toLowerCase().includes(searchTermLower)) ||
        (item.distance &&
          item.distance.toLowerCase().includes(searchTermLower)) ||
        (item.companyName &&
          item.companyName.toLowerCase().includes(searchTermLower)) ||
        (item.noticePeriod &&
          item.noticePeriod.toLowerCase().includes(searchTermLower)) ||
        (item.holdingAnyOffer &&
          item.holdingAnyOffer.toLowerCase().includes(searchTermLower)) ||
        (item.finalStatus &&
          item.finalStatus.toLowerCase().includes(searchTermLower)) ||
        (item.dateOfBirth &&
          item.dateOfBirth.toLowerCase().includes(searchTermLower)) ||
        (item.relevantExperience &&
          item.relevantExperience.toLowerCase().includes(searchTermLower)) ||
        (item.gender && item.gender.toLowerCase().includes(searchTermLower)) ||
        (item.qualification &&
          item.qualification.toLowerCase().includes(searchTermLower)) ||
        (item.yearOfPassing &&
          item.yearOfPassing.toLowerCase().includes(searchTermLower)) ||
        (item.extraCertification &&
          item.extraCertification.toLowerCase().includes(searchTermLower)) ||
        (item.feedBack &&
          item.feedBack.toLowerCase().includes(searchTermLower)) ||
        (item.offerLetterMsg &&
          item.offerLetterMsg.toLowerCase().includes(searchTermLower)) ||
        (item.maritalStatus &&
          item.maritalStatus.toLowerCase().includes(searchTermLower)) ||
        (item.pickUpAndDrop &&
          item.pickUpAndDrop.toLowerCase().includes(searchTermLower)) ||
        (item.msgForTeamLeader &&
          item.msgForTeamLeader.toLowerCase().includes(searchTermLower)) ||
        (item.availabilityForInterview &&
          item.availabilityForInterview
            .toLowerCase()
            .includes(searchTermLower)) ||
        (item.interviewTime &&
          item.interviewTime.toLowerCase().includes(searchTermLower)) ||
        (item.preferredLocation &&
          item.preferredLocation.toLowerCase().includes(searchTermLower)) ||
        (item.sslCertificates &&
          item.sslCertificates.toLowerCase().includes(searchTermLower)) ||
        (item.relocateStatus &&
          item.relocateStatus.toLowerCase().includes(searchTermLower)) ||
        (item.expectedJoinDate &&
          item.expectedJoinDate.toLowerCase().includes(searchTermLower)) ||
        (item.interviewType &&
          item.interviewType.toLowerCase().includes(searchTermLower)) ||
        (item.interviewStatus &&
          item.interviewStatus.toLowerCase().includes(searchTermLower)) ||
        (item.offerDetails &&
          item.offerDetails.toLowerCase().includes(searchTermLower)) ||
        (item.offerSalary &&
          item.offerSalary.toLowerCase().includes(searchTermLower)) ||
        (item.keySkills &&
          item.keySkills.toLowerCase().includes(searchTermLower)) ||
        (item.resumeTitle &&
          item.resumeTitle.toLowerCase().includes(searchTermLower)) ||
        (item.lastActiveDate &&
          item.lastActiveDate.toLowerCase().includes(searchTermLower)) ||
        (item.joiningDate &&
          item.joiningDate.toLowerCase().includes(searchTermLower)) ||
        (item.jobRole &&
          item.jobRole.toLowerCase().includes(searchTermLower)) ||
        (item.oldJobRole &&
          item.oldJobRole.toLowerCase().includes(searchTermLower)) ||
        (item.sharedStatus &&
          item.sharedStatus.toLowerCase().includes(searchTermLower)) ||
        (item.oldRecruiterName &&
          item.oldRecruiterName.toLowerCase().includes(searchTermLower)) ||
        (item.contactNumber &&
          item.contactNumber.toString().includes(searchTermLower)) ||
        (item.alternateNumber &&
          item.alternateNumber.toString().includes(searchTermLower)) ||
        (item.requirementId &&
          item.requirementId
            .toString()
            .toLowerCase()
            .includes(searchTermLower)) ||
        (item.oldEmployeeId &&
          item.oldEmployeeId.toString().includes(searchTermLower)) ||
        (item.experienceYear &&
          item.experienceYear.toString().includes(searchTermLower)) ||
        (item.experienceMonth &&
          item.experienceMonth.toString().includes(searchTermLower)) ||
        (item.currentCTCLakh &&
          item.currentCTCLakh.toString().includes(searchTermLower)) ||
        (item.currentCTCThousand &&
          item.currentCTCThousand.toString().includes(searchTermLower)) ||
        (item.expectedCTCLakh &&
          item.expectedCTCLakh.toString().includes(searchTermLower)) ||
        (item.expectedCTCThousand &&
          item.expectedCTCThousand.toString().includes(searchTermLower)) ||
        (item.employeeId &&
          item.employeeId.toString().includes(searchTermLower))
      );
    });
    setFilteredCallingList(filtered);
  }, [searchTerm, callingList]);

  useEffect(() => {
    if (sortCriteria) {
      const sortedList = [...filteredCallingList].sort((a, b) => {
        const aValue = a[sortCriteria];
        const bValue = b[sortCriteria];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return 0;
        }
      });
      setFilteredCallingList(sortedList);
    }
  }, [sortCriteria, sortOrder]);

  const filterData = () => {
    let filteredData = [...callingList];
    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        if (option === "candidateId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "requirementId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "employeeId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "contactNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "alternateNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "currentCTCLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "currentCTCThousand") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "empId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "expectedCTCLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "expectedCTCThousand") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "experienceMonth") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "experienceYear") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "oldEmployeeId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "availabilityForInterview") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "candidateAddedTime") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "date") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "dateOfBirth") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "incentive") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "interviewTime") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "selectYesOrNo") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            )
          );
        }
      }
    });
    setFilteredCallingList(filteredData);
  };

  const handleFilterSelect = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };
  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc");
    }
  };

  const handleUpdateSuccess = () => {
    fetch(`${API_BASE_URL}/fetch-excel-data/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        setCallingList(data);
        setFilteredCallingList(data);
        setShowUpdateCallingTracker(false);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));  
      setLoading(false);
  };

  const handleMouseOver = (event) => {
    const tableData = event.currentTarget;
    const tooltip = tableData.querySelector(".tooltip");
    const tooltiptext = tableData.querySelector(".tooltiptext");

    if (tooltip && tooltiptext) {
      const textOverflowing =
        tableData.offsetWidth < tableData.scrollWidth ||
        tableData.offsetHeight < tableData.scrollHeight;
      if (textOverflowing) {
        const rect = tableData.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 100}px`;
        tooltip.style.visibility = "visible";
      } else {
        tooltip.style.visibility = "hidden";
      }
    }
  };

  const handleMouseOut = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    if (tooltip) {
      tooltip.style.visibility = "hidden";
    }
  };

  const getSortIcon = (criteria) => {
    if (sortCriteria === criteria) {
      return sortOrder === "asc" ? (
        <i className="fa-solid fa-arrow-up"></i>
      ) : (
        <i className="fa-solid fa-arrow-down"></i>
      );
    }
    return null;
  };

  const toggleFilterSection = () => {
    setShowFilterSection(!showFilterSection);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allRowIds = filteredCallingList.map((item) => item.candidateId);
      setSelectedRows(allRowIds);
    }
    setAllSelected(!allSelected);
  };

  const handleSelectRow = (candidateId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(candidateId)) {
        return prevSelectedRows.filter((id) => id !== candidateId);
      } else {
        return [...prevSelectedRows, candidateId];
      }
    });
  };

  const fetchRecruiters = async (teamLeaderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
      );
      const data = await response.json();
      setRecruiterUnderTeamLeader(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  const fetchTeamLeader = async (empId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tl-namesIds/${empId}`
      );
      const data = await response.json();
      setFetchTeamleader(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  const fetchManager = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/get-all-managers`
      );
      const data = await response.json();
      setFetchAllManager(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  useEffect(() => {
    if (userType === "SuperUser") {
      fetchManager();
    } else if (userType === "Manager") {
      fetchTeamLeader(employeeId);
    } else {
      fetchRecruiters(employeeId);
    }
  }, []);

  const forwardSelectedCandidate = (e) => {
    e.preventDefault();
    if (selectedRows.length > 0 && userType === "TeamLeader") {
      setShowForwardPopup(true);
    }
    if (userType === "SuperUser") {
      setShowForwardPopup(true);
    }
    if (userType === "Manager") {
      setShowForwardPopup(true);
    }
  };

  const handleShare = async () => {
    setIsDataSending(true);
    let url = `${API_BASE_URL}/share-excel-data/${employeeId}/${userType}`;
    let requestData;
  
    if (userType === "TeamLeader" && selectedRecruiters.recruiterId !== "" && selectedRows.length > 0) {
      requestData = {
        candidateIds: selectedRows, // list of selected candidate ids
        employeeId: parseInt(selectedRecruiters.recruiterId), // ID of the recruiter
        jobRole: "Recruiters" // job role of the user (TeamLeader)
      };
    } else if (userType === "Manager") {
      requestData = {
        candidateIds: selectedRows, // list of selected candidate ids
        employeeId: parseInt(newSelectedManager.newManagerId), // ID of the manager
        jobRole: "TeamLeader" // job role of the user (Manager)
      };
    } else if (userType === "SuperUser") {
      requestData = {
        candidateIds: selectedRows, // list of selected candidate ids
        employeeId: parseInt(newSelectedManager.newManagerId), // ID of the manager
        jobRole: "Manager" // job role of the user (SuperUser)
      };
    }
  
    console.log("Request Data: ", requestData); // print the requestData object
  
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        setIsDataSending(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setIsDataSending(false);
      toast.success("Candidates forwarded successfully!");
      fetchUpdatedData();
      setShowForwardPopup(false); 
      setShowShareButton(true);
      setSelectedRows([]);
      setSelectedRecruiters({
        index: "",
        recruiterId: "",
        recruiterJobRole: "",
      });
      setOldSelectedTeamLeader({
        oldTeamLeaderId: "",
        oldTeamLeaderJobRole: "",
      });
      setNewSelectedTeamLeader({
        newTeamLeaderId: "",
        newTeamLeaderJobRole: "",
      });
      setOldSelectedManager({
        oldManagerId: "",
        oldManagerJobRole: "",
      });
      setNewSelectedManager({
        newManagerId: "",
        newManagerJobRole: "",
      });
    } catch (error) {
      setIsDataSending(false);
      console.error("Error while forwarding candidates:", error);
    }
  };
  

  const openCallingExcelList = (candidateData) => {
    setSelectedCandidate(candidateData);
    toggleSection(false);
  };

  const openModal = (candidate) => {
    setShowModal(candidate);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalIsOpen(false);
    setSelectedCandidate(null);
  };

  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
  };

  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        const fileType = fileName.split(".").pop().toLowerCase();

        if (fileType === "pdf") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "application/pdf" });
          return URL.createObjectURL(blob);
        }

        if (fileType === "docx") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          return URL.createObjectURL(blob);
        }

        console.error(`Unsupported document type: ${fileType}`);
        return "Unsupported Document";
      } catch (error) {
        console.error("Error converting byte code to document:", error);
        return "Invalid Document";
      }
    }
    return "Document Not Found";
  };

  const handleMergeResumes = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/merge-resumes`);
      if (response.status === 200) {
        const formattedMessage = response.data.replace(/\n/g, "<br>");
        toast.success(<div dangerouslySetInnerHTML={{ __html: formattedMessage }} />);
        
        // Call the function to fetch updated data after successful merge
        fetchUpdatedData();
      } else {
        console.log("Error merging resumes:", response.statusText);
        toast.error("Error merging resumes: " + response.statusText);
      }
    } catch (error) {
      console.error("Error merging resumes:", error);
      toast.error("Error merging resumes: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const calculateWidth = () => {
    const baseWidth = 250; 
    const increment = 10; 
    const maxWidth = 600; 
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth);
  };

  return (
    <div className="App-after1">
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          {!selectedCandidate && (
            <div className="table-container">
              {/* this line462 to 485 added by sahil karnekar date 24-10-2024 */}
              <div className="search">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-magnifying-glass"
                    onClick={() => {
                      setShowSearchBar(!showSearchBar);
                      setShowFilterSection(false);
                    }}
                    style={{ margin: "10px", width: "auto", fontSize: "15px" }}
                  ></i>
                  {/* Arshad Comments This On 15-11-2024 */}
                  {/* {showSearchBar && ( */}
                  <div
                    className="search-input-div"
                    style={{ width: `${calculateWidth()}px` }}
                  >
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search here..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* )} */}
                </div>
                <h1 className="excel-calling-data-heading">Excel Data</h1>
                <div style={{ display: "flex", gap: "5px" }}>
                {userType !== "Recruiters" && (
                <div>
                  {showShareButton ? (
                    <button
                      className="lineUp-share-btn"
                      onClick={() => setShowShareButton(false)}
                    >
                      Share
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        className="lineUp-share-btn"
                        onClick={() => {
                          setShowShareButton(true);
                          setSelectedRows([]);
                        }}
                      >
                        Close
                      </button>
                      {/* akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_602 */}
                      {userType === "TeamLeader" && (
                        <button
                          className="lineUp-share-btn"
                          onClick={handleSelectAll}
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </button>
                      )}
                      {/* akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_609 */}
                      <button
                        className="lineUp-share-btn"
                        onClick={forwardSelectedCandidate}
                      >
                        Forward
                      </button>
                    </div>
                  )}
                </div>
              )}
                  <button
                    onClick={toggleFilterSection}
                    className="daily-tr-btn"
                  >
                    Filter <i className="fa-solid fa-filter"></i>
                  </button>
                  <button className="daily-tr-btn" onClick={handleMergeResumes}>
                    Merge Resumes
                  </button>
                </div>
              </div>

              {showFilterSection && (
                <div className="filter-section">
                  <div className="filter-dropdowns">
                    {showFilterSection && (
                      <div className="filter-section">
                        {/* updated by sahil karnekar date 22-10-2024 */}
                        {limitedOptions.map(([optionKey, optionLabel]) => {
                          const uniqueValues = Array.from(
                            new Set(
                              callingList
                                .map((item) => {
                                  const value = item[optionKey];
                                  // Ensure the value is a string before converting to lowercase
                                  return typeof value === "string"
                                    ? value.toLowerCase()
                                    : value;
                                })
                                .filter(
                                  (value) =>
                                    value !== undefined && value !== null
                                ) // Remove null or undefined values
                            )
                          );

                          return (
                            <div key={optionKey} className="filter-option">
                              <button
                                className="white-Btn"
                                onClick={() =>
                                  handleFilterOptionClick(optionKey)
                                }
                              >
                                {optionLabel}
                                <span className="filter-icon">&#x25bc;</span>
                              </button>
                              {activeFilterOption === optionKey && (
                                <div className="city-filter">
                                  <div className="optionDiv">
                                    {/* line number 492 to 513 added by sahil karnekar date : 14-10-2024 */}
                                    {uniqueValues.filter(
                                      (value) =>
                                        value !== "" &&
                                        value !== null &&
                                        value !== "-" &&
                                        value !== undefined &&
                                        !(
                                          optionKey === "alternateNumber" &&
                                          value === 0
                                        )
                                    ).length > 0 ? (
                                      uniqueValues.map(
                                        (value) =>
                                          value !== "" &&
                                          value !== null &&
                                          value !== "-" &&
                                          value !== undefined &&
                                          !(
                                            optionKey === "alternateNumber" &&
                                            value === 0
                                          ) && (
                                            <label
                                              key={value}
                                              className="selfcalling-filter-value"
                                            >
                                              <input
                                                type="checkbox"
                                                checked={
                                                  selectedFilters[
                                                    optionKey
                                                  ]?.includes(value) || false
                                                }
                                                onChange={() =>
                                                  handleFilterSelect(
                                                    optionKey,
                                                    value
                                                  )
                                                }
                                                style={{ marginRight: "5px" }}
                                              />
                                              {value}
                                            </label>
                                          )
                                      )
                                    ) : (
                                      <div>No values</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="attendanceTableData">
                <table className="selfcalling-table attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                    {!showShareButton && userType === "TeamLeader" ? (
                        <th className="attendanceheading">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === filteredCallingList.length}
                            name="selectAll"
                          />
                        </th>
                      ) : null}
                      <th className="attendanceheading">No.</th>
                      <th className="attendanceheading">Added Date</th>
                      <th className="attendanceheading">Candidate Name</th>
                      <th className="attendanceheading">Candidate Email</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Designation</th>
                      <th className="attendanceheading">Experience</th>
                      <th className="attendanceheading">Company Name</th>
                      <th className="attendanceheading">Notice Period</th>
                      <th className="attendanceheading">Resume</th>
                      <th className="attendanceheading">Full Data</th>
                      <th className="attendanceheading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCallingList.map((item, index) => (
                      <tr key={item.candidateId} className="attendancerows">
                         {!showShareButton && userType === "TeamLeader" ? (
                          <td className="tabledata">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.candidateId)}
                              onChange={() => handleSelectRow(item.candidateId)}
                            />
                          </td>
                        ) : null}

                        <td className="tabledata">{index + 1}</td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.date} {item.candidateAddedTime}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.date} {item.candidateAddedTime}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateName}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.candidateName}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateEmail}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.candidateEmail}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.contactNumber}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.contactNumber}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.jobDesignation}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.jobDesignation}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.experienceYear} Years {item.experienceMonth}{" "}
                          Months{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.experienceYear} Years {item.experienceMonth}{" "}
                              Months{" "}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.companyName}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.companyName}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.noticePeriod}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.noticePeriod}
                            </span>
                          </div>
                        </td>

                        <td className="tabledata">
                          <button
                            onClick={() => openResumeModal(item.resume)}
                            style={{ background: "none", border: "none" }}
                          >
                            <i
                              className="fas fa-eye"
                              style={{
                                color: item.resume ? "green" : "inherit",
                              }}
                            ></i>
                          </button>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          onClick={() => openModal(item)}
                        >
                          <i class="fa-solid fa-database"></i>
                          {/* <button
                            className="daily-tr-btn"
                            onClick={() => openModal(item)}
                            style={{ marginLeft: "3px" }}
                          >
                            View
                          </button> */}
                        </td>
                        <td
                          className="tabledata"
                          style={{ textAlign: "center" }}
                        >
                          <i
                            onClick={() => openCallingExcelList(item)}
                            className="fa-regular fa-pen-to-square"
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
              {showForwardPopup ? (
                <>
                  <div
                    className="bg-black bg-opacity-50 modal show"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "fixed",
                      width: "100%",
                      height: "100vh",
                    }}
                  >
                    <Modal.Dialog
                      style={{
                        width: "500px",
                        height: "800px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "100px",
                      }}
                    >
                      <Modal.Header
                        style={{ fontSize: "18px", backgroundColor: "#f2f2f2" }}
                      >
                        Forward To
                      </Modal.Header>
                      <Modal.Body
                        style={{
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        {/* akash_pawar_RejectedCandidate_ShareFunctionality_18/07_1007 */}
                        <div className="accordion">
                          {fetchAllManager && userType === "SuperUser" && (
                            <div className="manager-data-transfer">
                              <div className="old-manager-data">
                                <center>
                                  <h1>Old Managers</h1>
                                </center>
                                {fetchAllManager.map((managers) => (
                                  <div
                                    className="accordion-item-SU"
                                    key={managers.managerId}
                                  >
                                    <div className="accordion-header-SU">
                                      <label
                                        htmlFor={`old-${managers.managerId}`}
                                        className="accordion-title"
                                      >
                                        <input
                                          type="radio"
                                          name="oldmanagers"
                                          id={`old-${managers.managerId}`}
                                          value={managers.managerId}
                                          checked={
                                            oldSelectedManager.oldManagerId ===
                                            managers.managerId
                                          }
                                          onChange={() =>
                                            setOldSelectedManager({
                                              oldManagerId: managers.managerId,
                                              oldManagerJobRole:
                                                managers.managerJobRole,
                                            })
                                          }
                                        />{" "}
                                        {managers.managerName}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="new-manager-data">
                                <center>
                                  <h1>New Managers</h1>
                                </center>
                                {fetchAllManager
                                  .filter(
                                    (item) =>
                                      item.managerId !==
                                      oldSelectedManager.oldManagerId
                                  )
                                  .map((managers) => (
                                    <div
                                      className="accordion-item-SU"
                                      key={managers.managerId}
                                    >
                                      <div className="accordion-header-SU">
                                        <label
                                          htmlFor={`new-${managers.managerId}`}
                                          className="accordion-title"
                                        >
                                          <input
                                            type="radio"
                                            name="newmanagers"
                                            id={`new-${managers.managerId}`}
                                            value={managers.managerId}
                                            checked={
                                              newSelectedManager.newManagerId ===
                                              managers.managerId
                                            }
                                            onChange={() =>
                                              setNewSelectedManager({
                                                newManagerId: managers.managerId,
                                                newManagerJobRole:
                                                  managers.managerJobRole,
                                              })
                                            }
                                          />{" "}
                                          {managers.managerName}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {fetchTeamleader && userType === "Manager" && (
                            <div className="teamleader-data-transfer">
                              <div className="old-teamleader-data">
                                <center>
                                  <h1>Old Team Leaders</h1>
                                </center>
                                {fetchTeamleader.map((teamleaders) => (
                                  <div
                                    className="accordion-item-M"
                                    key={teamleaders.teamLeaderId}
                                  >
                                    <div className="accordion-header-M">
                                      <label
                                        htmlFor={`old-${teamleaders.teamLeaderId}`}
                                        className="accordion-title"
                                      >
                                        <input
                                          type="radio"
                                          name="oldteamleaders"
                                          id={`old-${teamleaders.teamLeaderId}`}
                                          value={teamleaders.teamLeaderId}
                                          checked={
                                            oldselectedTeamLeader.oldTeamLeaderId ===
                                            teamleaders.teamLeaderId
                                          }
                                          onChange={() =>
                                            setOldSelectedTeamLeader({
                                              oldTeamLeaderId:
                                                teamleaders.teamLeaderId,
                                              oldTeamLeaderJobRole:
                                                teamleaders.teamLeaderJobRole,
                                            })
                                          }
                                        />{" "}
                                        {teamleaders.teamLeaderName}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="new-teamleader-data">
                                <center>
                                  <h1>New Team Leaders</h1>
                                </center>
                                {fetchTeamleader
                                  .filter(
                                    (item) =>
                                      item.teamLeaderId !==
                                      oldselectedTeamLeader.oldTeamLeaderId
                                  )
                                  .map((teamleaders) => (
                                    <div
                                      className="accordion-item-M"
                                      key={teamleaders.managerId}
                                    >
                                      <div className="accordion-header-SU">
                                        <label
                                          htmlFor={`new-${teamleaders.teamLeaderId}`}
                                          className="accordion-title"
                                        >
                                          <input
                                            type="radio"
                                            name="newteamleaders"
                                            id={`new-${teamleaders.teamLeaderId}`}
                                            value={teamleaders.teamLeaderId}
                                            checked={
                                              newselectedTeamLeader.newTeamLeaderId ===
                                              teamleaders.teamLeaderId
                                            }
                                            onChange={() =>
                                              setNewSelectedTeamLeader({
                                                newTeamLeaderId:
                                                  teamleaders.teamLeaderId,
                                                newTeamLeaderJobRole:
                                                  teamleaders.teamLeaderJobRole,
                                              })
                                            }
                                          />{" "}
                                          {teamleaders.teamLeaderName}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                          
                          {userType === "TeamLeader" && (
                            <div className="accordion-item">
                              <div className="accordion-header">
                                <label className="accordion-title">
                                 <strong>TL - {loginEmployeeName} </strong>
                                </label>
                              </div>
                              <div className="accordion-content">
                                <form>
                                  {recruiterUnderTeamLeader &&
                                    recruiterUnderTeamLeader.map((recruiters) => (
                                      <div
                                        key={recruiters.recruiterId}
                                      >
                                        <label htmlFor={recruiters.employeeId}> 
                                          <input
                                            type="radio"
                                            id={recruiters.employeeId}
                                            name="recruiter"
                                            value={recruiters.employeeId}
                                            checked={
                                              selectedRecruiters.recruiterId ===
                                              recruiters.employeeId
                                            }
                                            onChange={() =>
                                              setSelectedRecruiters({
                                                index: 1,
                                                recruiterId: recruiters.employeeId,
                                                recruiterJobRole:
                                                  recruiters.jobRole,
                                              })
                                            }
                                          />{" "} - {" "}
                                          {recruiters.employeeName}
                                        </label>
                                      </div>
                                    ))}
                                </form>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_1225 */}
                      </Modal.Body>
                      <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
                        <button
                          onClick={handleShare}
                          className="shortlistedcan-share-forward-popup-btn"
                        >
                          Share
                        </button>
                        <button
                          onClick={() => setShowForwardPopup(false)}
                          className="shortlistedcan-close-forward-popup-btn"
                        >
                          Close
                        </button>
                      </Modal.Footer>
                    </Modal.Dialog>
                  </div>
                </>
              ) : null}

              <div>
                <Modal
                  show={showResumeModal}
                  onHide={closeResumeModal}
                  size="md"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Resume</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedCandidateResume ? (
                      <iframe
                        src={convertToDocumentLink(
                          selectedCandidateResume,
                          "Resume.pdf"
                        )}
                        width="100%"
                        height="550px"
                        title="PDF Viewer"
                      ></iframe>
                    ) : (
                      <p>No resume available</p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeResumeModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          )}
          {showModal && (
            <div className="popup-container">
              <div className="popup-content">
                <h2>Candidate Details</h2>

                <div className="excel-data-content-div">
                  <div className="popup-section">
                    <p>
                      <strong>Recruiter Name: </strong>
                      {showModal?.recruiterName || "-"}
                    </p>
                    <p>
                      <strong>Candidate Alternate No: </strong>
                      {showModal?.alternateNumber}
                    </p>
                    <p>
                      <strong>Source Name: </strong>
                      {showModal?.sourceName || "-"}
                    </p>
                    <p>
                      <strong>Applying Company: </strong>
                      {showModal?.requirementCompany || "-"}
                    </p>
                    <p>
                      <strong>Date of Birth: </strong>
                      {showModal?.dateOfBirth || "-"}
                    </p>
                    <p>
                      <strong>Communication Rating: </strong>
                      {showModal?.communicationRating}
                    </p>
                    <p>
                      <strong>Current Location: </strong>
                      {showModal?.currentLocation || "-"}
                    </p>
                    <p>
                      <strong>Full Address: </strong>
                      {showModal?.fullAddress || "-"}
                    </p>
                    <p>
                      <strong>Calling Feedback: </strong>
                      {showModal?.callingFeedback || "-"}
                    </p>
                    <p>
                      <strong>Incentive: </strong>
                      {showModal?.incentive || "-"}
                    </p>
                    <p>
                      <strong>Old Employee Id: </strong>
                      {showModal?.oldEmployeeId || "-"}
                    </p>
                  </div>

                  <div className="popup-section">
                    <p>
                      <strong>Distance: </strong>
                      {showModal?.distance || "-"}
                    </p>
                    <p>
                      <strong>Current CTC: </strong>
                      {showModal?.currentCTCLakh || "0"} Lakh{" "}
                      {showModal?.currentCTCThousand || "0"} Thousand
                    </p>
                    <p>
                      <strong>Expected CTC: </strong>
                      {showModal?.expectedCTCLakh || "0"} Lakh{" "}
                      {showModal?.expectedCTCThousand || "0"} Thousand
                    </p>
                    {/* <p>
                      <strong>Notice Period: </strong>
                      {showModal?.noticePeriod || "-"}
                    </p> */}
                    <p>
                      <strong>Holding Any Offer: </strong>
                      {showModal?.holdingAnyOffer || "-"}
                    </p>
                    <p>
                      <strong>Final Status: </strong>
                      {showModal?.finalStatus || "-"}
                    </p>
                    <p>
                      <strong>Relevant Experience: </strong>
                      {showModal?.relevantExperience || "-"}
                    </p>
                    <p>
                      <strong>Gender: </strong>
                      {showModal?.gender || "-"}
                    </p>
                    <p>
                      <strong>Qualification: </strong>
                      {showModal?.qualification || "-"}
                    </p>
                    <p>
                      <strong>Year of Passing: </strong>
                      {showModal?.yearOfPassing || "-"}
                    </p>
                    <p>
                      <strong>Interview Time: </strong>
                      {showModal?.interviewTime || "-"}
                    </p>
                    <p>
                      <strong>Preferred Location: </strong>
                      {showModal?.preferredLocation || "-"}
                    </p>
                  </div>

                  <div className="popup-section">
                    <p>
                      <strong>Feedback: </strong>
                      {showModal?.feedBack || "-"}
                    </p>
                    <p>
                      <strong>Offer Letter Msg: </strong>
                      {showModal?.offerLetterMsg || "-"}
                    </p>
                    <p>
                      <strong>Marital Status: </strong>
                      {showModal?.maritalStatus || "-"}
                    </p>
                    <p>
                      <strong>Pick Up and Drop: </strong>
                      {showModal?.pickUpAndDrop || "-"}
                    </p>
                    <p>
                      <strong>Message for Team Leader: </strong>
                      {showModal?.msgForTeamLeader || "-"}
                    </p>
                    <p>
                      <strong>Availability for Interview: </strong>
                      {showModal?.availabilityForInterview || "-"}
                    </p>
                  
                  </div>

                  <div className="popup-section">
                    <p>
                      <strong>Extra Columns 1: </strong>
                      {showModal?.extra1 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 2: </strong>
                      {showModal?.extra2 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 3: </strong>
                      {showModal?.extra3 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 4: </strong>
                      {showModal?.extra4 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 5: </strong>
                      {showModal?.extra5 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 6: </strong>
                      {showModal?.extra6 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 7: </strong>
                      {showModal?.extra7 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 8: </strong>
                      {showModal?.extra8 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 9: </strong>
                      {showModal?.extra9 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 10: </strong>
                      {showModal?.extra10 || "-"}
                    </p>
                  </div>
                </div>

                <center>
                    <p>
                      <strong> Shared Status : </strong>
                      {showModal?.sharedStatus || "-"} By {showModal?.oldRecruiterName || "-"} ( {showModal?.oldJobRole === "TeamLeader" ? "Team Leader" : showModal?.oldJobRole} ) 
                    </p>
                  <button className="daily-tr-btn" onClick={closeModal}>
                    Close
                  </button>
                </center>
              </div>
            </div>
          )}
          {selectedCandidate && (
            <CallingTrackerForm
              initialData={selectedCandidate}
              loginEmployeeName={loginEmployeeName}
              onClose={() => setSelectedCandidate(null)}
              onSuccess={handleUpdateSuccess}
              onsuccessfulDataAdditions={onsuccessfulDataAdditions}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CallingExcelList;
