// Prachi Parab  component :Rights + instructions + best view + information  19/07/2024 wholepage


import React, { useRef } from 'react';
import '../AboutUs/rightsandInstructions.css';
import { useReactToPrint } from 'react-to-print';

const RightsAndInstructions = () => {
  const policyRef = useRef();
  const handleGeneratePDF = async () => {
    const issueContainer = document.getElementById('issue-containers');
    const canvas = await html2canvas(issueContainer, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;  // Set margin size (in points)
    const borderWidth = 1;  // Set border width (in points)
    const contentWidth = pdfWidth - 2 * margin;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.setLineWidth(borderWidth);

    let page = 1;
    while (heightLeft > 0) {
      if (page > 1) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
      pdf.rect(margin, margin, contentWidth, pdfHeight - 2 * margin);  // Add border

      heightLeft -= (pdfHeight - 2 * margin);
      position -= (pdfHeight - 2 * margin);  // Adjust position for next page

      page++;
    }

    // Saving the PDF
    pdf.save('Instructions.pdf');
  };


  const handlePrint = useReactToPrint({
    content: () => policyRef.current,
    documentTitle: 'WorkplacePolicy',
  });


  return (
    <div className='rightsandInstructions'>

      <div ref={policyRef} className="issue-containers" id='issue-containers'>

        <div id='instructions' className='rightsandInstructionsdiv'>
          <div className="policy-header">
            <h3 >Instructions</h3>
          </div>
          <p className='Instruction-soft'>
            <ul>

              <li> <span className='innerText'>Strictly use your assigned credentials to access the software platform.Multiple attempts on different devices will block System.</span></li>
              <li> <span className='innerText'> Familiarize yourself with the dashboard and navigation menus for easy access to different functionalities.</span></li>
              <li><span className='innerText'>After Login, you can find four segments 1.Client 2.Employee 3.Applicants 4.Vendor </span></li>

              <span className='headingPage'>1. Client</span>


              <li className='liststyletype'><span className='headingPage'>2. Employee</span>

                <li className='liststyletype'><span className='innerText'> After clicking Employee Section,it displays Recruiter, TeamLeader, Manager, Super User categories.</span></li>

              </li>
              <li className='liststyletype'> <span className='headingPage'>A. Recruiter</span>
                <li className='liststyletype'> <span className='headingPage'>Login:</span><span className='innerText'>Strictly use your recruiter's credentials to access the software platform.Multiple attempts on different devices will block System.</span></li>
                <li className='liststyletype'> <span className='innerText'>After Login, Navigation menus on the dashboard - </span>

                  <li> <span className='headingPage'>Job Description </span>-
                    <span className='innerText'>
                      Look for a "Job Description" button and click on it. It will display submenus 1.Add Job Description and 2. view Job Description.<br></br>
                      1.On click of Add Job Description, form will display .Enter Company Name, position, year of passing,and any other relevant details. Click on Submit to add them to your database.
                      <br></br>2.On click of view Job Description ,we can find jobs by designation, by experience also by location.
                      On Click of search button, display popup of relevant Job Description.
                    </span></li>
                  <li > <span className='headingPage'>Add Candidate </span>-
                    <span className='innerText'>
                      Look for an "Add Candidate" button and click on it.It will display a form. Enter the candidate’s name, contact information, resume, cover letter, and any other relevant details.Link the candidate to a specific job Id.Save the candidate’s profile to add them to your database.
                    </span></li>
                  <li> <span className='headingPage'>Find Candidate </span>-
                    <span className='innerText'>

                      It will popup five sub menus Calling Tracker, Lineup Tracker, Selected Candidate, Hold Candidate, Rejected Candidate.<br></br>
                      <span className='headingPage'>Calling Tracker </span>- It keeps track of all added Candidates. Here, We can filter candidate as per ID, name, email, contact number, Job Description, location, etc.<br></br>
                      <span className='headingPage'>Lineup Tracker</span> - When interview schedule as per client, particular Calling Tracker data added to Lineup page.<br></br>
                      <span className='headingPage'>Selected Candidate </span>- When candidate selected, LineUp candidate comes under selected candidate category. <br></br>
                      <span className='headingPage'>Hold Candidate </span>- When candidate on hold, LineUp candidate comes under hold candidate category.<br></br>
                      <span className='headingPage'>Rejected Candidate</span> - When candidate rejected, LineUp candidate comes under rejected candidate category.

                    </span></li>

                  <li > <span className='headingPage'>Database </span>-
                    <span className='innerText'>
                      Look at the button "Database", click on it to display submenus "Upload Files" ,"Excel Calling Data","ExcelLineup Data", "Resume Data", "Send Link" menu.
                      <br></br>
                      In Upload Files,we can find 3 sections - Upload Calling Excel(To upload bulk of Calling data excel file), Upload Lineup Excel(To upload bulk of Lineup data excel file),Upload Resume(To upload bulk of resumes).
                      <br></br>
                      On click of view button we can view relevant data in tabular form.<br></br>

                      <span className='headingPage'>Excel Calling Data</span>,it shows Calling data in tabular form.We can add different filter to it.<br></br>
                      <span className='headingPage'>Excel Lineup Data</span>,it shows Lineup data in tabular form.We can add different filter to it.<br></br>
                      <span className='headingPage'>Resume Data</span>,it shows Resume data in tabular form.We can add different filter to it.<br></br>
                      <span className='headingPage'>Send Link</span>,it sends a link to create and/or Upload Resume.
                    </span></li>
                </li>
              </li>
              <li className='liststyletype'> <span className='headingPage'>B. TeamLeader</span>

                <li className='liststyletype'><span className='headingPage'>Login:</span><span className='innerText'>  Use your assigned credentials to access the software platform.</span></li>
                <li className='liststyletype'><span className='innerText'>  Team Leader has authority to Update,Delete,Block candidate</span></li>

              </li>
              <li className='liststyletype'> &nbsp;<span className='headingPage'>C. Manager</span>

                <li className='liststyletype'> <span className='headingPage'>Login:</span><span className='innerText'>  Use your assigned credentials to access the software platform.</span></li>
                <li className='liststyletype'><span className='innerText'>  Manager has authority to Update,Delete,Block candidate also,can view reports of performance of recruiters,teamLeader.</span></li>
              </li>

              <li className='liststyletype'> &nbsp;<span className='headingPage'>D. Super User</span>

                <li className='liststyletype'><span className='headingPage'> Login:</span><span className='innerText'>  Use your assigned credentials to access the software platform.</span></li>
                <li className='liststyletype'><span className='innerText'> Super User has authority to Update,Delete,Block candidate also,can view reports of performance of Recruiters,TeamLeader,Manager.</span></li>

              </li>

              <li className='liststyletype'> <span className='headingPage'> 3. Applicant </span>

              </li>
              <li className='liststyletype'> <span className='headingPage'>4. Vendor</span>

                <li className='liststyletype'><span className='headingPage'>Login:</span> <span className='innerText'> Use your assigned credentials to access the software platform.</span></li>
                <li className='liststyletype'><span className='innerText'>  Vendor can add Candidate and keep track of it.</span></li>

              </li>

              <li><span className='innerText'> Database menu gives all uploaded resumes.</span></li>
              <li><span className='innerText'> Resume menu,creates resume for applicant.</span></li>
              <li><span className='innerText'> Based on attendence and over all work performance report will be generated.</span></li>
              <li><span className='innerText'> Chat section is added for internal chat.</span></li>


            </ul>


          </p>
        </div>

        <div id='bestView' className='rightsandInstructionsdiv'>
          <div className="policy-header">
            <h3 >Best View</h3>
          </div>


          <p className='Instruction-soft'>
            <ul>
              <li><span className='headingPage'>Job Listings </span></li>
              <li className='liststyletype'><span className='innerText'>

                Display job listings in a clear and concise manner with essential details.
                Filters and Sorting Allow recruiters to filter jobs by status, location, date posted, etc.
              </span>
              </li>
              <li><span className='headingPage'>Candidate Management </span></li>
              <li className='liststyletype'>
                <span className='innerText'>
                  Provide a detailed view of each candidate's profile including resume, contact details, and application history.
                </span>
              </li>

              <li><span className='headingPage'>Status Tracking </span></li>
              <li className='liststyletype'>
                <span className='innerText'>
                  Enable recruiters to track candidate progress (e.g., application stage, interview status) with clear visual indicators.
                </span>
              </li>



              <li><span className='headingPage'>Analytics and Reporting </span></li>
              <li className='liststyletype'>
                <span className='innerText'>
                  Provide insights into recruitment efficiency and effectiveness based on collected data.
                </span>
              </li>


              <li><span className='headingPage'>Automated Mails </span></li>
              <li className='liststyletype'>
                <span className='innerText'>
                  Send mail to recruiters and candidates about upcoming interviews.
                </span>
              </li>

              <li><span className='headingPage'>Security and Compliance </span></li>
              <li className='liststyletype'>
                <span className='innerText'>
                  Ensure robust security measures to protect sensitive candidate and client information.
                </span>
              </li>

            </ul>

          </p>
        </div>

        <div id='information' className='rightsandInstructionsdiv'>

          <div className="policy-header">
            <h3 >Information about Software</h3>
          </div>

          <span className='innerText'>
            <p className='Information-soft'>

              <p>

                An applicant tracking system (ATS) is software for recruiters and employers to track candidates throughout the recruiting and hiring process. This software can come equipped with capabilities ranging from simple database functionality to a full-service suite of tools that makes it easy for businesses of any size to filter, manage, and analyze candidates.
                Moving a candidate through the journey from first contact to start date can be a high-touch process. It can be all too easy to lose a top candidate because of slow response times or poor engagement around interview schedules. An ATS creates greater visibility across the applicant lifecycle, so touchpoints don’t fall through the cracks.
                An ATS creates opportunities to automate manual processes, increase visibility into the hiring cycle for the entire recruiting team, and increase opportunities for communication throughout the candidate journey.

              </p>
              <p>
                Recruiter Gear's Software display job listings in a clear and concise manner with essential details. Filters and Sorting Allow recruiters to filter jobs by status, location, date posted, etc. Also Provide a detailed view of each candidate's profile including resume, contact details, and application history. Enable recruiters to track candidate progress with clear visual indicators. Send mail to recruiters and candidates about upcoming interviews. In employee point of view, it displays the progress of all employees and show report by pie chart and by Progress Indicator.
              </p>

            </p>
          </span>
        </div>

        <div id='Rights' className='rightsandInstructionsdiv'>
          <div className="policy-header">
            <h3 >Rights and Responsibilities for Recruiter's Gear Software</h3>
          </div>
          <p className='Instruction-soft'>
            <ul>

              <h3 className='instr-headings'><span className='headingPage'>Access and Usage Rights</span></h3>

              <li className='liststyletype'>
                <ul>
                  <li><span className='headingPage'>Access: </span> <span className='innerText'> Users (employees of the recruitment company) have the right to access the software platform during their employment tenure.</span></li>
                  <li><span className='headingPage'>Usage:</span> <span className='innerText'>  Users are granted the right to use the software for the purpose of managing recruitment processes, including but not limited to:</span></li>
                  <ul>
                    <li> <span className='innerText'> Posting job openings</span></li>
                    <li> <span className='innerText'> Reviewing candidate applications</span></li>
                    <li> <span className='innerText'> Communicating with candidates and clients</span></li>
                    <li> <span className='innerText'> Managing candidate profiles and data</span></li>

                  </ul>
                  <li><span className='headingPage'>Accountability:</span> <span className='innerText'>  Users are accountable for maintaining the confidentiality and security of their login credentials. They must not share their credentials with unauthorized individuals.</span></li>
                </ul>

              </li>

              <h3 className='instr-headings'><span className='headingPage'>Data Handling and Privacy Rights</span></h3>
              <li className='liststyletype'>
                <ul>
                  <li><span className='headingPage'>Data Privacy:</span> <span className='innerText'>  The software ensures compliance with data protection regulations concerning the collection, storage, and processing of personal data of candidates and clients.</span></li>
                  <li><span className='headingPage'>Data Ownership:</span> <span className='innerText'>  The recruitment company retains ownership of all data entered into or generated by the software platform.</span></li>

                  <li><span className='headingPage'>Data Access: </span>  <span className='innerText'> Authorized personnel within the recruitment company have access to candidate and client data for recruitment purposes only.</span></li>
                </ul>

              </li>

              <h3 className='instr-headings'><span className='headingPage'>Responsibilities</span></h3>
              <li className='liststyletype'>
                <ul>
                  <li><span className='headingPage'>Compliance:</span>  <span className='innerText'> Users must comply with company policies, as well as local and international laws and regulations, while using the software platform.</span></li>
                  <li><span className='headingPage'>Data Integrity:</span> <span className='innerText'>  Users are responsible for ensuring the accuracy and integrity of data entered into the software. They must promptly update information as necessary.</span></li>

                  <li><span className='headingPage'>Security: </span> <span className='innerText'> Users must report any security incidents or suspected breaches promptly to the appropriate IT or security personnel.</span></li>
                </ul>

              </li>


            </ul>
          </p>
        </div>
      </div>
      <div className='handlePrintDiv'>
        <button className='issue-button' onClick={handlePrint}>Export PDF</button>
      </div>
    </div>
  );
};

export default RightsAndInstructions;