//Akash_Pawar_SendClientEmail_09/07
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SendClientEmail.css";
import { differenceInDays, differenceInSeconds } from "date-fns";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import HashLoader from "react-spinners/HashLoader";
// import ClipLoader from "react-spinners/ClipLoader";
import { Form, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { Avatar, Badge, Card, List, Pagination, Popconfirm, Skeleton } from "antd";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";
import { getSocket } from "../EmployeeDashboard/socket";
import limitedOptions from "../helper/limitedOptions";
import { Modal as AntdModal } from 'antd';
import profileImageRtempus from "../assets/rtempus.jpeg";
import profileImageVelocity from "../assets/velocityHr.png";
import { DeleteOutlined } from "@ant-design/icons";


// SwapnilRokade_SendClientEmail_ModifyFilters_11/07
// SwapnilROkade_AddingErrorAndSuccessMessage_19/07
// SwapnilRokade_SendClientEmail_addedProcessImprovmentEvaluatorFunctionalityStoringInterviweResponse_18_to_1251_29/07/2024

const SendClientEmail = ({ clientEmailSender }) => {
  const [callingList, setCallingList] = useState([])
  const { employeeId, userType } = useParams();
  const employeeIdnew = parseInt(employeeId);
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState(null)
  const [color, setColor] = useState("#ffcb9b")
  const [displayBigSkeletonForRecruiters, setDisplayBigSkeletonForRecruiters] = useState(false)
  const [displayModalContainer, setDisplayModalContainer] = useState(false)
  const [allImagesForRecruiters, setAllImagesForRecruiters] = useState([])
  const [displayBigSkeletonForTeamLeaders, setDisplayBigSkeletonForTeamLeaders] = useState(false)
  const [selectedTeamLeaderName, setSelectedTeamLeaderName] = useState("")
  const [employeeCount, setEmployeeCount] = useState([])

  const [showSearchBar, setShowSearchBar] = useState(false)
  const [showFilterSection, setShowFilterSection] = useState(false)
  const [filterOptions, setFilterOptions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortCriteria, setSortCriteria] = useState(null)
  const [sortOrder, setSortOrder] = useState("asc")
  const [filteredCallingList, setFilteredCallingList] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({})
  const [loading, setLoading] = useState(true) // Add loading state
  const [activeFilterOption, setActiveFilterOption] = useState(null)
  const [showShareButton, setShowShareButton] = useState(true)
  const [showPermissionModal, setShowPermissionModal] = useState(false)

  const [selectedRows, setSelectedRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [difference, setDifference] = useState()
  const [showUpdateModal, setShowUpdateModal] = useState()
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [searchCount, setSearchCount] = useState(0)
  const [allImagesForTeamLeaders, setAllImagesForTeamLeaders] = useState([])
  const [allSelected, setAllSelected] = useState(false) // New state to track if all rows are selected
  const filterRef = useRef(null)

  const [isHorizontallyScrolling, setIsHorizontallyScrolling] = useState(false)
  const tableContainerRef = useRef(null)
  const [alreadyAssignedJids, setAlreadyAssignedJids] = useState([]);

  const getAllAssignedIds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-all-permissions`);
      setAlreadyAssignedJids(response.data);
    } catch (error) {
      console.error('Error fetching assigned job IDs:', error);
    }
  };
  useEffect(()=>{
    if(userType === "Manager"){
      getAllAssignedIds();
    }

  },[])
  const handleScroll = () => {
    if (!tableContainerRef.current) return
    setIsHorizontallyScrolling(tableContainerRef.current.scrollLeft > 0)
  }
  const navigator = useNavigate();
// need to be changed after implementation of api
  const [pageSize, setPageSize] = useState(userType === "Recruiters" ? 100000 : 20);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [triggerFetch, setTriggerFetch] = useState(false)
  const [displayManagers, setDisplayManagers] = useState(false)

  const [activeTeamLeader, setActiveTeamLeader] = useState(null)
  const [displayRecruiters, setDisplayRecruiters] = useState(false)
  const [recruitersList, setRecruitersList] = useState([])
  const [teamLeadersList, setTeamLeadersList] = useState({})
  const [teamLeaderToRecruiters, setTeamLeaderToRecruiters] = useState({})
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([])
  const [selectedManagers, setSelectedManagers] = useState([])
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([])
  const [displayMoreButton, setDisplayMoreButton] = useState(false)
  const [showCustomDiv, setShowCustomDiv] = useState(false)
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const [showSelectionCards, setShowSelectionCards] = useState(false)
  const [imageLoadErrors, setImageLoadErrors] = useState({})
  const [selectedRecruiters, setSelectedRecruiters] = useState([])
  const [accessedIds, setAccessedIds] = useState([]);
  const managerToTeamLeaders = {}


  const fetchAccessedIds = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/employee-permissions/${employeeId}`);

      if (resp.status === 200 && Array.isArray(resp.data)) {
        const ids = resp.data.map(item => item.jobId.toString());
        setAccessedIds(ids);
      } else {
        setAccessedIds([]); // fallback in case of unexpected response
      }
    } catch (error) {
      console.error("Error fetching accessed IDs:", error);
      setAccessedIds([]); // fallback in case of error
    }
  };
  useEffect(()=>{
if(userType === "Recruiters"){
  fetchAccessedIds();
}
  },[])
  

  const fetchCallingList = (page, size) => {
    const newRequirmentIds = accessedIds.length > 0 ? accessedIds.join(',') : "";
    fetch(`${API_BASE_URL}/calling-lineup/${employeeId}/${userType}?searchTerm=${searchTerm}&requirementIds=${newRequirmentIds}&requirmentParamKey=${userType === "Recruiters" ? "yes" : "no"}&page=${page}&size=${size}`)
      .then((response) => response.json())
      .then((data) => {
     console.log(data);
     
          setFilteredCallingList(data.content)
          setCallingList(data.content)
          setTotalRecords(data.totalElements)
          setSearchCount(data.content.length)
        
      
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setLoading(false)
      })
  }

// Rajlaxmi Jagadale Added that code Date 14/04/2025 line 119/201
  const handleOpenDownArrowContentForRecruiters = async (teamLeaderId, teamLeaderName) => {
    setDisplayRecruiters(false)
    setAllImagesForRecruiters([])
    setDisplayBigSkeletonForRecruiters(true)
    // Store the team leader name when opening recruiters
    setSelectedTeamLeaderName(teamLeaderName)
    try {
      const response = await axios.get(`${API_BASE_URL}/employeeId-names/${teamLeaderId}`)
      setRecruitersList(response.data)

      // Immediately fetch images for recruiters after getting the list
      const images = await Promise.all(
        response.data.map(async (recruiter) => {
          return await getUserImageFromApiForReport(recruiter.employeeId, recruiter.jobRole)
        }),
      )
      setAllImagesForRecruiters(images)

      setTeamLeaderToRecruiters((prev) => ({
        ...prev,
        [teamLeaderId]: response.data.map((recruiter) => recruiter.employeeId),
      }))
      setDisplayBigSkeletonForRecruiters(false)
      setDisplayRecruiters(true)
    } catch (error) {
      console.error("Error fetching recruiters:", error)
      setDisplayBigSkeletonForRecruiters(false)
    }
  }

  useEffect(() => {
    fetchCallingList(currentPage, pageSize)
    // setSelectedRows([]);
    // setAllSelected(false);
  }, [employeeId, currentPage, pageSize, triggerFetch, accessedIds])

  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) => Object.keys(filteredCallingList[0] || {}).includes(key))
      .map(([key]) => key)

    setFilterOptions(options)
  }, [filteredCallingList])

  // const handleFilterOptionClick = (key) => {
  //   setActiveFilterOption(activeFilterOption === key ? null : key);
  //   setSelectedFilters((prev) => ({ ...prev, [key]: [] }));
  // };
