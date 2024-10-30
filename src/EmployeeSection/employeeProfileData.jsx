import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// Dhanashree_Lokhande_EmployeeProfileData_changing_performace indicator color/11/09

import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "../EmployeeSection/employeeProfile.css";
import TeamDetails from "../TeamDetails/teamDetails";
import { API_BASE_URL } from "../api/api";

const EmployeeProfileData = ({
  onClose,
  toggleIncentive,
  toggleAttendance,
  togglePerformanceImprovement,
}) => {
  const [viewMoreProfileShow, setViewMoreProfileShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [pdfSrc, setPdfSrc] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const { employeeId } = useParams();
  const { userType } = useParams();

  const [value, setValue] = useState(0); //Arshad Attar Added This Line :- 17-10-2024
  const targetValue = 45; //Arshad Attar Added This Line :- 17-10-2024

  //Arshad Attar Added This code  :- 17-10-2024
  //Line Start 33
  const viewMoreProfile = (e) => {
    e.preventDefault();
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
  //Arshad Attar Added This code  :- 17-10-2024
  //Line End57

  useEffect(() => {
    fetch(`${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEmployeeData(data);
        if (data.profileImage) {
          const byteCharacters = atob(data.profileImage);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });

          const url = URL.createObjectURL(blob);
          setProfileImage(url);
        }
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
          console.log(url);

          return () => URL.revokeObjectURL(url);
        }
        return () => URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleEditProfile = () => {
    history.push({
      pathname: "/edit-employee", // replace with your AddEmployee component route
      state: { employeeData }, // pass employeeData as state
    });
  };

  const goBackToDashBoard = (e) => {
    e.preventDefault();
    setViewMoreProfileShow(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const closeAllModalsAndClosePage = () => {
    setIsModalOpen(false);
    setViewMoreProfileShow(false);
    window.close(); // Closes the current window
  };

  if (viewMoreProfileShow)
    return (
      <div className="employee-profile-main-div">
        <main className="employee-profile-main">
          <section className="employee-profile-section">
            <div className="employee-profile-staticsection">
              <div className="employee-profile-static">
                <div className="employee-profile-details">
                  <img src={profileImage} />
                  <p className="m-0">
                    <b>Name: {employeeData?.name}</b>
                  </p>
                  <p className="m-0">
                    <b>Designation: {employeeData.designation}</b>
                  </p>
                  <div className="emp-profile-details-subdiv"></div>
                </div>

                <div className="employee-profile-basic-details">
                  <p className="m-1">
                    <b>Resume : </b>Resume.pdf{" "}
                    <i onClick={openModal} className="fas fa-eye"></i>
                  </p>
                  <p className="m-1">
                    <b>Job Role : </b>

                    {employeeData.jobRole}
                  </p>
                  <p className="m-1">
                    <b>Gender : </b>
                    {employeeData.gender}
                  </p>

                  <p className="m-1">
                    <b>Blood Group : </b>
                    {employeeData.bloodGroup}
                  </p>
                  <p className="m-1">
                    <b>T-Shirt Size : </b>
                    {employeeData.tshirtSize}
                  </p>
                  <p className="m-1">
                    <b>Date of Birth : </b>
                    {employeeData.dateOfBirth}
                  </p>
                  <p className="m-1">
                    <b>Date of Joining : </b>
                    {employeeData.dateOfJoining}
                  </p>
                  <p className="m-1">
                    <b>Work Location : </b>
                    {employeeData.workLocation}
                  </p>
                  <p className="m-1">
                    <b>Entry Source : </b>
                    {employeeData.entrySource}
                  </p>
                  <p className="m-1">
                    <b>Employee Status : </b>
                    {employeeData.employeeStatus}
                  </p>
                  <p className="m-1">
                    <b> Salary : </b>
                    {employeeData.salary}
                  </p>
                  <p className="m-1">
                    <b>Official Email : </b>
                    {employeeData.officialMail}
                  </p>
                  <p className="m-1">
                    <b>Personal Email : </b>
                    {employeeData.personalEmailId}
                  </p>
                  <p className="m-1">
                    <b>Official Contact : </b>
                    {employeeData.officialContactNo}
                  </p>
                  <p className="m-1">
                    <b>Company Contact : </b>
                    {employeeData.companyMobileNo}
                  </p>
                  <p className="m-1">
                    <b>Personal Contact : </b>
                    {employeeData.alternateContactNo}
                  </p>
                  <p className="m-1">
                    <b>Whatsapp Number : </b>
                    {employeeData.whatsAppNo}
                  </p>

                  <p className="m-1">
                    <b>Marital Status : </b>
                    {employeeData.maritalStatus}
                  </p>
                  <p className="m-1">
                    <b>Anniversary Date : </b>
                    {employeeData.anniversaryDate}
                  </p>
                  <p className="m-1">
                    <b>Permanent Address : </b>
                    {employeeData.address}
                  </p>
                  <p className="m-1">
                    <b>Present Address : </b>
                    {employeeData.presentAddress}
                  </p>
                  <p className="m-1">
                    <b>Perks : </b>
                    {employeeData.perks}
                  </p>
                </div>
              </div>
            </div>

            <div className="employee-profile-scrollsection">
              <div className="employee-profile-performance-indicator">
                <h1>
                  <b>Performance Indicator</b>
                </h1>

                <div>
                  <div className="emp-pro-data-progress-bar">
                    <div className="emp-pro-data-progress-bar-inner">
                      <div className="emp-pro-data-poor">
                        <h6>Poor</h6>
                      </div>

                      <div className="emp-pro-data-average">
                        <h6>Average</h6>
                      </div>

                      <div className="emp-pro-data-good">
                        <h6>Good</h6>
                      </div>

                      <div className="emp-pro-data-best">
                        <h6>Best</h6>
                      </div>
                    </div>

                    {/* Arrow div that moves based on the hardcoded value */}
                    <div
                      className="moving-arrow"
                      style={{ left: `${arrowPosition}px` }}
                    >
                      ▼
                    </div>
                  </div>
                </div>

                <div className="profile-back-button" style={{ padding: "5px" }}>
                  <button
                    onClick={toggleIncentive}
                    className="emp-pro-incentive"
                  >
                    Incentive
                  </button>

                  {userType === "Recruiters" ? (
                    <>
                      <button onClick={togglePerformanceImprovement}>
                        Your Performance
                      </button>
                      <button onClick={toggleAttendance}>
                        Your Attendance
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={togglePerformanceImprovement}>
                        Team Performance
                      </button>
                      <button onClick={toggleAttendance}>
                        Team Attendance
                      </button>
                    </>
                  )}
                  {/* <div className="profile-back-button"> */}
                  <button onClick={onClose}>
                    Close
                    <i className="fas fa-times"></i>
                  </button>
                  {/* </div> */}
                </div>
              </div>
              <div className="employee-profile-emergency-education-details">
                {/*End Prachi EmployeeProfile 1/07 line no 205 to 210  */}

                <div className="employee-profile-emergency-details">
                  <h1>
                    <b>Emergency Details</b>
                  </h1>
                  <ul>
                    <li>
                      Emergency Contact Person :{" "}
                      {employeeData.emergencyContactPerson}
                    </li>
                    <li>
                      Emergency Contact Number :{" "}
                      {employeeData.emergencyContactNo}
                    </li>
                    <li>
                      Emergency Contact Relation :{" "}
                      {employeeData.emergencyPersonRelation}
                    </li>
                  </ul>
                </div>
                <div className="employee-profile-education-details">
                  <h1>
                    <b>Education Qualification</b>
                  </h1>
                  <ul>
                    <li>Qualifications : {employeeData.qualification}</li>
                  </ul>
                </div>
              </div>
              <div className="employee-profile-previouscompany-reportingmanager-details">
                <div className="employee-profile-previouscompany-details">
                  <h1>
                    <b>Previous Company</b>
                  </h1>
                  <ul>
                    <li>Previous Company Name : {employeeData.lastCompany}</li>
                    <li>Last Working Date : {employeeData.workingDate}</li>
                    <li>
                      Reason For Leaving : {employeeData.reasonForLeaving}
                    </li>
                    {/* <li>
                      Employee Experience : {employeeData.employeeExperience}
                    </li> */}
                  </ul>
                </div>
                <div className="employee-profile-reportingmanager-details">
                  <h1>
                    <b>Reporting Manager</b>
                  </h1>
                  <ul>
                    <li>
                      Reporting Manager Name :{" "}
                      {employeeData.reportingPersonName}
                    </li>
                    <li>
                      Reporting Manager Designation :{" "}
                      {employeeData.reportingPersonDesignation}
                    </li>
                  </ul>
                </div>
              </div>
              {/* Employee Induction and warning/comments details */}
              <div className="employee-profile-induction-message-details">
                <div className="employee-profile-induction-details">
                  <h1>
                    <b>Induction Details</b>
                  </h1>
                  <ul>
                    <li>Induction : {employeeData.inductionYesOrNo}</li>
                    <li>Induction Comment : {employeeData.inductionComment}</li>
                  </ul>
                </div>
                <div className="employee-profile-message-details">
                  <h1>
                    <b>Message</b>
                  </h1>
                  <ul>
                    <li>Warning Comments : {employeeData.warningComments}</li>
                    <li>
                      Team Leader Message : {employeeData.messageForAdmin}
                    </li>
                    <li>
                      Edit and delete authority :{" "}
                      {employeeData.editDeleteAuthority}
                    </li>
                  </ul>
                </div>
              </div>
              {/* Employee Interview and Training Details */}
              <div className="employee-profile-interview-traning-details">
                <div className="employee-profile-traning-details">
                  <h1>
                    <b>Training Details</b>
                  </h1>
                  <ul>
                    <li>Training Source : {employeeData.trainingSource}</li>
                    <li>
                      Training Completed :{" "}
                      {employeeData.trainingCompletedYesOrNo}
                    </li>
                    <li>
                      Training Taken Count : {employeeData.trainingTakenCount}
                    </li>
                    <li>
                      Performance Indicator :{" "}
                      {employeeData.performanceIndicator}
                    </li>
                  </ul>
                </div>
                <div className="employee-profile-interview-details">
                  <h1>
                    <b>Interview</b>
                  </h1>
                  <ul>
                    <li>
                      Interview Taken By : {employeeData.interviewTakenPerson}
                    </li>
                    <li>
                      Rounds of Interview : {employeeData.roundsOfInterview}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Employee Document and Social Link Details */}
              <div className="employee-profile-document-social-details">
                <div className="employee-profile-document-details">
                  <h1>
                    <b>Documents</b>
                  </h1>
                  <ul>
                    <li>Adhaar Card : {employeeData.aadhaarNo}</li>
                    <li>Pan Card : {employeeData.panNo}</li>
                    <li>PF Number : {employeeData.pfNo}</li>
                    <li>PT Number : {employeeData.professionalPtNo}</li>
                    <li>ESIC Number : {employeeData.esIcNo}</li>
                    <li>Insurance Number : {employeeData.insuranceNumber}</li>
                  </ul>
                </div>
                <div className="employee-profile-social-details">
                  <h1>
                    <b>Social Links</b>
                  </h1>
                  <ul>
                    <li>
                      LinkedIn :{" "}
                      <a href={`${employeeData.linkedInURL}`} target="_blank">
                        {employeeData.linkedInURL}
                      </a>
                    </li>
                    <li>
                      Facebook :{" "}
                      <a href={`${employeeData.faceBookURL}`} target="_blank">
                        {employeeData.faceBookURL}
                      </a>
                    </li>
                    <li>
                      Twitter :{" "}
                      <a href={`${employeeData.twitterURl}`} target="_blank">
                        {employeeData.twitterURL}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Ajhar-11-07-2024 jsx.LineNo-370  */}
            </div>
          </section>
        </main>
        {isModalOpen && (
          <>
            <div
              className="bg-black bg-opacity-50 modal show"
              style={{
                display: "flex",
                position: "fixed",
                top: "0px",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Modal.Dialog style={{ width: "800px", padding: "10px" }}>
                <Modal.Body
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <iframe
                    src={pdfSrc}
                    width="100%"
                    height="600px"
                    title="PDF Viewer"
                  ></iframe>
                </Modal.Body>
                <Modal.Footer>
                  <button onClick={closeModal} variant="secondary">
                    Close
                  </button>
                </Modal.Footer>
              </Modal.Dialog>
            </div>
          </>
        )}
      </div>
    );

  return (
    <div className="employee-profile-card">
      {employeeData != null ? (
        <Modal.Dialog style={{ padding: "10px", margin: "10px" }}>
          <Modal.Header
            style={{ fontSize: "18px", backgroundColor: "#f2f2f2" }}
          >
            Employee Profile
            <button
              onClick={onClose}
              style={{
                marginLeft: "250px",
                color: "red",
              }}
              className="close-profile-popup-btn  white-Btn"
            >
              X
            </button>
          </Modal.Header>
          <Modal.Body
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              backgroundColor: "#f2f2f2",
              color: "gray",
            }}
          >
            <div className="profile-card-img">
              <img src={profileImage} width={"150px"} />
            </div>
            <div>
              <p className="m-1" style={{ color: "gray" }}>
                Name : {employeeData.name}
              </p>
              <p className="m-1">Job Role: {employeeData.jobRole}</p>
              <p className="m-1">Email: {employeeData.personalEmailId}</p>
              <p className="m-1">
                Mobile no: {employeeData.emergencyContactNo}
              </p>
              <p className="m-1">Gender: {employeeData.gender}</p>
              <p className="m-1">Blood Group: {employeeData.bloodGroup}</p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
            {/* Ajhar Tamboli - EmployeeProfileData- 22-07-24- lineNo 491 to 510 */}
            <button
              onClick={viewMoreProfile}
              className="display-more-profile-btn daily-tr-btn"
            >
              More
            </button>
          </Modal.Footer>
        </Modal.Dialog>
      ) : (
        <Modal.Dialog style={{ width: "500px", padding: "10px" }}>
          <Modal.Header style={{ fontSize: "18px" }}>Profile</Modal.Header>
          <Modal.Body
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <div>Loading...</div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={onClose} className="close-profile-popup-btn">
              Close
            </button>
          </Modal.Footer>
        </Modal.Dialog>
      )}
    </div>
  );
};
export default EmployeeProfileData;
