import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import SalarySlip from "./salarySlip.jsx";
import "../PayRoll/payRollTable.css";

const PayrollTable = ({ employees }) => {
  const slipRefs = useRef({});

  const handlePrint = useReactToPrint({
    content: () => slipRefs.current.currentEmployee,
  });

  return (
    <div className="payroll-table">
      <table className="payroll-table-layout">
        <thead>
          <tr className="payroll-table-heading">
            <th>Emp ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Job Role</th>
            <th>Basic Salary</th>
            <th>Per Day Salary</th>
            <th>Days Present</th>
            <th>Bonuses</th>
            <th>Deductions</th>
            <th>Total Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <React.Fragment key={employee.empId}>
              <tr className="payroll-table-data">
                <td>{employee.empId}</td>
                <td>{employee.empName}</td>
                <td>{employee.empDept}</td>
                <td>{employee.jobRole}</td>
                <td>{employee.basicSalary}</td>
                <td>{employee.perDaySalary}</td>
                <td>{employee.daysPresent}</td>
                <td>{employee.bonuses}</td>
                <td>{employee.deductions}</td>
                <td>{employee.totalSalary}</td>
                <td>
                  <button className="pay-print-btn"
                    onClick={() => {
                      slipRefs.current.currentEmployee =
                        slipRefs.current[employee.empId];
                      handlePrint();
                    }}
                  >
                    Pay & Print
                  </button>
                  <div style={{ display: "none" }}>
                    <div ref={(el) => (slipRefs.current[employee.empId] = el)}>
                      <SalarySlip employee={employee} />
                    </div>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