// Rajlaxmi added taht code DAte 14/04/2025 Fech Image line 168/239
  useEffect(() => {
    const fetchAllImagesForRecruiters = async () => {
      if (recruitersList && recruitersList.length > 0) {
        try {
          const images = await Promise.all(
            recruitersList.map(async (recruiter) => {
              try {
                const imageUrl = await getUserImageFromApiForReport(recruiter.employeeId, recruiter.jobRole)
                if (imageUrl) {
                  const img = new Image()
                  img.src = imageUrl
                  return new Promise((resolve) => {
                    img.onload = () => resolve(imageUrl)
                    img.onerror = () => resolve(null)
                    setTimeout(() => resolve(null), 5000)
                  })
                }
                return null
              } catch (error) {
                console.error(`Error fetching image for recruiter ${recruiter.employeeId}:`, error)
                return null
              }
            }),
          )
          setAllImagesForRecruiters(images)
        } catch (error) {
          console.error("Error in fetchAllImagesForRecruiters:", error)
          setAllImagesForRecruiters(Array(recruitersList.length).fill(null))
        }
      }
    }

    fetchAllImagesForRecruiters()
  }, [recruitersList])

  useEffect(() => {
    const fetchAllImagesForTeamLeaders = async () => {
      if (teamLeadersList && teamLeadersList.length > 0) {
        try {
          const images = await Promise.all(
            teamLeadersList.map(async (teamLeader) => {
              try {
                const imageUrl = await getUserImageFromApiForReport(teamLeader.teamLeaderId, teamLeader.jobRole)
                // Validate image URL by preloading
                if (imageUrl) {
                  const img = new Image()
                  img.src = imageUrl
                  return new Promise((resolve) => {
                    img.onload = () => resolve(imageUrl)
                    img.onerror = () => resolve(null)
                    // Set a timeout in case the image takes too long to load
                    setTimeout(() => resolve(null), 5000)
                  })
                }
                return null
              } catch (error) {
                console.error(`Error fetching image for team leader ${teamLeader.teamLeaderId}:`, error)
                return null
              }
            }),
          )
          setAllImagesForTeamLeaders(images)
        } catch (error) {
          console.error("Error in fetchAllImagesForTeamLeaders:", error)
          setAllImagesForTeamLeaders(Array(teamLeadersList.length).fill(null))
        }
      }
    }

    fetchAllImagesForTeamLeaders()
  }, [teamLeadersList])
