import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// Dhanashree_Lokhande_EmployeeProfileData_changing_performace indicator color/11/09

import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../EmployeeSection/employeeProfile.css";
import axios, { API_BASE_URL } from "../api/api.js";
import dummyUserImg from "../photos/DummyUserImg.png";
import { toast } from "react-toastify";
import EmployeeProfileModal from "./EmployeeProfileModal.jsx";
import EmployeeFullProfile from "./EmployeeFullProfile.jsx";
import PerformanceImprovement from "./performanceImprovement.jsx";
import Incentive from "./Incentive.jsx";
import Attendance from "./Attendence_sheet.jsx";


const EmployeeProfileData = ({ onClose, toggleIncentive, toggleAttendance, togglePerformanceImprovement }) => {
  const [viewMoreProfileShow, setViewMoreProfileShow] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [pdfSrc, setPdfSrc] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const { employeeId, userType } = useParams();

  const [value, setValue] = useState(0);
  const targetValue = 55;
  const [currentView, setCurrentView] = useState("modal"); 


  useEffect(() => {
    fetch(`${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        setEmployeeData(data);

        // profile image
        if (data.profileImage) {
          try {
            const byteCharacters = atob(data.profileImage);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            setProfileImage(url);
          } catch {
            setProfileImage(dummyUserImg);
          }
        } else {
          setProfileImage(dummyUserImg);
        }

        // resume
        if (data.resumeFile) {
          const byteCharacters = atob(data.resumeFile);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfSrc(url);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [employeeId, userType]);

  const handleUpdateName = async (updatedEmployee) => {
    if (!updatedEmployee) return;
    setEmployeeData(updatedEmployee);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-user-data/${employeeId}/${userType}?newName=${updatedEmployee.name}`
      );
      if (response.status) {
        toast.success("Name updated successfully");
      } else {
        toast.error("Failed to update name");
      }
    } catch {
      toast.error("Error updating name");
    }
  };

  const viewMoreProfile = () => {
    setViewMoreProfileShow(true);
    const totalDuration = 2000;
    const steps = 200;
    const stepDuration = totalDuration / steps;
    let interval = setInterval(() => {
      setValue((prev) => {
        const nextValue = prev + targetValue / steps;
        if (nextValue >= targetValue) {
          clearInterval(interval);
          return targetValue;
        }
        return nextValue;
      });
    }, stepDuration);
    setTimeout(() => clearInterval(interval), totalDuration);
  };

  const arrowPosition = (value / 100) * 600;

  if (currentView === "performanceImprovement") {
  return <PerformanceImprovement onBack={() => setCurrentView("fullProfile")} />;
}

if (currentView === "incentive") {
  return <Incentive onBack={() => setCurrentView("fullProfile")} />;
}

if (currentView === "attendance") {
  return <Attendance onBack={() => setCurrentView("fullProfile")} />;
}


if (currentView === "fullProfile") {
      return (
      <EmployeeFullProfile
        employeeData={employeeData}
        profileImage={profileImage}
        pdfSrc={pdfSrc}
        isResumeOpen={isResumeOpen}
        onOpenResume={() => setIsResumeOpen(true)}
        onCloseResume={() => setIsResumeOpen(false)}
        onClose={onClose}
        toggleIncentive={toggleIncentive}
        toggleAttendance={toggleAttendance}
togglePerformanceImprovement={() => setCurrentView("performanceImprovement")}
        userType={userType}
        arrowPosition={arrowPosition}
          onBackToModal={() => setCurrentView("modal")}
      />
    );
  }

  return (
    <EmployeeProfileModal
      employeeData={employeeData}
      profileImage={profileImage}
      onClose={onClose}
onViewMore={() => setCurrentView("fullProfile")}
      onUpdateName={handleUpdateName}
    />
  );
};

export default EmployeeProfileData;

