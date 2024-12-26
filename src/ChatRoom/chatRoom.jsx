import React, { useEffect, useState, useRef } from "react";
import '../ChatRoom/chatRoom.css';
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
// import { CHAT_BASE_URL } from "../api/api";
import { API_BASE_URL } from "../api/api";  

let stompClient = null;

const ChatRoom = () => {
  const CHAT_BASE_URL = "http://localhost:9092";
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [color] = useState("#ffcb9b");
  const [tab, setTab] = useState("CHATROOM");
  const [profileImage, setProfileImage] = useState(null);
  const [employeeData, setEmployeeData] = useState({});
  const [showAttachOptions, setShowAttachOptions] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
    file: null,
    fileType: "", // Added to track the file type
  });

  const { employeeId, userType } = useParams();
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    fetchUsername();
  }, []);

  useEffect(() => {
    if (userData.username && !userData.connected) {
      connect(userData.username);
    }
  }, [userData.username]);

  const fetchUsername = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/employeeName/${employeeId}/${userType}`
      );

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      const username = result.employeeName || result;
      setUserData((prevUserData) => ({
        ...prevUserData,
        username: username,
      }));
    } catch (error) {
      console.error("Failed to fetch username:", error);
    }
  };

  const connect = (username) => {
    let Sock = new SockJS(`${CHAT_BASE_URL}/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, () => onConnected(username), onError);
  };

  const onConnected = (username) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      connected: true,
    }));
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(`/user/${username}/private`, onPrivateMessage);
    userJoin(username);
  };

  const userJoin = (username) => {
    const chatMessage = {
      senderName: username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);

    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        setPublicChats((prevChats) => [...prevChats, payloadData]);
        break;
      case "FILE":
        if (payloadData.senderName !== userData.username) {
          if (payloadData.fileUrl) {
            setPublicChats((prevChats) => [
              ...prevChats,
              {
                senderName: payloadData.senderName,
                fileName: payloadData.fileName,
                fileUrl: payloadData.fileUrl,
                status: "FILE",
              },
            ]);
          }
        }
        break;
      default:
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      const list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.error("Error:", err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      message: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        file,
      }));
    }
  };

  const sendValue = () => {
    if (userData.message.trim() !== "") {
      sendMessage();
    }
    if (userData.file) {
      uploadFile();
    }
  };

  const sendMessage = () => {
    const messageData = {
      senderName: userData.username,
      message: userData.message,
      status: "MESSAGE",
    };
    stompClient.send("/app/message", {}, JSON.stringify(messageData));
    setUserData((prevUserData) => ({
      ...prevUserData,
      message: "",
    }));
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append("file", userData.file);
    formData.append("senderName", userData.username);

    fetch(`${CHAT_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("File uploaded successfully");

          const fileMessageData = {
            senderName: userData.username,
            fileName: userData.file.name,
            fileUrl: URL.createObjectURL(userData.file),
            status: "FILE",
          };
          stompClient.send("/app/message", {}, JSON.stringify(fileMessageData));

          setUserData((prevUserData) => ({
            ...prevUserData,
            file: null,
            fileType: "", // Reset fileType after sending
          }));
          setPublicChats((prevChats) => [
            ...prevChats,
            {
              senderName: userData.username,
              fileName: userData.file.name,
              fileUrl: URL.createObjectURL(userData.file),
            },
          ]);
        } else {
          console.error("Failed to upload file");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const openFile = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendValue();
    }
  };

  const toggleAttachOptions = () => {
    setShowAttachOptions((prev) => !prev);
  };
  {/* Mohini_chatRoom_Date_6/07/24 */ }

  const handleOptionSelect = (option) => {
    setShowAttachOptions(false);
    setUserData((prevUserData) => ({
      ...prevUserData,
      fileType: option, // Set the file type based on the selected option
    }));
    switch (option) {
      case "Document":
        fileInputRef.current.click();
        break;
      case "Gallery":
        galleryInputRef.current.click();
        break;
      default:
        break;
    }
  };
  {/* Mohini_chatRoom_Date_6/07/24 */ }


  return (
    <div className="chat-container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                onClick={() => {
                  setTab("CHATROOM");
                }}
                className={`member ${tab === "CHATROOM" && "active"}`}
              >
                Chatroom
              </li>
              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => {
                    setTab(name);
                  }}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-content">
            <ul className="chat-messages">
              {(tab === "CHATROOM" ? publicChats : privateChats.get(tab)).map((chat, index) => (
                <li
                  className={`message ${chat.senderName === userData.username && "self"}`}
                  key={index}
                >
                  {chat.senderName !== userData.username && (
                    <div className="avatar" style={{ marginLeft: "10px" }}>
                      {chat.senderName}
                    </div>
                  )}
                  {chat.message ? (
                    <div className="message-data" style={{ marginLeft: "10px", background: "#ffcb9b" }}>
                      {chat.message}
                    </div>
                  ) : (
                    <div className="file-data">
                      <p>File: {chat.fileName}</p>
                      <img src={chat.fileUrl} alt="" style={{ width: "100%", height: "200px" }} />
                      <button onClick={() => openFile(chat.fileUrl)}>Open File</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="send-message">
              <input
                type="text"
                className="input-message"
                placeholder="Enter the message"
                value={userData.message}
                onChange={handleMessage}
                onKeyPress={handleKeyPress}
              />
              <div className="chat-actions">
                <button className="send-btn" onClick={sendValue}>
                  <i className="fas fa-paper-plane"></i>
                </button>
                <button className="attach-btn" onClick={toggleAttachOptions}>
                  <i className="fas fa-paperclip"></i>
                </button>
                {/* Mohini_chatRoom_Date_6/07/24 */}
                {showAttachOptions && (
                  <div className="attach-options">
                    <ul>
                      <li className="document-button" onClick={() => handleOptionSelect("Document")}>Document</li>
                      <li className="gallery-button" onClick={() => handleOptionSelect("Gallery")}>Image</li>
                    </ul>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx" // Adjust file types as needed
                />
                <input
                  type="file"
                  ref={galleryInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg" // Adjust file types as needed
                />
                {/* Mohini_chatRoom_Date_6/07/24 */}

              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="register">
          <HashLoader
             color={`${localStorage.getItem("bgColor")}`}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