// Rajlaxmi jagadale added taht code and Toastify Date 14/04/2025 
  const handleOkey = async () => {
    try {
      if (selectedRecruiters.length === 0) {
        toast.error("Please select at least one recruiter")
        return
      }

      if (selectedRowsPermissionIds.length === 0) {
        toast.error("Please select at least one job")
        return
      }

      const response = await axios.post(`${API_BASE_URL}/permissions`,[
        {
          empId: selectedRecruiters[0].recruiterId,
          jobIds: selectedRowsPermissionIds,
          managerId: employeeId
        }
      ])
      

      // Here you would typically make an API call to grant permissions
      // For example:
      // const response = await axios.post(`${API_BASE_URL}/grant-permissions`, {
      //   recruiters: selectedRecruiters,
      //   jobIds: selectedRowsPermissionIds,
      //   teamLeaders: selectedTeamLeaders
      // })

      // Close the modal
      setShowSelectPermissionRecruiters(false)

      // Reset selections
      setSelectedRecruiters([])
      setSelectedTeamLeaders([])
      setSelectedTeamLeaderName("")
      setSelectedRowsPermissionIds([])

      // Show success message
      toast.success(response.data)

      if (selectedCheckboxes.length > 0) {
        setShowSelectionCards(true)
      }
    } catch (error) {
      console.error("Error granting permissions:", error)
      toast.error("Failed to grant permissions. Please try again.")
    }
  }
  const handleOptionChange = async (event) => {
    const value = event.target.value

    setSelectedOption(value)

    if (value === "custom") {
      setDisplayModalContainer(false)
      setShowCustomDiv(true)
      return
    }

    if (selectedRole === "" && selectedIds.length === 0) {
      setDisplayModalContainer(true)
      setShowCustomDiv(false)
      handleDisplayManagers()
      setDisplayMoreButton(true)
    } else {
      setDisplayModalContainer(false)
    }
  }
  // Rajlaxmi JAgadale Added taht code DAte 14/04/2025 306/353
  const getFallbackImageUrl = (index) => {
    return `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
  }
  useEffect(() => {
    const fetchAllImagesForRecruiters = async () => {
      if (recruitersList && recruitersList.length > 0) {
        try {
          const images = await Promise.all(
            recruitersList.map(async (recruiter) => {
              try {
                const imageUrl = await getUserImageFromApiForReport(recruiter.employeeId, recruiter.jobRole)
                if (imageUrl) {
                  const img = new Image()
                  img.src = imageUrl
                  return new Promise((resolve) => {
                    img.onload = () => resolve(imageUrl)
                    img.onerror = () => resolve(null)
                    setTimeout(() => resolve(null), 5000)
                  })
                }
                return null
              } catch (error) {
                console.error(`Error fetching image for recruiter ${recruiter.employeeId}:`, error)
                return null
              }
            }),
          )
          setAllImagesForRecruiters(images)
        } catch (error) {
          console.error("Error in fetchAllImagesForRecruiters:", error)
          setAllImagesForRecruiters(Array(recruitersList.length).fill(null))
        }
      }
    }

    fetchAllImagesForRecruiters()
  }, [recruitersList])

  const hasSelectedChildren = (parentId, parentType) => {
    if (parentType === "Manager") {
      const teamLeaderIds = managerToTeamLeaders[parentId] || []
      return teamLeaderIds.some((tlId) => selectedIds.includes(tlId))
    } else if (parentType === "TeamLeader") {
      const recruiterIds = teamLeaderToRecruiters[parentId] || []
      return recruiterIds.some((recruiterId) => selectedIds.includes(recruiterId))
    }
    return false
  }
  const handleCancels = () => {
    setDisplayModalContainer(false)
  }
  const handleFilterOptionClick = (key) => {
    if (activeFilterOption === key) {
      setActiveFilterOption(null) // Close the current filter
    } else {
      setActiveFilterOption(key) // Open a new filter section
    }

    // Initialize the selected filter array if it doesn't exist
    setSelectedFilters((prev) => {
      const newSelectedFilters = { ...prev }
      if (!newSelectedFilters[key]) {
        newSelectedFilters[key] = [] // Create an empty array for values
      }
      return newSelectedFilters
    })
  }
  const handleImageError = (id, type) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [`${type}-${id}`]: true,
    }))
  }

  const handleMouseOver = (event) => {
    const tableData = event.currentTarget
    const tooltip = tableData.querySelector(".tooltip")
    const tooltiptext = tableData.querySelector(".tooltiptext")

    if (tooltip && tooltiptext) {
      const textOverflowing =
        tableData.offsetWidth < tableData.scrollWidth || tableData.offsetHeight < tableData.scrollHeight
      if (textOverflowing) {
        const rect = tableData.getBoundingClientRect()
        tooltip.style.top = `${rect.top - 10}px`
        tooltip.style.left = `${rect.left + rect.width / 100}px`
        tooltip.style.visibility = "visible"
      } else {
        tooltip.style.visibility = "hidden"
      }
    }
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest(".filter-option button") // Prevent closing when clicking inside the button
      ) {
        setActiveFilterOption(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  const handleMouseOut = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip")
    if (tooltip) {
      tooltip.style.visibility = "hidden"
    }
  }
  const handleClearAll = () => {
    setSelectedFilters({})
  }
  const countSelectedValues = (option) => {
    return selectedFilters[option] ? selectedFilters[option].length : 0
  }
  useEffect(() => {
    filterData()
  }, [selectedFilters, callingList])

  // useEffect(() => {
  //   const filtered = callingList.filter((item) => {
  //     const searchTermLower = searchTerm.toLowerCase()
  //     return (
  //       (item.date && item.date.toLowerCase().includes(searchTermLower)) ||
  //       (item.recruiterName && item.recruiterName.toLowerCase().includes(searchTermLower)) ||
  //       (item.candidateName && item.candidateName.toLowerCase().includes(searchTermLower)) ||
  //       (item.candidateEmail && item.candidateEmail.toLowerCase().includes(searchTermLower)) ||
  //       (item.contactNumber && item.contactNumber.toString().includes(searchTermLower)) ||
  //       (item.alternateNumber && item.alternateNumber.toString().includes(searchTermLower)) ||
  //       (item.sourceName && item.sourceName.toLowerCase().includes(searchTermLower)) ||
  //       (item.requirementId && item.requirementId.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.requirementCompany && item.requirementCompany.toLowerCase().includes(searchTermLower)) ||
  //       (item.communicationRating && item.communicationRating.toLowerCase().includes(searchTermLower)) ||
  //       (item.currentLocation && item.currentLocation.toLowerCase().includes(searchTermLower)) ||
  //       (item.personalFeedback && item.personalFeedback.toLowerCase().includes(searchTermLower)) ||
  //       (item.callingFeedback && item.callingFeedback.toLowerCase().includes(searchTermLower)) ||
  //       (item.jobDesignation && item.jobDesignation.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.requirementId && item.requirementId.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.fullAddress && item.fullAddress.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.experienceYear && item.experienceYear.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.experienceMonth && item.experienceMonth.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.relevantExperience && item.relevantExperience.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.currentCTCLakh && item.currentCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.currentCTCThousand && item.currentCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.expectedCTCLakh && item.expectedCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.expectedCTCThousand && item.expectedCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.yearOfPassing && item.yearOfPassing.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.extraCertification && item.extraCertification.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.holdingAnyOffer && item.holdingAnyOffer.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.offerLetterMsg && item.offerLetterMsg.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.noticePeriod && item.noticePeriod.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.msgForTeamLeader && item.msgForTeamLeader.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.availabilityForInterview &&
  //         item.availabilityForInterview.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.interviewTime && item.interviewTime.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.finalStatus && item.finalStatus.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.dateOfBirth && item.dateOfBirth.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.gender && item.gender.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.qualification && item.qualification.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.incentive && item.incentive.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.candidateId && item.candidateId.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.empId && item.empId.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.teamLeaderId && item.teamLeaderId.toString().toLowerCase().includes(searchTermLower)) ||
  //       (item.selectYesOrNo && item.selectYesOrNo.toLowerCase().includes(searchTermLower))
  //     )
  //   })
  //   setFilteredCallingList(filtered)
  //   setSearchCount(filtered.length)
  // }, [callingList])

  useEffect(() => {
    if (sortCriteria) {
      const sortedList = [...filteredCallingList].sort((a, b) => {
        const aValue = a[sortCriteria]
        const bValue = b[sortCriteria]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        } else {
          return 0
        }
      })
      setFilteredCallingList(sortedList)
    }
  }, [sortCriteria, sortOrder])

  const handleSearchClick = (e)=>{
    e.preventDefault();
    setCurrentPage(1) // Reset to the first page when searching
    fetchCallingList(1, pageSize)
  }
  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev) // Toggle state to trigger the effect
  }
  const filterData = () => {
    let filteredData = [...callingList]
    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        if (option === "candidateId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value)),
          )
        } else if (option === "requirementId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value)),
          )
        } else if (option === "employeeId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value)),
          )
        } else if (option === "contactNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value)),
          )
        } else if (option === "alternateNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value)),
          )
        } else if (option === "currentCtcLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "currentCtcThousand") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "empId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "expectedCtcLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "expectedCtcThousand") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "experienceMonth") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "experienceYear") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "oldEmployeeId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else if (option === "incentive") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = Number.parseInt(value, 10) // Convert value to integer
              return item[option] !== undefined && item[option] === numericValue // Compare as numbers
            }),
          )
        } else {
          filteredData = filteredData.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value.toLowerCase())),
          )
        }
      }
    })
    setFilteredCallingList(filteredData)
  }

  const handleFilterSelect = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortCriteria(criteria)
      setSortOrder("asc")
    }
  }

  const toggleFilterSection = () => {
    setShowSearchBar(false)
    setShowFilterSection(!showFilterSection)
  }

  const handleSelectRow = (can) => {
    const candidateId = can.candidateId
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(candidateId)) {
        return prevSelectedRows.filter((id) => id !== candidateId)
      } else {
        return [...prevSelectedRows, candidateId]
      }
    })
  }

  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        const fileType = fileName.split(".").pop().toLowerCase()
        if (fileType === "pdf") {
          const binary = atob(byteCode)
          const array = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i)
          }
          const blob = new Blob([array], { type: "application/pdf" })
          return URL.createObjectURL(blob)
        }
        if (fileType === "docx") {
          const binary = atob(byteCode)
          const array = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i)
          }
          const blob = new Blob([array], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
          return URL.createObjectURL(blob)
        }
        console.error(`Unsupported document type: ${fileType}`)
        return "Unsupported Document"
      } catch (error) {
        console.error("Error converting byte code to document:", error)
        return "Invalid Document"
      }
    }
    return "Document Not Found"
  }

  const [showResumeModal, setShowResumeModal] = useState(false)
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("")

  const updateProfileStatus = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status!")
      return
    }

    try {
      // Adjust the API endpoint to include `profileStatus` as a path variable
      const response = await fetch(
        `${API_BASE_URL}/update-profile-status/${selectedCandidate.candidateId}/${selectedStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.ok) {
        toast.success("Profile status updated successfully!")
        setShowUpdateModal(false)
        setSelectedStatus("")

        // Update the local filteredCallingList to reflect the new status
        const updatedList = filteredCallingList.map((candidate) =>
          candidate.candidateId === selectedCandidate.candidateId
            ? { ...candidate, profileStatus: selectedStatus }
            : candidate,
        )

        setFilteredCallingList(updatedList)
        setSelectedCandidate(null)
      } else if (response.status === 404) {
        const errorMessage = await response.text()
        toast.error(errorMessage || "Candidate not found.")
      } else {
        const errorMessage = await response.text()
        toast.error(errorMessage || "Failed to update profile status.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    }
  }

  const handleUpdate = (item) => {
    setSelectedCandidate(item)
    setShowUpdateModal(true)
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value)
  }

  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode)
    setShowResumeModal(true)
  }

  const closeResumeModal = () => {
    setSelectedCandidateResume("")
    setShowResumeModal(false)
    setShowUpdateModal(false)
    setSelectedCandidate(null)
    setSelectedStatus("")
  }

  const handleShow = () => {
    if (selectedRows.length > 0) {
      setShowModal(true)
    } else {
      toast.error("Select At Least 1 Candidate")
    }
  }
  const handleClose = () => setShowModal(false)

  const handleSuccessEmailSend = (res) => {
    if (res) {
      setSelectedRows([])
      setShowShareButton(true)
      fetchCallingList(currentPage, pageSize) // Refresh the calling list after sending emails
    }
  }

  const calculateWidth = () => {
    const baseWidth = 250
    const increment = 10
    const maxWidth = 600
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth)
  }

  // added by sahil karnekar date 4-12-2024
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSizeChange = (current, size) => {
    setPageSize(size) // Update the page size
    setCurrentPage(1) // Reset to the first page after page size changes
  }

  const calculateRowIndex = (index) => {
    return (currentPage - 1) * pageSize + index + 1
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => !filteredCallingList.map((item) => item.candidateId).includes(id)),
      )
    } else {
      const allRowIds = filteredCallingList.map((item) => item.candidateId)
      setSelectedRows((prevSelectedRows) => [...new Set([...prevSelectedRows, ...allRowIds])])
    }
    setAllSelected(!allSelected)
  }

  const areAllRowsSelectedOnPage = filteredCallingList.every((item) => selectedRows.includes(item.candidateId))

  useEffect(() => {
    setAllSelected(areAllRowsSelectedOnPage)
  }, [filteredCallingList, selectedRows])
  const [newAllJobIdsForPermission, setNewAllJobIdsForPermission] = useState([])
  const [showSelectPermissionRecruiters, setShowSelectPermissionRecruiters] = useState(false)
  const getAllJobs = async () => {
    const responseGetAllJobs = await axios.get(`${API_BASE_URL}/fetch-all-job-descriptions/${employeeId}/${userType}`)

    if(responseGetAllJobs.data.length > 0){
      const sortedJobs = responseGetAllJobs.data.sort((a, b) => b.requirementId - a.requirementId) // descending order

      setNewAllJobIdsForPermission(sortedJobs)
    }else{
      toast.info("No jobs available for permission assignment.");
    }
  
  }
  useEffect(() => {
    if (userType === "Manager") {
      getAllJobs()
    }
  }, [])
  const [selectedRowsPermissionIds, setSelectedRowsPermissionIds] = useState([])
  // const handleSelectAllJobIds = (e) => {
  //   if (e.target.checked) {
  //     const allIds = newAllJobIdsForPermission.map((item) => item.requirementId)
  //     setSelectedRowsPermissionIds(allIds)
  //   } else {
  //     setSelectedRowsPermissionIds([])
  //   }
  // }
  const handleSelectAllJobIds = (e) => {
    if (e.target.checked) {
      const allEnabledIds = newAllJobIdsForPermission
        .filter((item) => !alreadyAssignedJids.some(obj => obj.jobId === item.requirementId))
        .map((item) => item.requirementId);
      setSelectedRowsPermissionIds(allEnabledIds);
    } else {
      setSelectedRowsPermissionIds([]);
    }
  };
  
  

  const handleCheckboxChange = (role, id, completeValueObject) => {
    const isSelected = selectedCheckboxes.some((item) => item.id === id && item.role === role)

    if (isSelected) {
      setSelectedCheckboxes(selectedCheckboxes.filter((item) => !(item.id === id && item.role === role)))
    } else {
      setSelectedCheckboxes([
        ...selectedCheckboxes,
        {
          id,
          role,
          name:
            completeValueObject.managerName || completeValueObject.teamLeaderName || completeValueObject.employeeName,
          jobRole: completeValueObject.jobRole,
        },
      ])
    }

    let updatedIds
    if (selectedRole && selectedRole !== role) {
      setSelectedRole(role)
      updatedIds = [id]
    } else {
      updatedIds = selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
      setSelectedRole(role)
    }

    if (role === "Manager") {
      const manager = completeValueObject
      setSelectedManagers((prev) =>
        prev.some((item) => item.managerId === manager.managerId)
          ? prev.filter((item) => item.managerId !== manager.managerId)
          : [
              ...prev,
              {
                managerId: manager.managerId,
                managerJobRole: manager.jobRole,
              },
            ],
      )
    } else if (role === "TeamLeader") {
      const teamLeader = completeValueObject
      setSelectedTeamLeaders((prev) =>
        prev.some((item) => item.teamLeaderId === teamLeader.teamLeaderId)
          ? prev.filter((item) => item.teamLeaderId !== teamLeader.teamLeaderId)
          : [
              ...prev,
              {
                teamLeaderId: teamLeader.teamLeaderId,
                teamLeaderJobRole: teamLeader.jobRole,
              },
            ],
      )
    } else if (role === "Recruiters") {
      const recruiter = completeValueObject
      setSelectedRecruiters((prev) =>
        prev.some((item) => item.recruiterId === recruiter.employeeId)
          ? prev.filter((item) => item.recruiterId !== recruiter.employeeId)
          : [
              ...prev,
              {
                recruiterId: recruiter.employeeId,
                recruiterJobRole: recruiter.jobRole,
              },
            ],
      )
    }
  }
  // Rajlaxmi Jagadale Added that code date 14/04/2025 
  const handleRecruiterCheckboxChange = (recruiter) => {
    setSelectedRecruiters((prev) =>
      prev.some((item) => item.recruiterId === recruiter.employeeId)
        ? prev.filter((item) => item.recruiterId !== recruiter.employeeId)
        : [
            ...prev,
            {
              recruiterId: recruiter.employeeId,
              recruiterJobRole: recruiter.jobRole,
            },
          ],
    )
  }
