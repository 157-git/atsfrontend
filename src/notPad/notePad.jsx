import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../notPad/notePad.css";
import { API_BASE_URL } from "../api/api";
// line 6 added by sahil karnekar date 23-10-2024
import { toast } from "react-toastify";

/* NotePad from line 01 to 244 Updated on 12-02-2025 By Krishna Kulkarni */
const NotePad = () => {
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [notePadData, setNotePadData] = useState([]);
  const [editMessageId, setEditMessageId] = useState(null);
  const [error, setError] = useState(null);
  const [requiredError, setRequiredError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotePadData();
  }, []);

  const { employeeId,userType } = useParams();
  const now = new Date();
  const Date1 = new Date().toISOString().slice(0, 10);
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const timeDate = Date1 + " " + time;

  const saveMessage = async (e) => {
    e.preventDefault();
    // line 37 to 42 added by sahil karnekar date 23-10-2024
    if (message.trim() === "") {
      setRequiredError("Please Enter Your Note ⚠️");
      return;
    } else if (message) {
      setRequiredError("");
    }

    const noteData = {
      message,
      timeDate,
      employeeId : employeeId,
      jobRole : userType
    };
    try {
      let url = editMessageId
        ? `${API_BASE_URL}/updateNoteData/${editMessageId}`
        : `${API_BASE_URL}/notes`;
      const response = await fetch(url, {
        method: editMessageId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
        setMessage(""); // Clear the textarea after saving
        fetchNotePadData(); // Fetch updated data after saving
        setEditMessageId(null); // Reset edit message ID after saving
        // line 70 to 73 added by sahil karnekar date 23-10-2024
        if (editMessageId) {
          toast.success("Note updated successfully!");
          document.getElementById("editModal").style.display = "none";
        }
      } else {
        throw new Error("Failed to save note");
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      setError("Failed to save note. Please try again later.");
    }
  };

  const fetchNotePadData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notesData/${employeeId}/${userType}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotePadData(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch NotePad data:", error);
      setError("Failed to fetch NotePad data. Please try again later.");
    }
  };

  const updateMessage = async (messageId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/updateNoteData/${messageId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMessage(data.message); // Populate the textarea with the message
      setEditMessageId(data.messageId); // Set the messageId for the edited note
      document.getElementById("editModal").style.display = "block";
    } catch (error) {
      console.error("Failed to fetch NotePad data:", error);
      setError("Failed to fetch NotePad data. Please try again later.");
    }
  };

  const deleteMessage = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/deleteNoteData/${messageId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setNotePadData(
          notePadData.filter((note) => note.messageId !== messageId)
        );
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError("Failed to delete note. Please try again later.");
    }
  };

  return (
    <div className="note-container ndewcontenerstyle">
      <div className="note-pad-form">
        <form
          className="note-form-div newmarginremoveform"
          onSubmit={saveMessage}
        >
          <textarea
            className="note-pad-text"
            placeholder="Enter your comment here........."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            cols="30"
            rows="10"
          ></textarea>
          {successMessage && (
            <div className="notepad-alert-success">
              Your Note Saved Successfully 😊!
            </div>
          )}
          {message === "" && (
            <div className="notepad-alert-success">{requiredError}</div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="note-submit-btn" type="submit">
            Save Comment
          </button>
        </form>
      </div>
      <div className="table-containe newstylingfortable1">
        <table className="notepad-table-data">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Message</th>
              <th>Time & Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {notePadData.map((note, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{note.message}</td>
                <td>{note.timeDate}</td>
                <td>
                  <button
                    className="note-submit-btn"
                    id="edit-btn"
                    onClick={() => updateMessage(note.messageId)}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="note-submit-btn"
                    id="dlt-btn"
                    onClick={() => deleteMessage(note.messageId)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
      )}
      <div id="editModal" className="notepad-modal">
        <div className="notepad-modal-content">
          <span
            className="close"
            onClick={() =>
              (document.getElementById("editModal").style.display = "none")
            }
          >
            &times;
          </span>
          <form className="note-pad-edit-form" onSubmit={saveMessage}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              cols="200"
              rows="10"
              // line 288 added by sahil karnekar date 23-10-2024
              style={{ width: "-webkit-fill-available" }}
            ></textarea>
            <button type="submit" className="note-submit-btn">
              Update Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotePad;
