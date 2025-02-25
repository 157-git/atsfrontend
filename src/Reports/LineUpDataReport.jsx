/* Name:-Prachi Parab Component:-Line Up Data Report data page 
         End LineNo:-4 to 124 Date:-05/07 */
import React, { useState, useEffect } from "react";
import "../Reports/LineUpDataReport.css";
import { Avatar, Card, List, Pagination } from "antd";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";

const ShortListedCandidates = ({
  filteredLineUpItems,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const calculateRowIndex = (index) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

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
    <div
      className="calling-list-container"
      style={{
        height: "fit-content",
      }}
    >
      <div
        className="attendanceTableData"
        style={{
          height: "fit-content",
          maxHeight: "50vh",
          overflow: "scroll",
        }}
      >
        <table id="shortlisted-table-id" className="attendance-table">
          <thead>
            <tr className="attendancerows-head">
              <th className="attendanceheading"> No.</th>
              <th className="attendanceheading">Candidate's Id</th>
              <th className="attendanceheading">Added Date Time</th>
              <th className="attendanceheading">Recruiter's Name</th>
              <th className="attendanceheading">Candidate's Name</th>
              <th className="attendanceheading">Candidate's Email</th>
              <th className="attendanceheading">Contact Number</th>
              <th className="attendanceheading">Source Name</th>
              <th className="attendanceheading">Job Designation</th>
              <th className="attendanceheading">Job Id</th>
              <th className="attendanceheading">Applying Company</th>
              <th className="attendanceheading">Current Location</th>
              <th className="attendanceheading">Interested or Not</th>
              <th className="attendanceheading">Current Company</th>
              <th className="attendanceheading">Total Experience</th>
              <th className="attendanceheading">Relevant Experience</th>
              <th className="attendanceheading">Current CTC</th>
              <th className="attendanceheading">Expected CTC</th>
              <th className="attendanceheading">Holding Any Offe</th>
              <th className="attendanceheading">Notice Period</th>
              <th className="attendanceheading">Availability For Interview</th>
              <th className="attendanceheading">Profile Status</th>
              <th className="attendanceheading">Final Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLineUpItems.map((item, index) => (
              <tr key={item.candidateId} className="attendancerows">
                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {calculateRowIndex(index)}
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {calculateRowIndex(index)}
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.candidateId}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.candidateId}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.date} {item.candidateAddedTime}
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {item.date} {item.candidateAddedTime}
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.recruiterName}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.recruiterName}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.candidateName}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.candidateName}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.candidateEmail}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.candidateEmail}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.contactNumber}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.contactNumber}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.sourceName}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.sourceName}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.jobDesignation}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.jobDesignation}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.requirementId}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.requirementId}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.requirementCompany}
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {item.requirementCompany}
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.currentLocation}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.currentLocation}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.selectYesOrNo}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.selectYesOrNo}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.companyName}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.companyName}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.experienceYear} Year {item.experienceMonth} Month
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {item.experienceYear} Year {item.experienceMonth} Month
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.relevantExperience}
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {item.relevantExperience}
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.currentCTCLakh} Lakh {item.currentCTCThousand} Thousand
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {item.currentCTCLakh} Lakh {item.currentCTCThousand}{" "}
                      Thousand
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.expectedCTCLakh} Lakh {item.expectedCTCThousand}{" "}
                  Thousand
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {item.expectedCTCLakh} Lakh {item.expectedCTCThousand}{" "}
                      Thousand
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.holdingAnyOffer}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.holdingAnyOffer}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.noticePeriod}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.noticePeriod}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.availabilityForInterview}
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {item.availabilityForInterview}
                    </span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.profileStatus}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.profileStatus}</span>
                  </div>
                </td>

                <td
                  className="tabledata"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {item.finalStatus}
                  <div className="tooltip">
                    <span className="tooltiptext">{item.finalStatus}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        showSizeChanger
        pageSizeOptions={["10", "20", "50", "100"]}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
        showQuickJumper
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />
      </div>
    </div>
  );
};

export default ShortListedCandidates;
