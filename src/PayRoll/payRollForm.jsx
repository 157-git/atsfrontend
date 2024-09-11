import React, { useEffect, useState } from "react";
import { addEmployee as addEmployeeService } from "../api/api";
import "../PayRoll/payRollForm.css";
import { toast } from "react-toastify";

const roleSalaries = {
  Admin: 3000,
  Recruiter: 2500,
  TeamLeader: 3500,
  SuperUser: 4000,
};

const PayRollForm = ({ addEmployee }) => {
  const [employee, setEmployee] = useState({
    empId: "",
    empName: "",
    empDept: "Development",
    jobRole: "Admin",
    basicSalary: "",
    bonuses: "",
    deductions: "",
    perDaySalary: "",
    daysPresent: "",
    totalSalary: "",
  });

  useEffect(() => {
    const basicSalary = roleSalaries[employee.jobRole] || 0;
    setEmployee((prev) => ({
      ...prev,
      basicSalary: basicSalary,
    }));
  }, [employee.jobRole]);

  useEffect(() => {
    const totalSalary =
      (parseFloat(employee.perDaySalary) || 0) *
        (parseInt(employee.daysPresent) || 0) +
      (parseFloat(employee.bonuses) || 0) -
      (parseFloat(employee.deductions) || 0);
    setEmployee((prev) => ({
      ...prev,
      totalSalary,
    }));
  }, [
    employee.perDaySalary,
    employee.daysPresent,
    employee.bonuses,
    employee.deductions,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addEmployeeService(employee);
      console.log(response.data);
      addEmployee(response.data);
      setEmployee({
        empId: "",
        empName: "",
        empDept: "Development",
        jobRole: "Admin",
        basicSalary: "",
        bonuses: "",
        deductions: "",
        perDaySalary: "",
        daysPresent: "",
        totalSalary: "",
      });
      toast.success("Employee Added successfully"); ////Swapnil Error&success message
    } catch (error) {
      toast.error("Error adding employee:", error); //Swapnil Error&success message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <div className="form-header">Pay Roll Form</div>
      <div className="payrolemain">
        <div className="payrollfields">
          <label htmlFor="id">ID</label>
          <input
            name="empId"
            id="id"
            placeholder="ID"
            value={employee.empId}
            onChange={handleChange}
            required
          />

          <label htmlFor="name">Name</label>
          <input
            name="empName"
            id="name"
            placeholder="Name"
            value={employee.empName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="payrollfields">
          <label htmlFor="department">Department</label>
          <select
            name="empDept"
            id="department"
            value={employee.empDept}
            onChange={handleChange}
          >
            <option value="Development">Development</option>
            <option value="Recruitment">Recruitment</option>
            <option value="BPO">BPO</option>
            <option value="Production">Production</option>
          </select>

          <label htmlFor="position">Job Role</label>
          <select
            name="jobRole"
            id="position"
            value={employee.jobRole}
            onChange={handleChange}
          >
            <option value="Admin">Admin</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Team Leader">Team Leader</option>
            <option value="Super User">Super User</option>
          </select>
        </div>

        <div className="payrollfields">
          <label htmlFor="basicSalary">Basic Salary</label>
          <input
            name="basicSalary"
            id="basicSalary"
            placeholder="Basic Salary"
            type="number"
            value={employee.basicSalary}
            onChange={handleChange}
            readOnly
          />
          <label htmlFor="perDaySalary">Per Day Salary</label>
          <input
            name="perDaySalary"
            id="perDaySalary"
            placeholder="Per Day Salary"
            type="number"
            value={employee.perDaySalary}
            onChange={handleChange}
          />
        </div>

        <div className="payrollfields">
          <label htmlFor="daysPresent">Days Present</label>
          <input
            name="daysPresent"
            id="daysPresent"
            placeholder="Days Present"
            type="number"
            value={employee.daysPresent}
            onChange={handleChange}
          />
          <label htmlFor="bonuses">Bonuses</label>
          <input
            name="bonuses"
            id="bonuses"
            placeholder="Bonuses"
            type="number"
            value={employee.bonuses}
            onChange={handleChange}
          />
        </div>

        <div className="payrollfields">
          <label htmlFor="deductions">Deductions</label>
          <input
            name="deductions"
            id="deductions"
            placeholder="Deductions"
            type="number"
            value={employee.deductions}
            onChange={handleChange}
          />

          <label htmlFor="totalSalary">Total Salary</label>
          <input
            name="totalSalary"
            id="totalSalary"
            placeholder="Total Salary"
            type="number"
            value={employee.totalSalary}
            onChange={handleChange}
            readOnly
          />
        </div>
      </div>
      <div className="payrolemainbtn">
        <button className="payrolebutton" type="submit">
          Add Employee
        </button>
      </div>
    </form>
  );
};

export default PayRollForm;
