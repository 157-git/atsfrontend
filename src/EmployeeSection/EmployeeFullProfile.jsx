import Modal from "react-bootstrap/Modal";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../EmployeeSection/employeeProfile.css";


const EmployeeFullProfile = ({
  employeeData,
  profileImage,
  pdfSrc,
  onClose,
  onOpenResume,
  onCloseResume,
  isResumeOpen,
  toggleIncentive,
  toggleAttendance,
  togglePerformanceImprovement,
  userType,
  arrowPosition,
  onBackToModal
}) => {
  return (
    <div className="employee-profile-main-div">
      <main className="employee-profile-main">
        <section className="employee-profile-section">
          <div className="employee-profile-staticsection">
            <div className="employee-profile-static">
              <div className="employee-profile-details">
                <img src={profileImage} alt="Profile" />
                <p className="m-0"><b>Name: {employeeData?.name}</b></p>
                <p className="m-0"><b>Designation: {employeeData.designation}</b></p>
                <div className="emp-profile-details-subdiv"></div>
              </div>

              <div className="employee-profile-basic-details">
                <p className="m-1">
                  <b>Resume : </b>Resume.pdf{" "}
                  <i onClick={onOpenResume} className="fas fa-eye"></i>
                </p>
                <p className="m-1"><b>Job Role : </b>{employeeData.jobRole}</p>
                <p className="m-1"><b>Gender : </b>{employeeData.gender}</p>
                <p className="m-1"><b>Blood Group : </b>{employeeData.bloodGroup}</p>
                <p className="m-1"><b>T-Shirt Size : </b>{employeeData.tshirtSize}</p>
                <p className="m-1"><b>Date of Birth : </b>{employeeData.dateOfBirth}</p>
                <p className="m-1"><b>Date of Joining : </b>{employeeData.dateOfJoining}</p>
                <p className="m-1"><b>Work Location : </b>{employeeData.workLocation}</p>
                <p className="m-1"><b>Entry Source : </b>{employeeData.entrySource}</p>
                <p className="m-1"><b>Employee Status : </b>{employeeData.status}</p>
                <p className="m-1"><b> Salary : </b>{employeeData.salary}</p>
                <p className="m-1"><b>Official Email : </b>{employeeData.officialMail}</p>
                <p className="m-1"><b>Personal Email : </b>{employeeData.personalEmailId}</p>
                <p className="m-1"><b>Official Contact : </b>{employeeData.officialContactNo}</p>
                <p className="m-1"><b>Company Contact : </b>{employeeData.companyMobileNo}</p>
                <p className="m-1"><b>Personal Contact : </b>{employeeData.alternateContactNo}</p>
                <p className="m-1"><b>Whatsapp Number : </b>{employeeData.whatsAppNo}</p>
                <p className="m-1"><b>Marital Status : </b>{employeeData.maritalStatus}</p>
                <p className="m-1"><b>Anniversary Date : </b>{employeeData.anniversaryDate}</p>
                <p className="m-1"><b>Permanent Address : </b>{employeeData.address}</p>
                <p className="m-1"><b>Present Address : </b>{employeeData.presentAddress}</p>
              </div>
            </div>
          </div>

          <div className="employee-profile-scrollsection">
            <div className="employee-profile-performance-indicator">
              <button className="close-btn" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <h1><b>Performance Indicator</b></h1>

              <div className="emp-pro-data-progress-bar">
                <div className="emp-pro-data-progress-bar-inner">
                  <div className="emp-pro-data-poor"><h6>Poor</h6></div>
                  <div className="emp-pro-data-average"><h6>Average</h6></div>
                  <div className="emp-pro-data-good"><h6>Good</h6></div>
                  <div className="emp-pro-data-best"><h6>Best</h6></div>
                </div>
                <div className="moving-arrow" style={{ left: `${arrowPosition}px` }}>▼</div>
              </div>

              <div className="profile-back-button" style={{ padding: "5px" }}>
                <button onClick={toggleIncentive} className="emp-pro-incentive">Incentive</button>
                {userType === "Recruiters" ? (
                  <>
                    <button onClick={togglePerformanceImprovement}>Your Performance</button>
                    <button onClick={toggleAttendance}>Your Attendance</button>
                  </>
                ) : (
                  <>
                    <button onClick={togglePerformanceImprovement}>Team Performance</button>
                    <button onClick={toggleAttendance}>Team Attendance</button>
                  </>
                )}
              </div>
            </div>

            <div className="employee-profile-emergency-education-details">
              <div className="employee-profile-emergency-details">
                <h1><b>Emergency Contact Details</b></h1>
                <ul>
                  <li>Contact Person : {employeeData.emergencyContactPerson}</li>
                  <li>Contact Number : {employeeData.emergencyContactNo}</li>
                  <li>Contact Relation : {employeeData.emergencyPersonRelation}</li>
                </ul>
              </div>
              <div className="employee-profile-education-details">
                <h1><b>Education</b></h1>
                <ul>
                  <li>Qualifications : {employeeData.qualification}</li>
                </ul>
              </div>
            </div>

            <div className="employee-profile-previouscompany-reportingmanager-details">
              <div className="employee-profile-previouscompany-details">
                <h1><b>Previous Company</b></h1>
                <ul>
                  <li>Name : {employeeData.lastCompany}</li>
                  <li>Last Working Date : {employeeData.workingDate}</li>
                  <li>Reason For Leaving : {employeeData.reasonForLeaving}</li>
                </ul>
              </div>
              <div className="employee-profile-reportingmanager-details">
                <h1><b>Reporting Manager</b></h1>
                <ul>
                  <li>Name : {employeeData.reportingPersonName}</li>
                  <li>Designation : {employeeData.reportingPersonDesignation}</li>
                </ul>
              </div>
            </div>

            <div className="employee-profile-induction-message-details">
              <div className="employee-profile-induction-details">
                <h1><b>Induction Details</b></h1>
                <ul>
                  <li>Induction : {employeeData.inductionYesOrNo}</li>
                  <li>Induction Comment : {employeeData.inductionComment}</li>
                </ul>
              </div>
              <div className="employee-profile-message-details">
                <h1><b>Message</b></h1>
                <ul>
                  <li>Warning Comments : {employeeData.warningComments}</li>
                  <li>Team Leader Message : {employeeData.messageForAdmin}</li>
                  <li>Edit and delete authority : {employeeData.editDeleteAuthority}</li>
                </ul>
              </div>
            </div>

            <div className="employee-profile-interview-traning-details">
              <div className="employee-profile-traning-details">
                <h1><b>Training Details</b></h1>
                <ul>
                  <li>Training Source : {employeeData.trainingSource}</li>
                  <li>Training Completed : {employeeData.trainingCompletedYesOrNo}</li>
                  <li>Training Taken Count : {employeeData.trainingTakenCount}</li>
                  <li>Performance Indicator : {employeeData.performanceIndicator}</li>
                </ul>
              </div>
              <div className="employee-profile-interview-details">
                <h1><b>Interview</b></h1>
                <ul>
                  <li>Interview Taken By : {employeeData.interviewTakenPerson}</li>
                  <li>Rounds of Interview : {employeeData.roundsOfInterview}</li>
                </ul>
              </div>
            </div>

            <div className="employee-profile-document-social-details">
              <div className="employee-profile-document-details">
                <h1><b>Documents</b></h1>
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
                <h1><b>Social Links</b></h1>
                <ul>
                  <li>
                    LinkedIn :{" "}
                    <a href={`${employeeData.linkedInURL}`} target="_blank" rel="noreferrer">
                      {employeeData.linkedInURL}
                    </a>
                  </li>
                  <li>
                    Company LinkedIn Page:{" "}
                    <a href={`${employeeData.faceBookURL}`} target="_blank" rel="noreferrer">
                      {employeeData.faceBookURL}
                    </a>
                  </li>
                  <li>
                    Whatsapp Broadcast Channel:{" "}
                    <a href={`${employeeData.twitterURL}`} target="_blank" rel="noreferrer">
                      {employeeData.twitterURL}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <button onClick={onBackToModal} className="floating-back-btn">
  ← Back
</button>



      {isResumeOpen && (
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
              style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}
            >
              {pdfSrc ? (
                <iframe src={pdfSrc} width="100%" height="600px" title="PDF Viewer"></iframe>
              ) : (
                <div>No file available</div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={onCloseResume} variant="secondary">Close</button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
    </div>
  );
};

export default EmployeeFullProfile;
