import React, { useState, useEffect } from "react";
import PayrollTable from "./payRollTable";
import PayRollForm from "./payRollForm";
import axios from "axios";
import { API_BASE_URL } from "../api/api";


const PayRollMain = () => {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/findAll-all-payrolls`
        );
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const addEmployee = (employee) => {
    setEmployees([...employees, employee]);
  };

  return (
    <div className="app">
      <PayRollForm addEmployee={addEmployee} />
      <PayrollTable employees={employees} />
    </div>
  );
};
export default PayRollMain;
