import React, { useState, useEffect, useCallback } from "react";
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
import { Pagination } from "antd";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";

const CallingExcelList = ({
  updateState,
  funForGettingCandidateId,
  onCloseTable,
  loginEmployeeName,
  // updated by sahil karnekar
  toggleSection,
  onsuccessfulDataAdditions,
  // toggleSection,
  viewsSearchTerm,
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
  const [searchCount, setSearchCount] = useState(0);
  // Arshad Attar Added This Code On 18-11-2024
  // Added New Share Data Frontend Logic line 44 to 50
  const [showShareButton, setShowShareButton] = useState(true);
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [fetchAllManager, setFetchAllManager] = useState([]);
  const [fetchTeamleader, setFetchTeamleader] = useState([]);
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]);
  const [isDataSending, setIsDataSending] = useState(false);

  const { employeeId, userType } = useParams();
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchUpdatedData = (page, size) => {
    setLoading(true); // Set loading to true before fetching the updated data
    fetch(
      `${API_BASE_URL}/fetch-excel-data/${employeeId}/${userType}?searchTerm=${searchTerm}&page=${page}&size=${size}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCallingList(data.content);
        setFilteredCallingList(data.content);
        setTotalRecords(data.totalElements);
        setSearchCount(data.length);
        setLoading(false); // Set loading to false when data is successfully fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  };

  useEffect(() => {
    fetchUpdatedData(currentPage, pageSize);
  }, [employeeId, userType, currentPage, pageSize]);

  useEffect(() => {
    const options = Object.keys(filteredCallingList[0] || {}).filter(
      (key) => key !== "candidateId"
    );
    setFilterOptions(options);
  }, [filteredCallingList]);

  useEffect(() => {}, [selectedFilters]);

  useEffect(() => {}, [filteredCallingList]);

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
    if (viewsSearchTerm) {
      setSearchTerm(viewsSearchTerm); // Sync viewsSearchTerm to local searchTerm
      filterData(); // Re-trigger data filtering
    }
  }, [viewsSearchTerm]);

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
        (item.excelFileUploadDate &&
          item.excelFileUploadDate.toLowerCase().includes(searchTermLower)) ||
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
    setSearchCount(filtered.length);
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

  const handleUpdateSuccess = (page, size) => {
    fetch(
      `${API_BASE_URL}/fetch-excel-data/${employeeId}/${userType}?page=${page}&size=${size}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCallingList(data.content);
        setFilteredCallingList(data.content);
        setTotalRecords(data.totalElements);
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

  // Arshad Attar Added This Code On 18-11-2024
  // Added New Share Data Frontend Logic,
  const [oldselectedTeamLeader, setOldSelectedTeamLeader] = useState({
    oldTeamLeaderId: "",
    oldTeamLeaderJobRole: "",
  });
  const [newselectedTeamLeader, setNewSelectedTeamLeader] = useState({
    newTeamLeaderId: "",
    newTeamLeaderJobRole: "",
  });

  const [selectedRecruiters, setSelectedRecruiters] = useState({
    employeeId: null,
    jobRole: "",
  });

  const [oldSelectedManager, setOldSelectedManager] = useState({
    oldManagerId: "",
    oldManagerJobRole: "",
  });
  const [newSelectedManager, setNewSelectedManager] = useState({
    newManagerId: "",
    newManagerJobRole: "",
  });

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

  // Arshad Attar Added This Code On 18-11-2024
  // Added New Share Data Frontend Logic line 609 704
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
      const response = await fetch(`${API_BASE_URL}/tl-namesIds/${empId}`);
      const data = await response.json();
      setFetchTeamleader(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  const fetchManager = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-all-managers`);
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
    if (!selectedRecruiters.employeeId || selectedRows.length === 0) {
      toast.error("Please select an employee and rows to share.");
      setIsDataSending(false);
      return;
    }

    const requestData = {
      candidateIds: selectedRows,
      employeeId: selectedRecruiters.employeeId,
      jobRole: selectedRecruiters.jobRole,
    };

    console.log("Request Data:", requestData);

    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };

      const url = `${API_BASE_URL}/share-excel-data/${employeeId}/${userType}`;
      const response = await fetch(url, requestOptions);

      const responseData = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success(responseData);
      fetchUpdatedData();
      setShowForwardPopup(false);
      setShowShareButton(true);
      setSelectedRows([]);
      setSelectedRecruiters({ employeeId: null, jobRole: "" });
      console.log("Data Shared Successfully.......");
    } catch (error) {
      console.error("Error while forwarding candidates:", error);
      setIsDataSending(false);
      toast.error("Failed to forward candidates. Please try again.");
    } finally {
      setIsDataSending(false);
    }
  };

  const openCallingExcelList = (candidateData) => {
    console.log("Link Come here....");
    setSelectedCandidate(candidateData);
    // updated by sahil karnekar
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
        toast.success(
          <div dangerouslySetInnerHTML={{ __html: formattedMessage }} />
        );

        fetchUpdatedData(currentPage, pageSize);
      } else {
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

  // Arshad Attar Added This Code On 18-11-2024
  // Added New Share Data Frontend Logic line 836 to 1060
  const [employeeCount, setEmployeeCount] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([]);
  const [expandedManagerId, setExpandedManagerId] = useState(null);
  const [expandedTeamLeaderId, setExpandedTeamLeaderId] = useState(null);
  const [customRange, setCustomRange] = useState({ start: null, end: null });
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Ensure validation for custom inputs

  // useEffect(() => {
  //   if (userType) {
  //     fetchEmployeeCount(employeeId, userType);
  //   }
  //   if (selectedManagers.length > 0) {
  //     const ids = selectedManagers
  //       .map((manager) => manager.managerId)
  //       .join(","); // Join IDs with commas
  //     const role = selectedManagers[0].managerJobRole; // Assuming all selected managers have the same role

  //     fetchEmployeeCount(ids, role);
  //   } else if (selectedTeamLeaders.length > 0) {
  //     const ids = selectedTeamLeaders
  //       .map((teamLeader) => teamLeader.teamLeaderId)
  //       .join(","); // Join IDs with commas
  //     const role = selectedTeamLeaders[0].teamLeaderJobRole; // Assuming all selected managers have the same role

  //     fetchEmployeeCount(ids, role);
  //   }
  // }, [selectedManagers, selectedTeamLeaders]); // Dependency array to run effect on selectedManagers change

  useEffect(() => {
    const fetchManagerNames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-all-managers`);
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching manager names:", error);
      }
    };

    if (userType === "SuperUser") {
      fetchManagerNames();
    } else if (userType === "Manager") {
      fetchTeamLeaderNames(employeeId);
    } else if (userType === "TeamLeader") {
      fetchRecruiterUnderTeamLeaderData(employeeId);
    }
  }, [userType, employeeId]);

  useEffect(() => {
    if (expandedManagerId != null) {
      fetchTeamLeaderNames(expandedManagerId);
    }
  }, [expandedManagerId]);

  useEffect(() => {
    if (expandedTeamLeaderId != null) {
      fetchRecruiterUnderTeamLeaderData(expandedTeamLeaderId);
    }
  }, [expandedTeamLeaderId]);

  const fetchTeamLeaderNames = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tl-namesIds/${id}`);
      setTeamLeaders(response.data);
    } catch (error) {
      console.error("Error fetching team leader names:", error);
    }
  };

  const fetchRecruiterUnderTeamLeaderData = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/employeeId-names/${id}`
      );
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    }
  }, []);

  const toggleTeamLeaderExpand = (teamLeaderId) => {
    setExpandedTeamLeaderId(
      expandedTeamLeaderId === teamLeaderId ? null : teamLeaderId
    );
  };
  const handleManagerCheckboxChange = (manager) => {
    setSelectedManagers((prev) =>
      prev.some((item) => item.managerId === manager.managerId)
        ? prev.filter((item) => item.managerId !== manager.managerId)
        : [
            ...prev,
            {
              managerId: manager.managerId,
              managerJobRole: manager.jobRole,
            },
          ]
    );
  };

  const handleTeamLeaderCheckboxChange = (teamLeader) => {
    setSelectedTeamLeaders((prev) =>
      prev.some((item) => item.teamLeaderId === teamLeader.teamLeaderId)
        ? prev.filter((item) => item.teamLeaderId !== teamLeader.teamLeaderId)
        : [
            ...prev,
            {
              teamLeaderId: teamLeader.teamLeaderId,
              teamLeaderJobRole: teamLeader.jobRole,
            },
          ]
    );
    setSelectedRecruiters({
      employeeId: teamLeader.teamLeaderId,
      jobRole: teamLeader.jobRole,
    });
  };

  const handleRecruiterCheckboxChange = (recruiter) => {
    setSelectedRecruiters((prev) => {
      if (prev.some((item) => item.employeeId === recruiter.employeeId)) {
        // Remove the recruiter if already selected
        return prev.filter((item) => item.employeeId !== recruiter.employeeId);
      } else {
        // Add the recruiter to the selection
        return [...prev, recruiter];
      }
    });
  };

  const renderManagers = () => {
    return managers.map((manager) => (
      <div key={manager.managerId} className="dropdown-section">
        <div className="PI-dropdown-row">
          <input
            style={{
              transform: "scale(1.4)",
              margin: "5px",
            }}
            type="radio"
            checked={selectedManagers.some(
              (item) => item.managerId === manager.managerId
            )}
            onChange={() => handleManagerCheckboxChange(manager)}
          />
          <label
            className="clickable-label"
            onClick={() => toggleManagerExpand(manager.managerId)}
          >
            {manager.managerName}
            <i
              className={`fa-solid ${
                expandedManagerId === manager.managerId
                  ? "fa-angle-up"
                  : "fa-angle-down"
              }`}
            ></i>
          </label>
        </div>
        {expandedManagerId === manager.managerId && (
          <div className="PI-dropdown-column ">
            {renderTeamLeaders(manager.managerId)}
          </div>
        )}
      </div>
    ));
  };

  const renderTeamLeaders = (managerId) => {
    return teamLeaders.map((teamLeader) => (
      <div key={teamLeader.teamLeaderId} className="PI-dropdown-section">
        <div className="PI-dropdown-row">
          <input
            type="radio"
            checked={
              selectedRecruiters.employeeId === teamLeader.teamLeaderId &&
              selectedRecruiters.jobRole === teamLeader.jobRole
            }
            onChange={() =>
              setSelectedRecruiters({
                employeeId: teamLeader.teamLeaderId,
                jobRole: teamLeader.jobRole,
              })
            }
          />
          <label
            className="clickable-label"
            onClick={() => toggleTeamLeaderExpand(teamLeader.teamLeaderId)}
          >
            {teamLeader.teamLeaderName}
            <i
              className={`fa-solid ${
                expandedTeamLeaderId === teamLeader.teamLeaderId
                  ? "fa-angle-up"
                  : "fa-angle-down"
              }`}
            ></i>
          </label>
        </div>
        {expandedTeamLeaderId === teamLeader.teamLeaderId && (
          <div className="PI-dropdown-column">{renderRecruiters()}</div>
        )}
      </div>
    ));
  };

  const renderRecruiters = () => {
    return recruiters.map((recruiter) => (
      <div key={recruiter.employeeId} className="PI-dropdown-row">
        <input
          type="radio"
          name="recruiter" // Ensure only one recruiter can be selected
          checked={selectedRecruiters.employeeId === recruiter.employeeId}
          onChange={() =>
            setSelectedRecruiters({
              employeeId: recruiter.employeeId,
              jobRole: recruiter.jobRole,
            })
          }
        />
        <label>{recruiter.employeeName}</label>
      </div>
    ));
  };

  // const fetchEmployeeCount = async (ids, role) => {
  //   try {
  //     const response = await axios.get(
  //       `${API_BASE_URL}/head-count/${role}/${ids}`
  //     );
  //     setEmployeeCount(response.data);
  //   } catch (error) {}
  // };

  // displya range For Select Candidates , Comment by Arshad On 19-11-2024
  // const handleRangeSelection = (startIndex, endIndex) => {
  //   if (filteredCallingList.length === 0) {
  //     toast.error("No candidates available for selection.");
  //     return;
  //   }
  //   // Sort the filtered list by candidateId
  //   const sortedList = [...filteredCallingList].sort(
  //     (a, b) => a.candidateId - b.candidateId
  //   );

  //   // Get the range of candidate IDs
  //   const selectedIds = sortedList
  //     .slice(startIndex - 1, endIndex) // Adjust to zero-based indexing
  //     .map((item) => item.candidateId);

  //   setSelectedRows(selectedIds); // Update the selected rows with candidate IDs
  // };

  // added by sahil karnekar date 4-12-2024
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (current, size) => {
    setPageSize(size); // Update the page size
    setCurrentPage(1); // Reset to the first page after page size changes
  };

  const calculateRowIndex = (index) => {
    return (currentPage - 1) * pageSize + index + 1;
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
                  {/* // Arshad Attar Added This Code On 18-11-2024
                    // Added New Share Data Frontend Logic line 1104 to 1144 */}
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
                          {(userType === "TeamLeader" ||
                            userType === "Manager") && (
                            <button
                              className="lineUp-share-btn"
                              onClick={handleSelectAll}
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </button>
                          )}

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

              {/* {!showShareButton && (
  <div>
    <button onClick={() => handleRangeSelection(1, 100)}>1 - 100</button>
    <button onClick={() => handleRangeSelection(1, 500)}>1 - 500</button>
    <button onClick={() => handleRangeSelection(1, 1000)}>1 - 1000</button>
    <div>
      <label>Custom Range:</label>
      <input
        type="number"
        placeholder="Start"
        value={customStart}
        onChange={(e) => setCustomStart(parseInt(e.target.value))}
      />
      <input
        type="number"
        placeholder="End"
        value={customEnd}
        onChange={(e) => setCustomEnd(parseInt(e.target.value))}
      />
      <button
        onClick={() => handleRangeSelection(customStart, customEnd)}
      >
        Apply
      </button>
    </div>
  </div>
)} */}

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
                <table className="attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      {/* // Arshad Attar Added This Code On 18-11-2024
                     // Added New Share Data Frontend Logic line 1258 to 1268 */}

                      {!showShareButton ? (
                        <th className="attendanceheading">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              selectedRows.length === filteredCallingList.length
                            }
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
                      // Arshad Attar Added This Code On 18-11-2024
                      // Added New Share Data Frontend Logic line 1286 to 1297 */}
                      <tr key={item.candidateId} className="attendancerows">
                        {!showShareButton ? (
                          <td className="tabledata">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.candidateId)}
                              onChange={() => handleSelectRow(item.candidateId)}
                            />
                          </td>
                        ) : null}
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {calculateRowIndex(index)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {calculateRowIndex(index)}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                              { highlightText(item.date || "", searchTerm)  } -  {" "}  {item.candidateAddedTime}
                          <div className="tooltip">
                            <span className="tooltiptext">{highlightText(
                                item.date.toString().toLowerCase() || "",
                                searchTerm
                              )}  - {" "}  {item.candidateAddedTime}</span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                           {highlightText(item.candidateName || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.candidateName || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                            {highlightText(item.candidateEmail || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.candidateEmail || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                            {highlightText(item.contactNumber || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.contactNumber || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                           {highlightText(item.jobDesignation || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.jobDesignation || "",
                                searchTerm
                              )}
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
                          {highlightText(item.companyName || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.companyName || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(item.noticePeriod || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.noticePeriod || "",
                                searchTerm
                              )}
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
                          <i className="fa-solid fa-database"></i>
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



              <div className="search-count-last-div">
            Total Results : {totalRecords}
          </div>

        <Pagination
        current={currentPage}
        total={totalRecords}
        pageSize={pageSize}
        showSizeChanger
        showQuickJumper
        onShowSizeChange={handleSizeChange}
        onChange={handlePageChange}
        style={{
          justifyContent: "center",
        }}
      />

              {/*Arshad Attar Added This Code On 18-11-2024
               Added New Share Data Frontend Logic line 1444 to 1572 */}
              {showForwardPopup && (
                <div className="custom-modal-overlay">
                  <div className="custom-modal-container">
                    <div className="custom-modal-header">
                      <h2>Share To</h2>
                      <button onClick={() => setShowForwardPopup(false)}>
                        <i
                          id="jd-cancle-btn"
                          className="fa-solid fa-xmark"
                          title="Cancel"
                        ></i>
                      </button>
                    </div>
                    <div className="custom-modal-body">
                      <div className="accordion">
                        <div className="share-data-name">
                          {userType === "Recruiters" && <span>Recruiter</span>}
                          {userType === "TeamLeader" && (
                            <span>Team Leader ( Select Recruiters )</span>
                          )}
                          {userType === "Manager" && (
                            <span>
                              Manager ( Select Team Leader OR Recruiters )
                            </span>
                          )}
                          {userType === "SuperUser" && <span>Super User</span>}
                        </div>
                        <hr />
                        <div className="PI-dropdown-container">
                          <div className="PI-dropdown-content">
                            {userType === "SuperUser" && renderManagers()}
                            {userType === "Manager" &&
                              renderTeamLeaders(employeeId)}
                            {userType === "TeamLeader" &&
                              renderRecruiters(employeeId)}
                            <div style={{ display: "flex", gap: "7px" }}>
                              <button
                                onClick={handleShare}
                                className="daily-tr-btn"
                              >
                                Share
                              </button>
                              <button
                                onClick={() => setShowForwardPopup(false)}
                                className="daily-tr-btn"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      <strong>Excel Upload Date: </strong>
                      {showModal?.excelFileUploadDate || "-"}
                    </p>
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
                    {showModal?.sharedStatus || "-"} By{" "}
                    {showModal?.oldRecruiterName || "-"} ({" "}
                    {showModal?.oldJobRole === "TeamLeader"
                      ? "Team Leader"
                      : showModal?.oldJobRole}{" "}
                    )
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
              initialData={{
                ...selectedCandidate,
                sourceComponent: "CallingExcelList",
              }}
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
