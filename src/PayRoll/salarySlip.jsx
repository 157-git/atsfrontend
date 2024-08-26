// src/components/SalarySlip.js
import React from 'react';
import '../PayRoll/salarySlip.css';

const SalarySlip = ({ employee }) => {
    return (
        <div className="salary-slip">
            <h2>Salary Slip for {employee.empName}</h2>
            <p><strong>ID:</strong> {employee.empId}</p>
            <p><strong>Name:</strong> {employee.empName}</p>
            <p><strong>Department:</strong> {employee.empDept}</p>
            <p><strong>Position:</strong> {employee.jobRole}</p>
            <p><strong>Basic Salary:</strong> ${employee.basicSalary}</p>
            <p><strong>Per Day Salary:</strong> ${employee.perDaySalary}</p>
            <p><strong>Days Present:</strong> {employee.daysPresent}</p>
            <p><strong>Bonuses:</strong> ${employee.bonuses}</p>
            <p><strong>Deductions:</strong> ${employee.deductions}</p>
            <p><strong>Total Salary:</strong> ${employee.totalSalary}</p>
        </div>
    );
};

export default SalarySlip;