// Rajlaxmi JAgadale adeed taht code Date 14/04/2025
  const handleClearSelection = (userType) => {
    if (userType) {
      setSelectedRole("")
      setSelectedIds([])
      // Clear the team leader name when clearing selection
      setSelectedTeamLeaderName("")

      // Reset counts based on user type
      if (userType === "Managers") {
        setEmployeeCount((prev) => ({
          ...prev,
          teamLeaderCount: 0,
          employeeCount: 0,
        }))
      } else if (userType === "Team Leaders") {
        setEmployeeCount((prev) => ({
          ...prev,
          employeeCount: 0,
        }))
      }
    }
  }
  const handleCheckboxChangeSelectRow = (id) => {
    setSelectedRowsPermissionIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id)
      } else {
        return [...prevSelected, id]
      }
    })
  }

  // Fixed function to toggle team leader display
  const toggleTeamLeader = (teamLeaderId) => {
    setActiveTeamLeader(activeTeamLeader === teamLeaderId ? null : teamLeaderId)

    // If we're opening this team leader, fetch their recruiters
    if (activeTeamLeader !== teamLeaderId) {
      handleOpenDownArrowContentForRecruiters(teamLeaderId)
    } else {
      // If we're closing this team leader, hide the recruiters
      setDisplayRecruiters(false)
    }
  }
  const [displayBigSkeletonForManagers, setDisplayBigSkeletonForManagers] = useState(false)
  const [managersList, setManagersList] = useState([])
// Rajlaxmi Jagadale Added taht code date 14/04/2025
  const handleDisplayManagers = async () => {
    setDisplayModalContainer(true)
    if (userType === "SuperUser") {
      setDisplayBigSkeletonForManagers(true)
      const response = await axios.get(`${API_BASE_URL}/get-all-managers`)
      setManagersList(response.data)
      setDisplayBigSkeletonForManagers(false)
      setDisplayManagers(true)
    } else if (userType === "Manager") {
      setDisplayBigSkeletonForTeamLeaders(true)
      const response = await axios.get(`${API_BASE_URL}/tl-namesIds/${employeeId}`)
      setTeamLeadersList(response.data)
      setDisplayBigSkeletonForTeamLeaders(false)
      setDisplayTeamLeaders(true)
    } else if (userType === "TeamLeader") {
      setDisplayBigSkeletonForRecruiters(true)
      const response = await axios.get(`${API_BASE_URL}/employeeId-names/${employeeId}`)
      setRecruitersList(response.data)
      setDisplayBigSkeletonForRecruiters(false)
      setDisplayRecruiters(true)
    }
  }
  // Modify the getUserImageFromApiForReport function if it doesn't exist
  const getUserImageFromApiForReport = async (id, role) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-user-image/${id}/${role}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching image for user ${id}:`, error)
      return null
    }
  }
  useEffect(() => {
    setEmployeeCount({
      teamLeaderCount: 0,
      employeeCount: 0,
    })
  }, [])
  const handleDeletePermission = async(permissionId)=>{
    setLoading(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-permission/${permissionId}`);
