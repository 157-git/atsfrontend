import Modal from "react-bootstrap/Modal";
import dummyUserImg from "../photos/DummyUserImg.png";
import "../EmployeeSection/employeeProfile.css";

const EmployeeProfileModal = ({ employeeData, profileImage, onClose, onViewMore, onUpdateName }) => {
  if (!employeeData) {
    return (
      <div className="employee-profile-overlay">
        <Modal.Dialog style={{ width: "500px", padding: "10px" }}>
          <Modal.Header style={{ fontSize: "18px" }}>Profile</Modal.Header>
          <Modal.Body style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div>Loading...</div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={onClose} className="close-profile-popup-btn">
              Close
            </button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }

  return (
    <div className="employee-profile-overlay">
      <Modal.Dialog style={{ padding: "10px", margin: "10px", width: "530px" }}>
        <Modal.Header
          style={{
            backgroundColor: "#f2f2f2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "5px",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>Employee Profile</span>
          <button
            onClick={onClose}
            style={{
              color: "red",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "30px",
              width: "40px",
            }}
            className="close-profile-popup-btn"
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: "25px" }}></i>
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
            <img src={profileImage || dummyUserImg} className="employee-profile-img" alt="Profile" />
          </div>
          <div>
            <input
              type="text"
              className="m-0 border px-2 py-1 rounded"
              value={employeeData?.name || ""}
              onChange={(e) => onUpdateName({ ...employeeData, name: e.target.value })}
            />
            <p className="m-1">Job Role : {employeeData.jobRole}</p>
            <p className="m-1">Official Email : {employeeData.officialMail}</p>
            <p className="m-1">Official Contact : {employeeData.officialContactNo}</p>
            <p className="m-1">Gender : {employeeData.gender}</p>
            <p className="m-1">
              Employee Status :
              <span
                style={{
                  color: employeeData?.status === "Active" ? "green" : "inherit",
                  fontWeight: employeeData?.status === "Active" ? "bold" : "normal",
                }}
              >
                {employeeData?.status}
              </span>
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
          <button onClick={onViewMore} className="display-more-profile-btn daily-tr-btn">
            View More
          </button>
          <button onClick={() => onUpdateName(employeeData)} className="display-more-profile-btn daily-tr-btn">
            Update Name
          </button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default EmployeeProfileModal;
