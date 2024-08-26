
// src/components/PrintPayroll.js
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import PayrollTable from '../PayRoll/payRollTable';
// import './PrintPayroll.css';

const PrintPayroll = ({ employees }) => {
  const tableRef = useRef();

  return (
    <div className="print-payroll">
      <ReactToPrint
        trigger={() => <button>Print Payroll</button>}
        content={() => tableRef.current}
      />
      <PayrollTable ref={tableRef} employees={employees} />
    </div>
  );
};

export default PrintPayroll;
