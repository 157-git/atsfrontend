import React, { useState } from "react";
import "../EmployeeDashboard/shortlistedNavbar.css";
import ShortListedCandidates from "../CandidateSection/ShortListedCandidate";
import InterviewDates from "../EmployeeSection/interviewDate";
import UpdateCallingTracker from "../EmployeeSection/UpdateSelfCalling";

const ShortlistedNavbar = ({ loginEmployeeName }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const toggleCalendar = () => {
    setActiveComponent((prevComponent) =>
      prevComponent === "calendar" ? null : "calendar"
    );
  };

  const toggleShortlistedData = () => {
    setActiveComponent((prevComponent) =>
      prevComponent === "shortlisted" ? null : "shortlisted"
    );
  };

  const handleViewUpdatedPage = (employeeId, candidateId) => {
    setSelectedCandidate({ employeeId, candidateId });
    setActiveComponent("update");
  };

  return (
    <div className="w-full">
      <div className="shortlisted-main-nav">
        <div className="shortlisted-nav-left">
          <i
            style={{ fontSize: "22px" }}
            onClick={toggleCalendar}
            className="fa-regular fa-calendar"
          ></i>
          <button
            className="shortListed-btn-nav"
            onClick={toggleShortlistedData}
          >
            ShortListed
          </button>
        </div>
      </div>

      <div className="shortlisted-nav-middel">
        {activeComponent === "calendar" && <InterviewDates />}

        <div className="show-shortlistedNav-div">
          {activeComponent === "shortlisted" && (
            <ShortListedCandidates
              viewUpdatedPage={handleViewUpdatedPage}
              loginEmployeeName={loginEmployeeName}
            />
          )}
        </div>

        {activeComponent === "update" && selectedCandidate && (
          <UpdateCallingTracker
            employeeId={selectedCandidate.employeeId}
            candidateId={selectedCandidate.candidateId}
            closeUpdatePage={() => setActiveComponent("shortlisted")}
          />
        )}
      </div>
    </div>
  );
};

export default ShortlistedNavbar;
