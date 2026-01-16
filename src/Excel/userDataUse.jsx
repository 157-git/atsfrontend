import { useState, useEffect } from "react"
import { Modal, Card, List, Avatar, Skeleton } from "antd"
import { ClearOutlined } from "@ant-design/icons"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import "../Excel/userDataUse.css"
import { getUserImageFromApiForReport } from "../Reports/getUserImageFromApiForReport"
import { useParams } from "react-router-dom"
import { API_BASE_URL } from "../api/api"


const userDataUse = ({ loginEmployeeName, onCloseIncentive }) => {


  // State variables for managing UI and data
  const [displayModalContainer, setDisplayModalContainer] = useState(false)
  const [managersList, setManagersList] = useState([])
  const [teamLeadersList, setTeamLeadersList] = useState([])
  const [recruitersList, setRecruitersList] = useState([])
  const [displayBigSkeletonForManagers, setDisplayBigSkeletonForManagers] = useState(false)
  const [displayBigSkeletonForTeamLeaders, setDisplayBigSkeletonForTeamLeaders] = useState(false)
  const [displayBigSkeletonForRecruiters, setDisplayBigSkeletonForRecruiters] = useState(false)
  const [displayManagers, setDisplayManagers] = useState(false)
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false)
  const [displayRecruiters, setDisplayRecruiters] = useState(false)
  const [activeManager, setActiveManager] = useState(null)
  const [activeTeamLeader, setActiveTeamLeader] = useState(null)
  const [managerToTeamLeaders, setManagerToTeamLeaders] = useState({})
  const [teamLeaderToRecruiters, setTeamLeaderToRecruiters] = useState({})
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedRole, setSelectedRole] = useState("")
  const [allImagesForManagers, setAllImagesForManagers] = useState([])
  const [allImagesForTeamLeaders, setAllImagesForTeamLeaders] = useState([])
  const [allImagesForRecruiters, setAllImagesForRecruiters] = useState([])
  const [imageLoadErrors, setImageLoadErrors] = useState({})
  const [showCards, setShowCards] = useState(true) // Set to true by default to show cards
  const [userData, setUserData] = useState([]) // Sample data for demonstration
  const [isLoading, setIsLoading] = useState(false)
  // const [storageUnit, setStorageUnit] = useState("MB")
  const [showInMBMap, setShowInMBMap] = useState({})

  const [showSelfCard, setShowSelfCard] = useState(false)
  const [selfUserData, setSelfUserData] = useState(null)



  const { employeeId, userType } = useParams();

  // const employeeId = 1342;
  // const userType = "Manager"

  const getRoleButtons = () => {
    switch (userType.toLowerCase()) {
      case "superuser":
        return ["Manager"]
      case "manager":
        return ["Team Leader"]
      case "teamleader":
        return ["Recruiter"]
      default:
        return ["Recruiter", "Manager", "Team Leader"] // Show all for demo
    }
  }

  const getSelectedCountForRole = (roleName) => {
    if (roleName === "Team Leader") {
      return teamLeadersList.filter((tl) => selectedIds.includes(tl.teamLeaderId)).length;
    } else if (roleName === "Recruiter") {
      return recruitersList.filter((rec) => selectedIds.includes(rec.employeeId)).length;
    } else if (roleName === "Manager") {
      return managersList.filter((mgr) => selectedIds.includes(mgr.managerId)).length;
    }
    return 0;
  };



  const handleRoleButtonClick = (role) => {
    // Only clear selection if switching to a different role
    if (role !== selectedRole) {
      setSelectedRole(role);
      setSelectedIds([]);
    }
    setDisplayModalContainer(true);

    if (role === "Manager") {
      handleDisplayManagers("Manager");
    } else if (role === "Team Leader") {
      handleDisplayManagers("TeamLeader");
    } else if (role === "Recruiter") {
      handleDisplayManagers("Recruiter");
    }
  };


  // Function to fetch and display data based on role
  const handleDisplayManagers = async (role) => {
    setDisplayModalContainer(true)

    if (role === "Manager") {
      // Fetch managers data
      setDisplayBigSkeletonForManagers(true)
      try {
        // API call to get all managers
        const response = await axios.get(`${API_BASE_URL}/get-all-managers`)
        setManagersList(response.data)
        setDisplayBigSkeletonForManagers(false)
        setDisplayManagers(true)
        setDisplayTeamLeaders(false)
        setDisplayRecruiters(false)
      } catch (error) {
        console.error("Error fetching managers:", error)
        setDisplayBigSkeletonForManagers(false)
        toast.error("Failed to fetch managers")
      }
    } else if (role === "TeamLeader") {
      // Fetch team leaders data


      setDisplayBigSkeletonForTeamLeaders(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/tl-namesIds/${employeeId}`)
        setTeamLeadersList(response.data)

        // 👇 Add this short delay before flipping the actual list on
        setTimeout(() => {
          setDisplayBigSkeletonForTeamLeaders(false)
          setDisplayTeamLeaders(true)
        }, 300)
      } catch (error) {
        console.error("Error fetching team leaders:", error)
        setDisplayBigSkeletonForTeamLeaders(false)
        toast.error("Failed to fetch team leaders")
      }

    } else if (role === "Recruiter") {
      // Fetch recruiters data
      setDisplayBigSkeletonForRecruiters(true)
      try {
        // API call to get recruiters for the current employee
        const response = await axios.get(`${API_BASE_URL}/employeeId-names/${employeeId}`)
        setRecruitersList(response.data)
        setDisplayBigSkeletonForRecruiters(false)
        setDisplayRecruiters(true)
        setDisplayManagers(false)
        setDisplayTeamLeaders(false)
      } catch (error) {
        console.error("Error fetching recruiters:", error)
        setDisplayBigSkeletonForRecruiters(false)
        toast.error("Failed to fetch recruiters")
      }
    }
  }

  // Function to handle OK button click in the modal
  const handleOkey = async () => {
    setDisplayModalContainer(false)

    // Only proceed if IDs are selected
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one item")
      return
    }

    setShowCards(true)
    setIsLoading(true)

    try {
      // Determine the correct role parameter based on selected role
      let roleParam = ""

      if (selectedRole === "Manager") {
        roleParam = "Manager"
      } else if (selectedRole === "Team Leader") {
        roleParam = "TeamLeader"
      } else if (selectedRole === "Recruiter") {
        roleParam = "Recruiters" // Fixed: Changed from default to explicit "Recruiters"
      }

      // Create an array to store all fetched data
      let allUserData = []
      // Construct the correct API URL
      const apiUrl = `${API_BASE_URL}/getHierarchyStorage/${employeeId}/${userType}`
      console.log(`Fetching data for ID ${selectedIds} from: ${roleParam}`)

      try {
        const results = await axios.post(apiUrl,
          {
            employeeIds: selectedIds,
            userType: roleParam
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          });
        // allUserData = results.flat()
        setUserData(results.data)

        setUserData(results.data)

        if (!results.data || results.data.length === 0) {
          toast.warning("No data received from the API for the selected users")
        }

      } catch (error) {
        console.error("Error in handleOkey function:", error)
        toast.error(`Failed to fetch user data: ${error.message}`)
        setUserData([])
      } finally {
        setIsLoading(false)
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // Function to handle cancel button click in the modal
  const handleCancels = () => {
    setDisplayModalContainer(false)
  }

  // Function to toggle manager expansion
  const toggleManager = (managerId) => {
    if (activeManager === managerId) {
      setActiveManager(null)
    } else {
      setActiveManager(managerId)
    }
  }

  // Function to fetch team leaders for a specific manager
  const handleOpenDownArrowContent = async (managerid) => {
    setDisplayTeamLeaders(false)
    setAllImagesForTeamLeaders([])

    try {
      // API call to get team leaders for a specific manager
      const response = await axios.get(`${API_BASE_URL}/tl-namesIds/${managerid}`)
      setTeamLeadersList(response.data)
      setManagerToTeamLeaders((prev) => ({
        ...prev,
        [managerid]: response.data.map((tl) => tl.teamLeaderId),
      }))
      setDisplayBigSkeletonForTeamLeaders(false)
      setDisplayTeamLeaders(true)
      setDisplayRecruiters(false)
    } catch (error) {
      console.error("Error fetching team leaders:", error)
      setDisplayBigSkeletonForTeamLeaders(false)
      toast.error("Failed to fetch team leaders")
    }
  }

  // Function to fetch recruiters for a specific team leader
  const handleOpenDownArrowContentForRecruiters = async (teamLeaderId) => {
    setDisplayRecruiters(false)
    setAllImagesForRecruiters([])
    setDisplayBigSkeletonForRecruiters(true)
    try {
      // API call to get recruiters for a specific team leader
      const response = await axios.get(`${API_BASE_URL}/employeeId-names/${teamLeaderId}`)
      setRecruitersList(response.data)
      setTeamLeaderToRecruiters((prev) => ({
        ...prev,
        [teamLeaderId]: response.data.map((recruiter) => recruiter.employeeId),
      }))
      setDisplayBigSkeletonForRecruiters(false)
      setDisplayRecruiters(true)
    } catch (error) {
      console.error("Error fetching recruiters:", error)
      setDisplayBigSkeletonForRecruiters(false)
      toast.error("Failed to fetch recruiters")
    }
  }

  // Function to toggle team leader expansion
  const toggleTeamLeader = (teamLeaderId) => {
    if (activeTeamLeader === teamLeaderId) {
      setActiveTeamLeader(null)
    } else {
      setActiveTeamLeader(teamLeaderId)
    }
  }

  // Function to handle image loading errors
  const handleImageError = (id, type) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [`${type}-${id}`]: true,
    }))
  }

  // Function to get fallback image URL
  const getFallbackImageUrl = (index) => {
    return `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
  }

  // Function to check if a parent has selected children
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

  // Function to get the count of selected items based on role
  const getSelectedCount = () => {
    if (selectedRole === "Manager") {
      return managersList.filter((manager) => selectedIds.includes(manager.managerId)).length
    } else if (selectedRole === "Team Leader") {
      return teamLeadersList.filter((teamLeader) => selectedIds.includes(teamLeader.teamLeaderId)).length
    } else if (selectedRole === "Recruiter") {
      return recruitersList.filter((recruiter) => selectedIds.includes(recruiter.employeeId)).length
    }
    return 0
  }

  // Function to handle checkbox selection
  const handleCheckboxChange = (role, id) => {
    // If the role is different from the currently selected role, reset selection
    if (role !== selectedRole) {
      setSelectedRole(role)
      setSelectedIds([id])
      return
    }

    // Toggle the selection
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Function to clear selection
  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleShowMyDataUsage = async () => {
    // If already showing, toggle off
    if (showSelfCard) {
      setShowSelfCard(false);
      return;
    }

    // If already fetched, just show without re-fetching
    if (selfUserData) {
      setShowSelfCard(true);
      return;
    }

    // Else, fetch and show
    try {
      setIsLoading(true);
      const apiUrl = `${API_BASE_URL}/getHierarchyStorage/${employeeId}/${userType}`;
      const response = await axios.post(apiUrl, {
        employeeIds: [employeeId],
        userType: userType,
      });

      if (response.data?.length > 0) {
        setSelfUserData(response.data[0]);
        setShowSelfCard(true);
      } else {
        toast.warning("No data found for your profile.");
      }
    } catch (error) {
      console.error("Error fetching own data:", error);
      toast.error("Failed to fetch your data usage.");
    } finally {
      setIsLoading(false);
    }
  };



  // Function to handle Select All button
  const handleSelectAll = (role, dataList) => {
    // Set the selected role
    setSelectedRole(role)

    // Extract the appropriate IDs based on the role
    let allIds = []

    if (role === "Manager") {
      allIds = dataList.map((item) => item.managerId)
    } else if (role === "TeamLeader" || role === "Team Leader") {
      allIds = dataList.map((item) => item.teamLeaderId)
    } else if (role === "Recruiters" || role === "Recruiter") {
      allIds = dataList.map((item) => item.employeeId)
    }

    // Set the selected IDs
    setSelectedIds(allIds)
  }

  // Effect to fetch images for managers
  useEffect(() => {
    const fetchAllImagesForManagers = async () => {
      if (managersList && managersList.length > 0) {
        try {
          const images = await Promise.all(
            managersList.map(async (manager) => {
              try {
                // API call to get user image
                const imageUrl = await getUserImageFromApiForReport(manager.managerId, manager.jobRole)
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
                console.error(`Error fetching image for manager ${manager.managerId}:`, error)
                return null
              }
            }),
          )
          setAllImagesForManagers(images)
        } catch (error) {
          console.error("Error in fetchAllImagesForManagers:", error)
          setAllImagesForManagers(Array(managersList.length).fill(null))
        }
      }
    }

    fetchAllImagesForManagers()
  }, [managersList])

  // Effect to fetch images for team leaders
  useEffect(() => {
    const fetchAllImagesForTeamLeaders = async () => {
      if (teamLeadersList && teamLeadersList.length > 0) {
        try {
          const images = await Promise.all(
            teamLeadersList.map(async (teamLeader) => {
              try {
                // API call to get user image
                const imageUrl = await getUserImageFromApiForReport(teamLeader.teamLeaderId, teamLeader.jobRole)
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

  // Effect to fetch images for recruiters
  useEffect(() => {
    const fetchAllImagesForRecruiters = async () => {
      if (recruitersList && recruitersList.length > 0) {
        try {
          const images = await Promise.all(
            recruitersList.map(async (recruiter) => {
              try {
                // API call to get user image
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

  // Effect to automatically fetch team leaders when modal opens if user type is manager
  useEffect(() => {
    if (
      displayModalContainer &&
      userType.toLowerCase() === "manager" &&
      !displayTeamLeaders &&
      !displayManagers &&
      !displayRecruiters
    ) {
      console.log("Auto-fetching team leaders for manager user type")
      handleDisplayManagers("TeamLeader")
    } else if (
      displayModalContainer &&
      userType.toLowerCase() === "teamleader" &&
      !displayTeamLeaders &&
      !displayManagers &&
      !displayRecruiters
    ) {
      console.log("Auto-fetching recruiters for team leader user type")
      handleDisplayManagers("Recruiter")
    }
  }, [displayModalContainer, userType])

  // Function to handle MB/GB button click
  // const handlePlanClick = (unit) => {
  //   setStorageUnit(unit)
  // }

  // Function to render storage card content
  const renderStorageCard = (user) => {
    const StorageCardContent = () => {
      const [showInMB, setShowInMB] = useState(true); // Local toggle

      const empid = user.employeeId || "Unknown User";
      const userName = user.employeeName || "Unknown User";
      const email = user.employeeEmail || "No email";
      const mbStorage = user.mbStorage || 0;

      const displayedStorage = showInMB ? mbStorage : mbStorage / 1024;
      const totalLimit = showInMB ? 10240 : 10;
      const usagePercent = Math.min((displayedStorage / totalLimit) * 100, 100);
      const usedPercent = Math.min((mbStorage / 5120) * 100, 100); // percentage
      const remainingPercent = 100 - usedPercent;

      return (
        <div className="storage-card-content">
          <div className="card-left">
            <div className="user-info">
              <p><i className="bi bi-person-badge-fill"></i> <b>Employee Id:</b> {empid}</p>
              <p><i className="bi bi-person-fill"></i> <b>Name:</b> {userName}</p>
              <p><i className="bi bi-envelope-fill"></i> <b>Email:</b> {email}</p>
            </div>
            <div style={{ fontSize: "14px", fontWeight: 500 }}>
              The user uses:
              <span style={{ margin: "0 6px", fontWeight: 700 }}>
                {showInMB
                  ? `${mbStorage.toFixed(2)} MB`
                  : `${(mbStorage / 1024).toFixed(2)} GB`} <br />
              </span>
              <br />
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "grey", color: "white" }}
                onClick={() => setShowInMB((prev) => !prev)}
              >
                Show in {showInMB ? "GB" : "MB"}
              </button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>

                <Pie
                  data={[
                    { name: "Used", value: usedPercent },
                    { name: "Remaining", value: remainingPercent },
                  ]}

                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={74}
                  cornerRadius={10}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={700}
                >
                  <Cell fill="#90c824" />  {/* Indigo - used */}
                  <Cell fill="#e0e7ff" />  {/* Soft lavender - free */}
                </Pie>


                {/* Center Label */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "14px", fontWeight: 600, fill: "#333" }}
                >
                  {usedPercent.toFixed(1)}%
                </text>

                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "16px", fill: "#888" }}
                >
                  used
                </text>


              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    };

    return <StorageCardContent />;
  };


  const filteredUserData = userData.filter((user) => user.employeeId !== employeeId);
  const dataUsageCardsLength = filteredUserData.length


  return (
    <div className="data-usage-app">
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Heading section */}
      <div className="data-usage-heading">
        <h2>Data Usage</h2><br></br>
      </div>


      <div className="button-group-container mb-3 d-flex flex-wrap justify-content-center gap-2">
        <button className="role-button" onClick={handleShowMyDataUsage}>
          {showSelfCard ? "Hide My Data Usage" : "My Data Usage"}
        </button>

        {getRoleButtons().map((role, index) => {
          const count = getSelectedCountForRole(role);
          return (
            <button key={index} className="role-button" onClick={() => handleRoleButtonClick(role)}>
              {role}
              {count > 0 && (
                <span className="selectedcount ms-2">{count}</span>
              )}
            </button>
          );
        })}

      </div>




      {/* Modal for selection */}
      {displayModalContainer && (
        <Modal width={1000} open={displayModalContainer} onOk={handleOkey} onCancel={handleCancels}>
          <div className="selection-lists-container">
            {/* Manager selection */}
            {displayManagers ? (
              <Card
                hoverable
                className="selection-card manager-card"
                title={
                  <div className="selection-header">
                    <span>Managers</span>
                    <div className="selection-actions">
                      <button className="select-all-button" onClick={() => handleSelectAll("Manager", managersList)}>
                        Select All
                      </button>
                      {selectedIds.length > 0 && (
                        <button className="clear-button" onClick={handleClearSelection}>
                          <ClearOutlined className="clear-icon" />
                        </button>
                      )}
                    </div>
                  </div>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={managersList}
                  renderItem={(item, index) => (
                    <List.Item
                      className={hasSelectedChildren(item.managerId, "Manager") ? "highlight-item" : ""}
                      key={item.managerId}
                    >
                      <input
                        className="selection-checkbox"
                        type="checkbox"
                        checked={selectedRole === "Manager" && selectedIds.includes(item.managerId)}
                        onChange={() => handleCheckboxChange("Manager", item.managerId)}
                      />
                      <List.Item.Meta
                        avatar={
                          allImagesForManagers.length === 0 ? (
                            <Skeleton.Avatar active />
                          ) : (
                            <Avatar
                              src={
                                allImagesForManagers.length > 0
                                  ? allImagesForManagers[index] !== null
                                    ? allImagesForManagers[index]
                                    : getFallbackImageUrl(index)
                                  : getFallbackImageUrl(index)
                              }
                              onError={() => handleImageError(item.managerId, "Manager")}
                            />
                          )
                        }
                        title={item.managerName}
                      />
                      <svg
                        onClick={() => {
                          handleOpenDownArrowContent(item.managerId)
                          toggleManager(item.managerId)
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000000"
                        className={activeManager === item.managerId ? "rotate-icon" : "dropdown-arrow"}
                      >
                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                      </svg>
                    </List.Item>
                  )}
                />
              </Card>
            ) : (
              displayBigSkeletonForManagers && <Skeleton.Node active={true} className="skeleton-nodefordatauseonly" style={{
                width: 300,
                height: "65vh"
              }} />
            )}

            {/* Team Leader selection */}
            {displayTeamLeaders ? (
              <Card
                hoverable
                className="selection-card teamleader-card"
                title={
                  <div className="selection-header">
                    <span>Team Leaders</span>
                    <div className="selection-actions">
                      <button
                        className="select-all-button"
                        onClick={() => handleSelectAll("Team Leader", teamLeadersList)}
                      >
                        Select All
                      </button>
                      {selectedIds.length > 0 && (
                        <button className="clear-button" onClick={handleClearSelection}>
                          <ClearOutlined className="clear-icon" />
                        </button>
                      )}
                    </div>
                  </div>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={teamLeadersList}
                  renderItem={(teamLeader, index) => (
                    <List.Item
                      className={hasSelectedChildren(teamLeader.teamLeaderId, "TeamLeader") ? "highlight-item" : ""}
                      key={teamLeader.teamLeaderId}
                    >
                      <input
                        className="selection-checkbox"
                        type="checkbox"
                        checked={selectedRole === "Team Leader" && selectedIds.includes(teamLeader.teamLeaderId)}
                        onChange={() => handleCheckboxChange("Team Leader", teamLeader.teamLeaderId)}
                      />
                      <List.Item.Meta
                        avatar={
                          allImagesForTeamLeaders.length === 0 ? (
                            <Skeleton.Avatar active />
                          ) : (
                            <Avatar
                              src={
                                allImagesForTeamLeaders.length > 0
                                  ? allImagesForTeamLeaders[index] !== null
                                    ? allImagesForTeamLeaders[index]
                                    : getFallbackImageUrl(index)
                                  : getFallbackImageUrl(index)
                              }
                              onError={() => handleImageError(teamLeader.teamLeaderId, "TeamLeader")}
                            />
                          )
                        }
                        title={teamLeader.teamLeaderName}
                      />
                      <svg
                        onClick={() => {
                          handleOpenDownArrowContentForRecruiters(teamLeader.teamLeaderId)
                          toggleTeamLeader(teamLeader.teamLeaderId)
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000000"
                        className={activeTeamLeader === teamLeader.teamLeaderId ? "rotate-icon" : "dropdown-arrow"}
                      >
                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                      </svg>
                    </List.Item>
                  )}
                />
              </Card>
            ) : (
              displayBigSkeletonForTeamLeaders && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px"
                  }}
                >
                  <Skeleton
                    active
                    avatar
                    title
                    paragraph={{ rows: 4 }}
                    style={{
                      width: 260,
                      padding: 20,
                      background: "white",
                      borderRadius: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  />
                </div>
              )
            )}


            {/* Recruiter selection */}
            {displayRecruiters ? (
              <Card
                hoverable
                className="selection-card recruiter-card"
                title={
                  <div className="selection-header">
                    <span>Recruiters</span>
                    <div className="selection-actions">
                      <button
                        className="select-all-button"
                        onClick={() => handleSelectAll("Recruiter", recruitersList)}
                      >
                        Select All
                      </button>
                      {selectedIds.length > 0 && (
                        <button className="clear-button" onClick={handleClearSelection}>
                          <ClearOutlined className="clear-icon" />
                        </button>
                      )}
                    </div>
                  </div>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={recruitersList}
                  renderItem={(recruiter, index) => (
                    <List.Item key={recruiter.employeeId}>
                      <input
                        className="selection-checkbox"
                        type="checkbox"
                        checked={selectedRole === "Recruiter" && selectedIds.includes(recruiter.employeeId)}
                        onChange={() => handleCheckboxChange("Recruiter", recruiter.employeeId)}
                      />
                      <List.Item.Meta
                        avatar={
                          allImagesForRecruiters.length === 0 ? (
                            <Skeleton.Avatar active />
                          ) : (
                            <Avatar
                              src={
                                allImagesForRecruiters.length > 0
                                  ? allImagesForRecruiters[index] !== null
                                    ? allImagesForRecruiters[index]
                                    : getFallbackImageUrl(index)
                                  : getFallbackImageUrl(index)
                              }
                              onError={() => handleImageError(recruiter.employeeId, "Recruiters")}
                            />
                          )
                        }
                        title={recruiter.employeeName}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            ) : (
              displayBigSkeletonForRecruiters && <Skeleton.Node active={true} className="skeleton-node" style={{
                width: 300,
                height: "65vh"
              }} />
            )}
          </div>
        </Modal>
      )}

      {/* Display storage cards after selection */}
      {isLoading ? (
        // ✅ Show skeletons in grid format
        <div className="storage-cards-container">
          <div className="storage-cards-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="storage-card" hoverable>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        </div>
      ) : (showSelfCard || filteredUserData.length > 0) ? (
        <div className="storage-cards-container">
          <div className="storage-cards-grid">

            {/* ✅ Your own card */}
            {showSelfCard && selfUserData && (
              <Card className="storage-card" hoverable>
                <div className="self-label">You</div>
                {renderStorageCard(selfUserData)}
              </Card>
            )}

            {/* ✅ Everyone else */}
            {filteredUserData.map((user, index) => (
              <Card key={index} className="storage-card" hoverable>
                {renderStorageCard(user)}
              </Card>
            ))}

          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p>No data available</p>
        </div>
      )}



    </div>
  )
}

export default userDataUse;
