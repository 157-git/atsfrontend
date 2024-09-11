import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";

const Incentive = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeId, userType } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/fetch-incentive/${employeeId}/${userType}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId, userType]);

  //Arshad_Attar_ IncentiveTable_Dates_Calculations_LineNo_30 to 35 25/07/2024
  const calculateAfter90DaysDate = (joinDate) => {
    const date = new Date(joinDate);
    date.setDate(date.getDate() + 90);
    return date.toISOString().split('T')[0];
  };


  //Arshad_Attar_ IncentiveTable_Dates_Calculations_LineNo_38 to 48 25/07/2024
  const calculateRemainingDays = (futureDateString) => {
    const futureDate = new Date(futureDateString);
    const future = new Date(Date.UTC(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate()));
    const currentDate = new Date(); 
    const diffTime = Math.abs(currentDate.getTime() - future.getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    diffDays = diffDays <= 0 ? 0 : diffDays;
    return diffDays;
  };
  
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const grantTotalIncentives = data.reduce(
    (total, row) => total + row.incentive,
    0
  );

  const grantTotalYourIncentives = data
    .filter((row) => row.activeStatus === "Active")
    .reduce((total, row) => total + row.yourIncentives, 0);

  const grantTotalLossIncentives =
    grantTotalIncentives - grantTotalYourIncentives;

  const handleMouseOver = (event) => {
    const tableData = event.currentTarget;
    const tooltip = tableData.querySelector(".tooltip");
    const tooltiptext = tableData.querySelector(".tooltiptext");

    if (tooltip && tooltiptext) {
      const textOverflowing =
        tableData.offsetWidth < tableData.scrollWidth ||
        tableData.offsetHeight < tableData.scrollHeight;
      if (textOverflowing) {
        const rect = tableData.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 100}px`;
        tooltip.style.visibility = "visible";
      } else {
        tooltip.style.visibility = "hidden";
      }
    }
  };

  const handleMouseOut = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    if (tooltip) {
      tooltip.style.visibility = "hidden";
    }
  };

  return (
    <div className="container-after1">
      <div className="attendanceTableData">
        <table className="attendance-table">
          <thead>
            <tr className="attendancerows-head">
              <th className="attendanceheading">Candidate ID</th>
              <th className="attendanceheading"> Candidate Name</th>
              <th className="attendanceheading">Company Name</th>
              <th className="attendanceheading">Job ID</th>
              <th className="attendanceheading">Position</th>
              <th className="attendanceheading">Joining Date</th>
              <th className="attendanceheading">Last Call Date</th>
              <th className="attendanceheading">After 90 Days Date</th>
              <th className="attendanceheading">Remaining Days</th>
              <th className="attendanceheading">Candidate Status</th>
              <th className="attendanceheading">Your Incentive</th>
              <th className="attendanceheading">Incentive Received/Not</th>
            </tr>
          </thead>
          <tbody>

            {data.map((row, index) => {
              //Arshad_Attar_ IncentiveTable_Dates_Calculations_LineNo_118 to 119 25/07/2024
              const after90DaysDate = calculateAfter90DaysDate(row.joinDate); // Assuming this returns a string in YYYY-MM-DD format
              const remainingDays = calculateRemainingDays(after90DaysDate);
              return (
                <tr key={row.id} className="attendancerows">
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.candidateId}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.candidateId}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.candidateName}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.candidateName}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.requirementCompany}
                    <div className="tooltip">
                      <span className="tooltiptext">
                        {row.requirementCompany}
                      </span>
                    </div>
                  </td>

                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.requirementId}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.requirementId}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.jobDesignation}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.jobDesignation}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.joinDate}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.joinDate}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.callDate}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.callDate}</span>
                    </div>
                  </td>


                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {after90DaysDate}
                    <div className="tooltip">
                      <span className="tooltiptext">{after90DaysDate}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {remainingDays}
                    <div className="tooltip">
                      <span className="tooltiptext">{remainingDays}</span>
                    </div>
                  </td>

                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.activeStatus}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.activeStatus}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.yourIncentives}
                    <div className="tooltip">
                      <span className="tooltiptext">{row.yourIncentives}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {row.Incentive_Received_Not}
                    <div className="tooltip">
                      <span className="tooltiptext">
                        {row.Incentive_Received_Not}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="attendancerows">
              <td
                colSpan="9"
                style={{ textAlign: "left" }}
                className="tabledata"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >

                Grant Total Incentives
                <div className="tooltip">
                  <span className="tooltiptext"></span>
                </div>
              </td>
              <td
                colSpan="3"
                style={{ textAlign: "left" }}
                className="tabledata"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                {grantTotalIncentives}
                <div className="tooltip">
                  <span className="tooltiptext"></span>
                </div>
              </td>
            </tr>
            <tr className="total-row">
              <td
                colSpan="9"
                style={{ textAlign: "left" }}
                className="tabledata"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Grant Total Loss Incentives
                <div className="tooltip">
                  <span className="tooltiptext"></span>
                </div>
              </td>
              <td
                colSpan="3"
                style={{ textAlign: "left" }}
                className="tabledata"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                {grantTotalLossIncentives}
                <div className="tooltip">
                  <span className="tooltiptext">
                    {grantTotalLossIncentives}
                  </span>
                </div>
              </td>
            </tr>
            <tr className="total-row">
              <td
                colSpan="9"
                style={{ textAlign: "left" }}
                className="tabledata"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Grant Total Your Incentives
              </td>
              <td
                colSpan="3"
                style={{ textAlign: "left" }}
                className="tabledata"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                {grantTotalYourIncentives}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Incentive;
