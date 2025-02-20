 /* Name:-Prachi Parab Component:-Line Up Data Report data page 
         End LineNo:-4 to 124 Date:-05/07 */

         import React, { useState, useEffect } from 'react';
         import "../Reports/LineUpDataReport.css";

         
         const ShortListedCandidates=({filteredLineUpItems})=>{



             return(
                 <div className="calling-list-container"
                 style={{
                    height:"fit-content"
                 }}
                 >

                     <div className="attendanceTableData"
                     style={{
                        height:"fit-content",
                        maxHeight:"50vh",
    overflow:"scroll"
                     }}
                     >
                     <table id='shortlisted-table-id' className='attendance-table'>
                         <thead>
                             <tr className='attencerows-head'>
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
                         <th className="attendanceheading">Current CTC</th>
                         <th className="attendanceheading">Expected CTC</th>
                         <th className="attendanceheading">Holding Any Offe</th>
                         <th className="attendanceheading">Notice Period</th>
                         <th className="attendanceheading">Availability For Interview</th>
                         <th className="attendanceheading">Interview Status</th>
                        
                             </tr>
                         </thead>
                         <tbody>
                                    
                             {filteredLineUpItems.map(((item,index) =>(
                                 <tr key={item.id} className='attendancerows'>
                                     <td className="tabledata ">{index +1}</td>
                                     <td className="tabledata ">{item.candidateId}</td>
                                     <td className="tabledata ">{item.candidateAddedTime}</td>
                                     <td className="tabledata ">{item.recruiterName}</td>
                                     <td className="tabledata ">{item.candidateName}</td>
                                     <td className="tabledata ">{item.candidateEmail}</td>
                                     <td className="tabledata ">{item.contactNumber}</td>
                                     <td className="tabledata ">{item.sourceName}</td>
                                     <td className="tabledata ">{item.jobDesignation}</td>
                                     <td className="tabledata ">{item.requirementId}</td>
                                     <td className="tabledata ">{item.requirementCompany}</td> 
                                     <td className="tabledata ">{item.currentLocation}</td>
                                     <td className="tabledata ">{item.selectYesOrNo}</td>  
                                     <td className="tabledata ">{item.companyName}</td>
                                     <td className="tabledata ">{item.experienceYear +"Years" +item.experienceYear + "Months" }</td>
                                     <td className="tabledata ">{item.currentCTCLakh +"Lakh" +item.currentCTCThousand + "Thousand" }</td>
                                     <td className="tabledata ">{item.expectedCTCLakh +"Lakh" +item.expectedCTCThousand + "Thousand" }</td>
                                     <td className="tabledata ">{item.holdingAnyOffer}</td> 
                                     <td className="tabledata ">{item.noticePeriod}</td>
                                     <td className="tabledata ">{item.availabilityForInterview}</td>  
                                     <td className="tabledata ">{item.finalStatus}</td>
         
                                     
                                 </tr>
                             )))}
         
                         </tbody>
         
         
                     </table>
                     </div>


                   
         
                 </div>
             )
         };
         
         export default ShortListedCandidates;