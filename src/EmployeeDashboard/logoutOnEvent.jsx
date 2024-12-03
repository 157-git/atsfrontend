import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";

const LogoutOnEvent = () => {
  const { employeeId, userType } = useParams();

  // Arshad Attar ( Note :- Commented This we will work after some its taking to much time Full Code )

  const logout = () => {
    console.log("Performing logout...");

    // Clear local storage
    localStorage.removeItem(`loginTimeSaved_${employeeId}`);
    localStorage.removeItem(`loginDetailsSaved_${employeeId}`);
    localStorage.removeItem(`stopwatchTime_${employeeId}`);
    localStorage.removeItem(`dailyWorkData_${employeeId}`);
    localStorage.removeItem(`breaks_${employeeId}`);
    localStorage.removeItem(`user_${userType}${employeeId}`);
    localStorage.removeItem("paymentMade");

    // Prepare the logout request body
    let requestBody = {};
    switch (userType) {
      case "SuperUser":
        requestBody = { superUserId: employeeId };
        break;
      case "Manager":
        requestBody = { managerId: employeeId };
        break;
      case "TeamLeader":
        requestBody = { teamLeaderId: employeeId };
        break;
      case "Recruiters":
        requestBody = { employeeId: employeeId };
        break;
      default:
        console.error("Invalid user type");
        return;
    }

    // Send logout API call using sendBeacon for async logout
    const logoutEndpoint = `${API_BASE_URL}/user-logout-157/${userType}`;
    const beaconRequestBody = JSON.stringify(requestBody);
    navigator.sendBeacon(logoutEndpoint, beaconRequestBody);
    console.log("Logout request sent via sendBeacon");
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Show confirmation message
      const message = "Are you sure you want to leave or reload the page? Your progress might not be saved.";

      // Standard method to trigger the confirmation dialog
      event.returnValue = message;  // For most browsers
      return message;  // For older browsers (still supported for compatibility)

      // Perform logout when user chooses to leave the site
      logout();
    };

    // Attach event listener to the window's beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [employeeId, userType]);

  return null; // Component doesn't render anything
};

export default LogoutOnEvent;