getAllAssignedIds();
toast.success(response.data);
    } catch (error) {
      toast.error(error);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="SCE-list-container">
      {loading ? (
        <div className="register"><Loader></Loader></div>
      ) : (
        <>
          <div className="search">
            <div style={{ display: "flex" }}>
              <i className="fa-solid fa-magnifying-glass" style={{ alignContent: "center", marginRight: "10px" }}></i>
              <form onSubmit={(e) => handleSearchClick(e)}> 
                <div className="search-input-div" style={{ width: `${calculateWidth()}px` }}>
                  <div className="forxmarkdiv">
                    <input
                      type="text"
                      className="search-input removeBorderForSearchInput"
                      placeholder="Search here..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <div className="svgimagesetinInput">
                        <svg
                          onClick={() => {
                            setSearchTerm("")
                            handleTriggerFetch()
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000000"
                        >
                          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="search-btns lineUp-share-btn newSearchButtonMarginLeft"
                   type="submit"
                >
                  Search
                </button>
              </form>
            </div>
            <h5 className="newclassnameforpageheader">Candidate Data</h5>

            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              {userType === "Manager" && (
  <button
  className="SCE-share-btn"
  onClick={() => {
    getAllAssignedIds();
    setShowPermissionModal(true)
    handleDisplayManagers() // Fetch team leaders when opening the modal
  }}
>
  Permission Recruiter
</button>
              )}
            
              {showShareButton ? (
                <button className="SCE-share-btn" onClick={() => setShowShareButton(false)}>
                  Share
                </button>
              ) : (
                <div style={{ display: "flex", gap: "5px" }}>
                  {!showShareButton && (
                    <Badge
                      color="var(--notification-badge-background)"
                      count={selectedRows.length}
                      className="newBadgeselectedcandidatestyle"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M222-200 80-342l56-56 85 85 170-170 56 57-225 226Zm0-320L80-662l56-56 85 85 170-170 56 57-225 226Zm298 240v-80h360v80H520Zm0-320v-80h360v80H520Z" />
                      </svg>
                    </Badge>
                  )}
                  <button
                    className="SCE-share-close-btn"
                    onClick={() => {
                      setShowShareButton(true)
                      setSelectedRows([])
                    }}
                  >
                    Close
                  </button>
                  <button className="SCE-forward-btn" onClick={handleShow}>
                    Send
                  </button>
                </div>
              )}
              <button className="SCE-Filter-btn" onClick={toggleFilterSection}>
                Filter <i className="fa-solid fa-filter"></i>
              </button>
            </div>
          </div>
          <div className="filter-dropdowns">
            {/* {showFilterSection && (
              <div className="filter-section">
                {limitedOptions.map(([optionKey, optionLabel]) => {
                  const uniqueValues = Array.from(
                    new Set(callingList.map((item) => item[optionKey]))
                  );

                  return (
                    <div key={optionKey} className="filter-option">
                      <button
                        className="white-Btn"
                        onClick={() => handleFilterOptionClick(optionKey)}
                      >
                        {optionLabel}
                        <span className="filter-icon">&#x25bc;</span>
                      </button>
                      {activeFilterOption === optionKey && (
                        <div className="city-filter">
                          <div className="optionDiv">
                            {uniqueValues.map((value) => (
                              <label
                                key={value}
                                className="selfcalling-filter-value"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedFilters[optionKey]?.includes(
                                      value
                                    ) || false
                                  }
                                  onChange={() =>
                                    handleFilterSelect(optionKey, value)
                                  }
                                />
                                {value}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )} */}

            {showFilterSection && (
              <div className="filter-section">
                {limitedOptions.map(([optionKey, optionLabel]) => {
                  const uniqueValues = Array.from(
                    new Set(
                      callingList
                        .map((item) => item[optionKey]?.toString().toLowerCase())
                        .filter(
                          (value) => value && value !== "-" && !(optionKey === "alternateNumber" && value === "0"),
                        ),
                    ),
                  )

                  return (
                    <div key={optionKey}>

                      {/* Rajlaxmi jagadle  Added countSelectedValues that code date 20-02-2025 line 987/1003 */}
                      <div className="filter-option">
                        <button
                          className={`white-Btn ${
                            (selectedFilters[optionKey] && selectedFilters[optionKey].length > 0) ||
                            activeFilterOption === optionKey
                              ? "selected glow"
                              : ""
                          }`}
                          onClick={() => handleFilterOptionClick(optionKey)}
                        >
                          {optionLabel}
                          {selectedFilters[optionKey]?.length > 0 && (
                            <span className="selected-count">({countSelectedValues(optionKey)})</span>
                          )}
                          <span className="filter-icon">&#x25bc;</span>
                        </button>
                        {/* rajlaxmi Jagadle Changes That code date 20-02-2025 line 1003/1027 */}

                        {activeFilterOption === optionKey && (
                          <div ref={filterRef} className="city-filter">
                            <div className="optionDiv">
                              {uniqueValues.length > 0 ? (
                                uniqueValues.map((value) => (
                                  <label key={value} className="selfcalling-filter-value">
                                    <input
                                      type="checkbox"
                                      checked={selectedFilters[optionKey]?.includes(value) || false}
                                      onChange={() => handleFilterSelect(optionKey, value)}
                                      style={{ marginRight: "5px" }}
                                    />
                                    {value}
                                  </label>
                                ))
                              ) : (
                                <div>No values</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                <button className="clr-button lineUp-Filter-btn" onClick={handleClearAll}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div className="attendanceTableData" onScroll={handleScroll} ref={tableContainerRef}>
            <table className="attendance-table">
              <thead>
                <tr className="attendancerows-head">
                  {!showShareButton ? (
                    <th className="attendanceheading" style={{ position: "sticky", left: 0, zIndex: 10 }}>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={filteredCallingList.every((row) => selectedRows.includes(row.candidateId))}
                        name="selectAll"
                      />
                    </th>
                  ) : null}
                  <th
                    className="attendanceheading"
                    style={{ position: "sticky", left: showShareButton ? 0 : "25px", zIndex: 10 }}
                  >
                    Sr No.
                  </th>
                  <th className="attendanceheading" onClick={() => handleSort("date")}>
                    Added Date Time
                  </th>
                  {/* <th className="attendanceheading">Time</th> */}
                  <th
                    className="attendanceheading"
                    style={{ position: "sticky", left: showShareButton ? "50px" : "75px", zIndex: 10 }}
                  >
                    Candidate Id
                  </th>
                  <th className="attendanceheading" onClick={() => handleSort("recruiterName")}>
                    Recruiter's Name
                  </th>
                  <th className="attendanceheading">Candidate's Name</th>
                  <th className="attendanceheading">Candidate's Email</th>
                  <th className="attendanceheading">Contact Number</th>
                  <th className="attendanceheading">Whatsapp Number</th>
                  <th className="attendanceheading">Source Name</th>
                  <th className="attendanceheading">job Designation</th>
                  <th className="attendanceheading" onClick={() => handleSort("requirementId")}>
                    Job Id
                  </th>
                  <th className="attendanceheading">Applying Company</th>
                  <th className="attendanceheading">Communication Rating</th>
                  <th className="attendanceheading">Current Location</th>
                  <th className="attendanceheading">Full Address</th>
                  <th className="attendanceheading">Calling Feedback</th>
                  <th className="attendanceheading">Recruiter's Incentive</th>
                  <th className="attendanceheading">Interested or Not</th>
                  <th className="attendanceheading">Current Company</th>
                  <th className="attendanceheading">Total Experience</th>
                  <th className="attendanceheading">Relevant Experience</th>
                  <th className="attendanceheading">Current CTC</th>
                  <th className="attendanceheading">Expected CTC</th>
                  <th className="attendanceheading">Date Of Birth</th>
                  <th className="attendanceheading">Gender</th>
                  <th className="attendanceheading">Education</th>
                  <th className="attendanceheading">Year Of Passing</th>
                  <th className="attendanceheading">Call Summary</th>
                  {/* <th className="attendanceheading">Feedback</th> */}
                  <th className="attendanceheading">Holding Any Offer</th>
                  <th className="attendanceheading">Offer Letter Msg</th>
                  <th className="attendanceheading">Resume</th>
                  <th className="attendanceheading">Notice Period</th>
                  <th className="attendanceheading">Message For Team Leader</th>
                  <th className="attendanceheading">Availability For Interview</th>
                  <th className="attendanceheading">Interview Time</th>

                  <th className="attendanceheading">Availabile Status</th>
                  <th className="attendanceheading" style={{ paddingLeft: "22px", paddingRight: "22px" }}>
                    Profile Status
                  </th>
                  <th className="attendanceheading">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCallingList.map((item, index) => (
                  <tr key={item.candidateId} className="attendancerows">
                    {!showShareButton ? (
                      <td
                        className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                        style={{ position: "sticky", left: 0, zIndex: 1 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.candidateId)}
                          onChange={() => handleSelectRow(item)}
                        />
                      </td>
                    ) : null}

                    <td
                      className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                      style={{ position: "sticky", left: showShareButton ? 0 : "25px", zIndex: 1 }}
                    >
                      {calculateRowIndex(index)}
                      <div className="tooltip">
                        <span className="tooltiptext">{calculateRowIndex(index)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.date || "", searchTerm)} - {item.candidateAddedTime || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {highlightText(item.date.toString().toLowerCase() || "", searchTerm)} -{" "}
                          {item.candidateAddedTime}
                        </span>
                      </div>
                    </td>

                    <td
                      className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                      style={{ position: "sticky", left: showShareButton ? "50px" : "75px", zIndex: 1 }}
                    >
                      {highlightText(item.candidateId.toString().toLowerCase() || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {highlightText(item.candidateId.toString().toLowerCase() || "", searchTerm)}
                        </span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.recruiterName || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.recruiterName || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.candidateName || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.candidateName || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.candidateEmail || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.candidateEmail || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.contactNumber || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.contactNumber || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.alternateNumber || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.alternateNumber || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.sourceName || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.sourceName || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.jobDesignation || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.jobDesignation || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.requirementId || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.requirementId || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.requirementCompany || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.requirementCompany || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.communicationRating || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.communicationRating || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.currentLocation || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.currentLocation || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.fullAddress || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.fullAddress || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.callingFeedback || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.callingFeedback || "", searchTerm)}</span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.incentive.toString().toLowerCase() || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {highlightText(item.incentive.toString().toLowerCase() || "", searchTerm)}
                        </span>
                      </div>
                    </td>

                    <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {highlightText(item.selectYesOrNo || "", searchTerm)}
                      <div className="tooltip">
                        <span className="tooltiptext">{highlightText(item.selectYesOrNo || "", searchTerm)}</span>
                      </div>
                    </td>

                    <>
                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.companyName || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.companyName || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {item.experienceYear || "0"} Years {item.experienceMonth} Months
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.experienceYear || "0"} Years {item.experienceMonth} Months
                          </span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.relevantExperience || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(item.relevantExperience || "", searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {`${item.currentCTCLakh || 0} Lakh ${item.currentCTCThousand || 0} Thousand`}
                        <div className="tooltip">
                          <span className="tooltiptext">{`${item.expectedCTCLakh || 0} Lakh ${
                            item.expectedCTCThousand || 0
                          } Thousand`}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {`${item.expectedCTCLakh || 0} Lakh ${item.expectedCTCThousand || 0} Thousand`}
                        <div className="tooltip">
                          <span className="tooltiptext">{`${item.expectedCTCLakh || 0} Lakh ${
                            item.expectedCTCThousand || 0
                          } Thousand`}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.dateOfBirth || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.dateOfBirth || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.gender || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.gender || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.qualification || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.qualification || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.yearOfPassing || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.yearOfPassing || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.extraCertification || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(item.extraCertification || "", searchTerm)}
                          </span>
                        </div>
                      </td>

                      {/* <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {item.lineUp.feedBack || "-"}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {item.lineUp.feedBack}
                                </span>
                              </div>
                            </td> */}

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.holdingAnyOffer || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.holdingAnyOffer || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.offerLetterMsg || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.offerLetterMsg || "", searchTerm)}</span>
                        </div>
                      </td>
                      {/* Name:-Akash Pawar Component:-LineUpList
                  Subcategory:-ResumeViewButton(added) start LineNo:-993
                  Date:-02/07 */}
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
                      {/* Name:-Akash Pawar Component:-LineUpList
                  Subcategory:-ResumeViewButton(added) End LineNo:-1005
                  Date:-02/07 */}

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {item.noticePeriod || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">{item.noticePeriod}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.msgForTeamLeader || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.msgForTeamLeader || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.availabilityForInterview || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(item.availabilityForInterview || "", searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.interviewTime || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.interviewTime || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        {highlightText(item.finalStatus || "", searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">{highlightText(item.finalStatus || "", searchTerm)}</span>
                        </div>
                      </td>

                      <td className="tabledata" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        <button
                          className={`profile-btn ${
                            item.profileStatus === "Profile Pending"
                              ? "pending"
                              : item.profileStatus === "Profile Sent"
                                ? "sent"
                                : item.profileStatus === "Profile Rejected"
                                  ? "rejected"
                                  : item.profileStatus === "Profile Shortlisted"
                                    ? "selected"
                                    : item.profileStatus === "No Response"
                                      ? "no-response"
                                      : item.profileStatus === "Profile On Hold"
                                        ? "on-hold"
                                        : ""
                          }`}
                        >
                          {item.profileStatus}
                        </button>
                      </td>

                      <td className="tabledata">
                        <i onClick={() => handleUpdate(item)} className="fa-regular fa-pen-to-square"></i>
                      </td>
                    </>
                  </tr>
                ))}
              </tbody>
            </table>
            {showModal ? (
              <SendEmailPopup
                show={showModal}
                handleClose={handleClose}
                selectedCandidateIds={selectedRows}
                onSuccessFullEmailSend={handleSuccessEmailSend}
                clientEmailSender={clientEmailSender}
                fetchCallingList={fetchCallingList}
              />
            ) : null}
            {/* Name:-Akash Pawar Component:-LineUpList
          Subcategory:-ResumeModel(added) End LineNo:-1153 Date:-02/07 */}
            <Modal show={showResumeModal} onHide={closeResumeModal} size="md">
              <Modal.Header closeButton>
                <Modal.Title>Resume</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedCandidateResume ? (
                  <iframe
                    src={convertToDocumentLink(selectedCandidateResume, "Resume.pdf")}
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
            {/* Name:-Akash Pawar Component:-LineUpList
          Subcategory:-ResumeModel(added) End LineNo:-1184 Date:-02/07 */}

            <Modal show={showUpdateModal} onHide={closeResumeModal} dialogClassName="centered-modal" centered>
              <Modal.Header closeButton>
                <Modal.Title>Update Profile Status</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedCandidate && (
                  <>
                    <div>
                      <p>
                        <strong>Candidate Name : </strong> {selectedCandidate.candidateName}
                      </p>
                      <p>
                        <strong>Company Name : </strong> {selectedCandidate.requirementCompany}
                      </p>
                      <p>
                        <strong>Job Designation :</strong> {selectedCandidate.jobDesignation}
                      </p>
                      <p>
                        <strong>Profile Status :</strong>{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              selectedCandidate.profileStatus === "Profile Pending"
                                ? "#A9A9A9" // Gray
                                : selectedCandidate.profileStatus === "Profile Sent"
                                  ? "#4682B4" // Blue
                                  : selectedCandidate.profileStatus === "Profile Rejected"
                                    ? "#FF6347" // Red
                                    : selectedCandidate.profileStatus === "Profile Shortlisted"
                                      ? "#32CD32" // Green
                                      : selectedCandidate.profileStatus === "No Response"
                                        ? "#FFA500" // Orange
                                        : selectedCandidate.profileStatus === "Profile On Hold"
                                          ? "#FFD700" // Yellow
                                          : "black", // Default color if none match
                          }}
                        >
                          {selectedCandidate.profileStatus}
                        </span>
                      </p>
                    </div>
                    <hr style={{ marginTop: "10px" }} />
                    <div className="update-profile-modal">
                      <label htmlFor="">Select Status</label>
                      <select value={selectedStatus} onChange={handleStatusChange} className="update-profile-drop-down">
                        <option value="">Select Status</option>
                        {[
                          "Profile Pending",
                          "Profile Sent",
                          "Profile Rejected",
                          "Profile Shortlisted",
                          "No Response",
                          "Profile On Hold",
                        ]
                          .filter((status) => status !== selectedCandidate.profileStatus)
                          .map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                )}
                <center>
                  <button className="daily-tr-btn" onClick={updateProfileStatus}>
                    Update
                  </button>
                </center>
              </Modal.Body>
            </Modal>
          </div>

{
  userType !== "Recruiters" && (
    <>
       <div className="search-count-last-div">Search Results : {totalRecords}</div>

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
    </>
  )
}
       
          <AntdModal
          width={1000}
            title="Send Clients Permission To Recruiter"
            open={showPermissionModal}
            okText="Give Permission !"
            onOk={() => {
              if (selectedRowsPermissionIds.length === 0) {
                toast.error("Please select at least one job id.")
                return
              }
              setShowSelectPermissionRecruiters(true)
              setShowPermissionModal(false)
            }}
            onCancel={() => {
              setSelectedRowsPermissionIds([])
              setShowPermissionModal(false)}}
           
          >
            <div
              className="attendanceTableData"
              style={{
                height: "50vh",
              }}
            >
              <table className="attendance-table">
                <thead>
                  <tr className="attendancerows-head">
                    <th className="attendanceheading" style={{ position: "sticky", left: 0, zIndex: 10 }}>
                      {/* updatesd shortListeddata by Pranjali Raut data 20-01-2025 */}
                      {/* <input
                        type="checkbox"
                        onChange={handleSelectAllJobIds}
                        checked={newAllJobIdsForPermission.every((row) =>
                          selectedRowsPermissionIds.includes(row.requirementId),
                        )}
                        name="selectAll"
                      /> */}
                      <input
  type="checkbox"
  onChange={handleSelectAllJobIds}
  checked={
    newAllJobIdsForPermission
      .filter((item) => !alreadyAssignedJids.some(obj => obj.jobId === item.requirementId))
      .every((row) => selectedRowsPermissionIds.includes(row.requirementId))
  }  
  name="selectAll"
/>

                    </th>
                    <th className="attendanceheading">Job Id</th>
                    <th className="attendanceheading">Company Name</th>
                    <th className="attendanceheading">Job Designation</th>
                    <th className="attendanceheading">Recruiter Name</th>
                    <th className="attendanceheading">Delete Permission</th>
                  </tr>
                </thead>
                <tbody>
                  {newAllJobIdsForPermission.map((item, index) => (
                    <tr key={index} className="attendancerows">
                      <td className="tabledata">
                        <input
                          type="checkbox"
                          checked={selectedRowsPermissionIds.includes(item.requirementId)}
                          onChange={() => handleCheckboxChangeSelectRow(item.requirementId)}
                          disabled={alreadyAssignedJids.some(obj => obj.jobId === item.requirementId)}

                        />
                      </td>
                      <td className="tabledata">{item.requirementId}</td>
                      <td className="tabledata">{item.companyName}</td>
                      <td className="tabledata">{item.designation}</td>
                      <td className="tabledata">{(() => {
  const matched = alreadyAssignedJids.find(obj => obj.jobId === item.requirementId);
  return matched && (
      <span>{matched.employeeName}</span>
  );
})()}

</td>
                      <td className="tabledata">{(() => {
  const matched = alreadyAssignedJids.find(obj => obj.jobId === item.requirementId);
  return matched ? (

        <Popconfirm
          placement="bottomRight"
          title="Delete Permission !"
          description="Are you sure to delete this permission?"
          okText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            handleDeletePermission(matched.id)
          }}
        >
        < DeleteOutlined />
        </Popconfirm>
  ) : null;
})()}

</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AntdModal>
                    {/* Rajlaxmi JAgadale added taht modal code date 14/04/2025 */}
          <AntdModal
            title="Select Recruiter"
            open={showSelectPermissionRecruiters}
            onOk={handleOkey}
            onCancel={() => {
              setSelectedRowsPermissionIds([])
              setShowSelectPermissionRecruiters(false)}}
            width={800}
          >
            <div className="mainForListsteamperformance">
              <Card
              id="classforamit"
                hoverable
                style={{
                  width: 300,
                  marginRight: 10,
                  height: "65vh",
                  overflowY: "scroll",
                }}
                title="Team Leaders"
              >
                {teamLeadersList.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={teamLeadersList}
                    renderItem={(teamLeader, index) => (
                      <List.Item key={teamLeader.teamLeaderId}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={allImagesForTeamLeaders[index] || getFallbackImageUrl(index)}
                              onError={() => handleImageError(teamLeader.teamLeaderId, "TeamLeader")}
                            />
                          }
                          title={teamLeader.teamLeaderName}
                        />
                        <svg
                          onClick={() => handleOpenDownArrowContentForRecruiters(teamLeader.teamLeaderId)}
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000000"
                          className={activeTeamLeader === teamLeader.teamLeaderId ? "rotate-iconteamperformance classnameforameettesting" : "classnameforameettesting"}
                        >
                          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                        </svg>
                      </List.Item>
                    )}
                  />
                ) : displayBigSkeletonForTeamLeaders ? (
                  <Skeleton active />
                ) : (
                  <div style={{ textAlign: "center", padding: "20px" }}>No team leaders found. Please try again.</div>
                )}
              </Card>

              {displayRecruiters && (
                <Card
                id="classforamit"
                  hoverable
                  style={{
                    width: 300,
                    height: "65vh",
                    overflowY: "scroll",
                  }}
                  title="Recruiters"
                >
                  {recruitersList.length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={recruitersList}
                      renderItem={(recruiter, index) => (
                        <List.Item key={recruiter.employeeId}>
                          <input
                            type="checkbox"
                            checked={selectedRecruiters.some((item) => item.recruiterId === recruiter.employeeId)}
                            onChange={() => handleRecruiterCheckboxChange(recruiter)}
                            className="managersTeamRecruitersInputMarginteamperformance"
                          />
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                src={allImagesForRecruiters[index] || getFallbackImageUrl(index)}
                                onError={() => handleImageError(recruiter.employeeId, "Recruiters")}
                              />
                            }
                            title={recruiter.employeeName}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      No recruiters found for this team leader.
                    </div>
                  )}
                </Card>
              )}

              {displayBigSkeletonForRecruiters && (
                <Skeleton.Node
                  active={true}
                  style={{
                    width: 300,
                    height: "65vh",
                  }}
                />
              )}
            </div>
          </AntdModal>
        </>
      )}
    </div>
  )
}

const SendEmailPopup = ({
  show,
  handleClose,
  selectedCandidateIds,
  onSuccessFullEmailSend,
  clientEmailSender,
  fetchCallingList,
  
}) => {

//line number 2096 to 2167 added by Shweta Jagdale
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");  
const [toError, setToError] = useState("");
const [ccError, setCcError] = useState("");
 const [bccError, setBccError] = useState("");
 const [subject, setSubject] = useState("");
const [subjectError, setSubjectError] = useState("");

const handleChange = (e) => {
  const { name, value } = e.target;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    e.preventDefault();

    if (name === "email") {
      setTo(value);

      if (!value.trim()) {
        setToError("Email is required");
      } else if (!emailPattern.test(value.trim())) {
        setToError("Invalid email format");
      } else {
        setToError("");
      }
    }

    if (name === "cc") {
      setCc(value);

      const emails = value.split(",").map((email) => email.trim());
      const invalidEmails = emails.filter(
        (email) => email && !emailPattern.test(email)
      );

      if (value.trim() === "") {
        setCcError("");
      } else if (invalidEmails.length > 0) {
        setCcError("Invalid emails: " + invalidEmails.join(", "));
      } else {
        setCcError("");
      }
    }
    if (name === "bcc") {
      setBcc(value);

      const emails = value.split(",").map((email) => email.trim());
      const invalidEmails = emails.filter((email) => email && !emailPattern.test(email));

      if (value.trim() === "") {
        setBccError("");
      } else if (invalidEmails.length > 0) {
        setBccError("Invalid emails: " + invalidEmails.join(", "));
      } else {
        setBccError("");
      }
    }
    if (name === "subject") {
    setSubject(value);
    if (!value.trim()) {
      setSubjectError("Subject is required");
    } else if (value.length > 100) {
      setSubjectError("Subject cannot exceed 100 characters");
    } else {
      setSubjectError("");
    }
  }
};

  const [emailFooter, setEmailFooter] = useState("Best Regards,\n157 Careers.");
  // const [subject, setSubject] = useState("");

  const {employeeId, userType} = useParams();
  const [signatureImage, setSignatureImage] = useState(
    "https://lh3.googleusercontent.com/fife/ALs6j_HDFuzYstiAW8Rt_7NmtAoegg6nGerpkvbiAITq-mNL70gNXONQuJwnZdbiAbsKMNAYMt9iBnvsFWx8EaOOWV43cjOjDvFOAiw1XacANQb0MDBtFO1ag1TuVwCbwbzrLDnOiniRQ5hD7kGCCVjTNGsNdx6RQLsrKyZlpJ6meA1NIT1vXloRcFwlfbTjDBG14YC809U_0FGn9pOII8lbH-I_ZZLBI6kfh0Q43j4evix8AbIxnvw0Soesevgycz4jRqrAA4Fjjd67Pb0vIVBkeEgSp_Sfz_v9joDcBiMe2sLP6_iEvB7N4il1qgBgTHBRM6qp6IuNFov7hMdcyx8Jp1oCfQX7753pO2x3FGg3tyW5RI0l-1h01JWKdybFECo19c7o3Z_01lJ-dF1TABxyPTdT9eztvkSfDXOvfoQIP_oEny3ORR-8wfjijnlUFylwT7MhsCwTcaeQR6tWaPYJ9rX7AQVGOmMyJbLS_0tFLn0_UzX7NuQx6-W2TeC9aXM0ajJYJ5cLPusvMlAhgFBB0WdZfbtuOat0-rd2qP_L0MqJPfTYBdTgYyO4LoTD0dV6QRo5UJhvyDW5Ru8IBz-bB4QWhPMjs2_PFnQ9K-GLvAPCOYIk4TQPhkCK4UgOyGL8bRE4bPBIYMddVxfWdePCOb6V5JhGmYfvsYzEhAwquNmsZkMv9lEJfQV-Frs0DrF63XWlD5ieprbz4CLMs3WHh42I06Kpw2aCXfQchCDoJawTYljfozJ_QHq58UIAdMniaLvrKKYRyYfZohAFVdekMzArxrobd4e3Pac9cHm1Orz2_lAob5diRJCZxapdTOPfiT_ro-1qhbtmKua4kXr5Z_TWgBV9CwaactlqLFMnnbN3TtDOqKNDEFBGhg1pKC2NUu2Jw6IyawDyCU6VCdrnhizrHhvhPY8u0uXOxspsqfvQaU_PT0e0v-f2RPDESxSwIz3H6DEzmk5hOrbOmXFCPG8Q9bUu_5I3kL11z_loIveKwfWD3YGIkOjOvXAUomdEqw7DIXIbjcfDQflq7L45gJ3-BWuTkRmicaQL3GAtwVpYbmNUi649NpUC5JvKN_iqIxeNzhKdn1jBXEGl2-rbmzYXbPolNUmrQWwaFYKBzVzgWIcCjaaKpgSR444mFTx3mFEuSJxfjMTJtumbYGZkGrFkEE1rNaXMvF6XFT6JO63BtAfQzd5nFl31OctaJ6nf7_UbshOlPFeUNoRFpc-gB9LWyZck_V9jIToDHY8mij11-IK-9DFLdZZfNxeOhbha8DYljvTj9R6spXM006lRZmBsP6WugvIvvG5Pv_kiXoORCBbrCFAIk3vpZIEx3zDoayqgUNwctyrf7cJvfSiyWokjM0NNHRTCy0eldMfb0LLX5X6BftzMt128n5f6-Q60zmQ_kyuHSnyLGJawrCATfhHu-_ABtuuTWopOBib9gG__Vsa06z5SKZs5LM8eD8TwgUMeIRfWGfZBAy2qobuMt9ZVDrQDlPejp1tBg3Dm8Ke85TK7HFFfDqA-dJ2jCwzOq2ipybePn2kxLg911_lfaHPIXpF0LJdNwNyzfH_6IuB3IGI0nelUgtPnQbxXFMYd8xLaiVhfx9f0GLlDLkalvTQ8UPk92nprBDiYn8GdmV3zoVuWZbXwqQ4nmLaB9LIxDieP2kLO7V2igrEsBxXZHT309KauEgReDc1p7ahNkSiDjAOt3cDoEnlXhXjLXiBy"
  );
  const [isMailSending, setIsMailSending] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState([]);
  const [getResponse, setResponse] = useState("");
  const [emailBody, setEmailBody] = useState(
    // line no 21 added by Shweta Jagdale
    "--\n\nSend by 157 Careers Email"
  );
  const [difference, setDifference] = useState([]);

  const fetchCandidateData = async (selectedCandidateIds = []) => {
    const newIdsMultipleData = selectedCandidateIds?.join(",");
  
    try {
      const response = await axios.get(`${API_BASE_URL}/get-candidates-details?ids=${newIdsMultipleData}`);
      setSelectedCandidate(response.data);
    } catch (error) {
      console.log("Error fetching candidate data:", error);
    }
  };
  
  // Call API when component mounts
  useEffect(() => {
    fetchCandidateData(selectedCandidateIds);
  }, []);
  
  


  const handleStoreClientInformation = async () => {
    try {
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let currentDate = `${day}-${month}-${year}`;

      const clientData = {
        mailReceiverName: emailBody.replace(/Hi\s*,?\s*/i, "").split(",")[0],
        receiverCompanyMail: to,
        mailSendDate: currentDate,
        mailSendTime: new Date().toLocaleTimeString(),
        noOfCandidates: selectedCandidate.length,
        mailSenderName: clientEmailSender.senderName,
        senderEmailId: clientEmailSender.senderMail,
        requirementIds: selectedCandidate.map((item) => item.requirementId),
        toCCNames: cc.split(","),
        toBCCNames: bcc.split(","),
      };

      const response = await axios.post(
        `${API_BASE_URL}/add-client-details`,
        clientData
      );
      if (response) {
        setIsMailSending(false);
        setResponse(response.data);
        handleClose();
      }
    } catch (error) {
      setIsMailSending(false);
      setResponse(error.message);
    }
  };

  const [socket, setSocket] = useState(null);

  useEffect(()=>{
const newSocket = getSocket();
setSocket(newSocket);
  },[]);

  const handleSendEmail = () => {

    //addded by shweta jagdale line no 2258 to 2262

    if (!to || toError || subjectError || ccError || bccError) {
      return;
    }

    setIsMailSending(true);

    //addded by shweta jagdale line no 2266 to 2272
   const filteredAttachments = selectedCandidate
  .filter((can) => can.resume) // only include if resume exists
  .map((can) => ({
    fileName: `${can.candidateName}_${can.jobDesignation}.pdf`,
    fileContent: can.resume,
  }));


    const emailData = {
      to,
      cc,
      bcc,
      subject,
      footer: emailFooter,
      body: emailBody.replace(/\n/g, "<br>"),
      signatureImage,
      ...(filteredAttachments.length > 0 && {
        attachments: filteredAttachments,
      }),
      tableData: selectedCandidate.map((can) => ({
        date: new Date().toLocaleDateString(),
        jobDesignation: can.jobDesignation,
        candidateName: can.candidateName,
        contactNumber: can.contactNumber,
        candidateEmail: can.candidateEmail,
        experienceYear: can.experienceYear,
        experienceMonth: can.experienceMonth,
        companyName: can.companyName,
        noticePeriod: can.noticePeriod,
        holdingAnyOffer: can.holdingAnyOffer,
        currentLocation: can.currentLocation,
        perDayBillingSentToClient: "300",
      })),
      candidateIds: selectedCandidate.map((can) => can.candidateId),
    };    
    
    axios
      .post(`${API_BASE_URL}/send-email/${employeeId}/${userType}`, emailData)
      .then((response) => {
        handleStoreClientInformation();
        onSuccessFullEmailSend(true);
        const message = response.data;
        if (message.includes("Already Shared")) {
          toast.info(message); // For cases where some profiles are already shared
          socket.emit("share_profile", emailData);
        } else {
          toast.success(message); // For cases where profiles are shared successfully
          
        }

        selectedCandidate.forEach(async (can) => {
          try {
            const performanceId = await axios.get(
              `${API_BASE_URL}/fetch-performance-id/${can.candidateId}`
            );
            UpdatePerformace(performanceId.data);
          } catch (error) {
            console.log(error);
          }
        });
        fetchCallingList();
      })
      .catch((error) => {
        setIsMailSending(false);
        setResponse("Error Sending Email");
        console.error("Error sending email:", error);
        toast.error("Failed to send email");
      });
  };

  const UpdatePerformace = async (id) => {
    try {
      const additionalData = {
        mailToClient: new Date(),
      };
      const response1 = await axios.put(
        `${API_BASE_URL}/update-performance/${id}`,
        additionalData
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="text-secondary"
      >

        <Modal.Header closeButton>
          <Modal.Title>Send Candidate Data To Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "100%" }}>
              {/*addded by shweta jagdale line no 2363 to 2437 */}
             <Form.Label>
          <strong><span style={{ color: "red" }}>*</span>TO:</strong>
    </Form.Label>
    <Form.Control
      type="email"
      className="text-secondary"
      value={to}
      name="email"
      onChange={handleChange}
      placeholder="Enter a valid email"
    />
    {toError && (
      <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
        {toError}
      </div>
        )}
      

            </div>
            <div style={{ width: "100%" }}>
        <Form.Label>
          <strong>CC:</strong>
        </Form.Label>
        <Form.Control
          type="text" // Allow multiple emails
          className="text-secondary"
          value={cc}
          name="cc"
          onChange={handleChange}
          placeholder="Ex:abc@gmail.com,xyz@gmail.com"
        />
        {ccError && (
          <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
            {ccError}
          </div>
        )}
      </div>
          </Form.Group>
          <Form.Group style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "100%" }}>
          <Form.Label><strong>BCC:</strong></Form.Label>
          <Form.Control
            type="text"
            className="text-secondary"
            value={bcc}
            name="bcc"
            onChange={handleChange}
            placeholder="Ex:abc@gmail.com,xyz@gmail.com"
          />
          {bccError && (
            <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
              {bccError}
            </div>
          )}
        </div>
            <div style={{ width: "100%" }}>
            <Form.Label>
      <strong><span style={{ color: "red" }}>*</span>Subject:</strong>
    </Form.Label>
    <Form.Control
      type="text"
      className="text-secondary"
      value={subject}
      name="subject"
      onChange={handleChange}
      placeholder="Enter subject (max 100 characters)"
      maxLength={100}
    />
    {subjectError && (
      <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
        {subjectError}
      </div>
    )}
  </div>
          </Form.Group>
          <Form.Label className="mt-2">
            <strong>Email Body:</strong>
          </Form.Label>
          <div className="p-2 mb-2 border rounded">
            <Form.Group>
              <Form.Control
                as="textarea"
                className="text-secondary"
                rows={5}
                placeholder=""
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="mt-4 text-secondary"
                >
                  <thead>
                    <tr className="newclassforwhitespace">
                      <th>Sr.No</th>
                      <th>Date</th>
                      <th>Position</th>
                      <th>Candidate Name</th>
                      <th>Contact number</th>
                      <th>Email Id</th>
                      <th>Total Experience</th>
                      <th>Current Company</th>
                      <th>Notice Period(Days)</th>
                      <th>Holding Any Offer</th>
                      <th>Current Location</th>
                      <th>Per Day Billing Sent To Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCandidate.map((can, index) => (
                      <tr key={index} className="newclassforwhitespace">
                        <td className="text-secondary">{index + 1}</td>
                        <td className="text-secondary">{can.date}</td>
                        <td className="text-secondary">{can.jobDesignation}</td>
                        <td className="text-secondary">{can.candidateName}</td>
                        <td className="text-secondary">{can.contactNumber}</td>
                        <td className="text-secondary">{can.candidateEmail}</td>
                        <td className="text-secondary">
                          {can.experienceYear} years {can.experienceMonth}{" "}
                          months
                        </td>
                        <td className="text-secondary">{can.companyName}</td>
                        <td className="text-secondary">{can.noticePeriod}</td>
                        <td className="text-secondary">
                          {can.holdingAnyOffer}
                        </td>
                        <td className="text-secondary">
                          {can.currentLocation}
                        </td>
                        <td className="text-secondary">10000</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Form.Group>
          {/* Added by Shweta Jagdale line no 2511 to 2534 */}
            <div className="flex-wrap gap-1 mt-3 d-flex">
              <Form.Label className="mr-1">
                <strong>Attachments:</strong>{" "}
              </Form.Label>
             {selectedCandidate
  .filter((item) => item.resume) // Only show if resume is present
  .map((item, index) => (
    <a
      key={index}
      className="items-center justify-center d-flex"
      style={{
        border: "1px solid gray",
        borderRadius: "15px",
        padding: "0px 4px",
      }}
      href={`data:application/pdf;base64,${item.resume}`}
      download={`${item.candidateName}_${item.jobDesignation}.pdf`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {`${item.candidateName}_${item.jobDesignation}.pdf`}
    </a>
))}

            </div>
            <Form.Group controlId="formBasicFooter">
              <Form.Label>
                <strong>Email Footer</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                className="text-secondary"
                rows={3}
                style={{ minHeight: "70px" }}
                placeholder=""
                value={emailFooter}
                onChange={(e) => setEmailFooter(e.target.value)}
              />
            </Form.Group>
            {signatureImage && (
              <div className="mt-3">
                <strong>Signature:</strong>
                <br />
                <img
  src={
    employeeId === "3148" && userType === "TeamLeader"
      ? profileImageRtempus
      : employeeId === "3691" && userType === "TeamLeader"
      ? profileImageVelocity
      : signatureImage
  }
  alt="Signature"
  style={{ maxWidth: "100%", maxHeight: "200px" }}
/>

              </div>
            )}
            {/* <Form.Group>
              <Form.Label>
                <strong>Upload Signature Image Url:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                className="text-secondary"
                value={signatureImage}
                onChange={(e) => setSignatureImage(e.target.value)}
              />
            </Form.Group> */}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <div className="gap-2 d-flex align-items-center">
            <button
              className="SCE-share-forward-popup-btn"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              className="SCE-close-forward-popup-btn"
              onClick={handleSendEmail}
            >
              Send Email
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      {isMailSending && (
        <div className="SCE_Loading_Animation">
          <Loader size={50} color="#ffb281" />
        </div>
      )}      
    </>
  );
};

export default SendClientEmail;
