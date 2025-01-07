/* Name:-Prachi Parab Component:-Line Up Data Report data page 
         End LineNo:-4 to 124 Date:-05/07 */

import React, { useState, useEffect } from "react";
import "../Reports/LineUpDataReport.css";

const ShortListedCandidates = ({ filteredLineUpItems }) => {
  console.log(filteredLineUpItems);

  return (
    <div className="calling-list-container">
      <div className="search">
        <i
          className="fa-solid fa-magnifying-glass"
          //   onClick={() => setShowSearchBar(!showSearchBar)}
          style={{ margin: "10px", width: "auto", fontSize: "15px" }}
        ></i>

        <h5 style={{ color: "gray", paddingTop: "5px" }}>
          Shortlisted Candidate
        </h5>

        <div
          style={{
            display: "flex",
            gap: "5px",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "5px",
          }}
        ></div>
      </div>

      <table id="shortlisted-table-id" className="attendance-table">
        <thead>
          <tr className="attencerows-head">
            <th className="attendenceheading">
              <input type="checkbox" name="selectAll" />
            </th>
            <th className="attendanceheading"> No.</th>
            <th className="attendanceheading">Date</th>
            <th className="attendanceheading">Time</th>
            <th className="attendanceheading">Candidate's Id</th>
            <th className="attendanceheading">Recruiter's Name</th>
            <th className="attendanceheading">Candidate's Name</th>
            <th className="attendanceheading">Candidate's Email</th>
            <th className="attendanceheading">Contact Number</th>
            <th className="attendanceheading">Whatsapp Number</th>
            <th className="attendanceheading">Source Name</th>
            <th className="attendanceheading">Job Designation</th>
            <th className="attendanceheading">Job Id</th>
            <th className="attendanceheading">Applying Company</th>
            <th className="attendanceheading">Communication Rating</th>
            <th className="attendanceheading">Current Location</th>
            <th className="attendanceheading">Full Address</th>
            <th className="attendanceheading">Calling Remark</th>
            <th className="attendanceheading">Recruiter's Incentive</th>
            <th className="attendanceheading">Interested or Not</th>
            <th className="attendanceheading">Current Company</th>
            <th className="attendanceheading">Total Experience</th>
            <th className="attendanceheading">Relevant Experience</th>
            <th className="attendanceheading">Current CTC</th>
            <th className="attendanceheading">Expected CTC</th>
            <th className="attendanceheading">Date Of Birth</th>
            <th className="attendanceheading">Gender</th>
            <th className="attendanceheading">Education</th>
            <th className="attendanceheading">Year Of Passing</th>
            <th className="attendanceheading">Call Summary</th>
            <th className="attendanceheading">Holding Any Offer</th>
            <th className="attendanceheading">Offer Letter Message</th>
            <th className="attendanceheading">Resume</th>
            <th className="attendanceheading">Notice Period</th>
            <th className="attendanceheading">Message For Team Leader</th>
            <th className="attendanceheading">Interview Slot</th>
            <th className="attendanceheading">Interview Time</th>
            <th className="attendanceheading">Final Status</th>
            <th className="attendanceheading">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLineUpItems.map((item) => (
            <tr key={item.id} className="attendancerows">
              <td>{item.id}</td>
              <td>{item.date}</td>
              <td>{item.candidateAddedTime}</td>
              <td></td>
              <td>{item.candidateId}</td>
              <td>{item.recruiterName}</td>
              <td>{item.candidateName}</td>
              <td>{item.candidateEmail}</td>
              <td>{item.contactNumber}</td>
              <td>"wathsapp number"</td>
              <td>{item.sourceName}</td>
              <td>{item.jobDesignation}</td>
              <td>{item.requirementId}</td>
              <td>{item.companyName}</td>
              <td>{item.communicationRating}</td>
              <td>{item.currentLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShortListedCandidates;
