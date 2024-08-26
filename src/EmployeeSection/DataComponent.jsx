import React, { useEffect, useState } from "react";
import axios from "axios";
import "../EmployeeSection/DataComponent.css";
import { toast } from "react-toastify";

const DataComponent = ({ onClose }) => {
  const [target, setTarget] = useState({ targetValue: 10, archived: 0 });
  const [pendings, setPendings] = useState(target.targetValue);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);

  const handleUpdate = () => {
    setTarget((prevTarget) => ({
      ...prevTarget,
      archived: prevTarget.archived + 1,
    }));
    setPendings((prevPendings) => prevPendings - 1);
  };

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    setDate(formatDate(currentDate));
  }, []);

  useEffect(() => {
    if (target.archived === target.targetValue) {
      toast.success("Target is completed");
    }
  }, [target.archived, target.targetValue]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="data-table-div">
      <table className="data-table">
        <tr style={{ padding: "13px" }}>
          <th
            style={{
              padding: "6px",
              border: "2px solid gray",
              backgroundColor: "#ffcbgb",
            }}
          >
            Daily Target
          </th>
          <td
            style={{
              padding: "6px",
              border: "2px solid gray",
              backgroundColor: "white",
            }}
          >
            {target.targetValue}
          </td>

          <th
            style={{
              padding: "6px",
              border: "2px solid gray",
              backgroundColor: "#ffcbgb",
            }}
          >
            Archived
          </th>
          <td
            style={{
              padding: "6px",
              border: "2px solid gray",
              backgroundColor: "white",
            }}
          >
            {target.archived}
          </td>

          <th
            style={{
              padding: "6px",
              border: "2px solid gray",
              backgroundColor: "#ffcbgb",
            }}
          >
            Pendings
          </th>
          <td
            style={{
              padding: "6px",
              border: "2px solid gray",
              backgroundColor: "white",
            }}
          >
            {pendings}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default DataComponent;
