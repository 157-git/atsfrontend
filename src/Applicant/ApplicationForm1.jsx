import React from 'react'
import "./AppForm.css";

const ApplicationForm1 = () => {
  return (
    <>
    <div className="main1">
  <div className="applicationHeadDiv">
    <h3 className="applicationhead">Application Form</h3>
    <p className="applicationdesc">Lorem ipsum dolor sit amet consectetur adipiscing elit tortor eu dolorol egestas
      morbi sem vulputate etiam facilisis pellentesque ut quis.</p>
  </div>
  <div className="firstDiv" style={{marginTop: 1}}>
    <h1 className="AdmissionAttxt" style={{fontStyle: 'bold'}}>Applicant's Basic Information</h1>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">Applicant's Full Name *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Your Full Name" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
          </svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <p className="p11">Applicant's Contact Number *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Contact Number" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M760-480q0-117-81.5-198.5T480-760v-80q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480h-80Zm-160 0q0-50-35-85t-85-35v-80q83 0 141.5 58.5T680-480h-80Zm198 360q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">Applicant's Email Address *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Your Email Address" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <p className="p11">Applicant's Current Location *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Current Location" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-440h80v-110h80v110h80v-190l-120-80-120 80v190Zm120 254q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="div11">
      <p className="p11">Gender *</p>
      <div className="flextdiv">
        <div className="radioinputgender">
          <input type="radio" id="html" name="gender" defaultValue="Male" />
          &nbsp; <label htmlFor="html">Male</label>
        </div>
        <div className="radioinputgender">
          <input type="radio" id="html" name="gender" defaultValue="Female" />
          &nbsp; <label htmlFor="html">Female</label>
        </div>
      </div>
      <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
    </div>
  </div>
  <div className="firstDiv">
    <h1 className="AdmissionAttxt">Employement Details</h1>
    <p className="p11">Current Salary</p>
    <div className="firstdivsubdiv1">
      <div className="div11 currSalary">
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Lakh" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Thousand" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <p className="p11">Expected Salary</p>
    <div className="firstdivsubdiv1">
      <div className="div11 currSalary">
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Lakh" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Thousand" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">Applicant's Education *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Your Highest Qualification" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <p className="p11">Applicant's Job Designation*</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Job Designation" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-200v-440 440-15 15Zm0 80q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v171q-18-13-38-22.5T800-508v-132H160v440h283q3 21 9 41t15 39H160Zm240-600h160v-80H400v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm20-208v-112h-40v128l86 86 28-28-74-74Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="div11">
      <p className="p11">Are You Holding Any Offer? *</p>
      <div className="flextdiv">
        <div className="radioinputgender">
          <input type="radio" id="html" name="offer" defaultValue="Male" />
          &nbsp; <label htmlFor="html">Yes</label>
        </div>
        <div className="radioinputgender">
          <input type="radio" id="html" name="offer" defaultValue="Female" />
          &nbsp; <label htmlFor="html">No</label>
        </div>
      </div>
      <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
    </div>
  </div>
  <div className="firstDiv">
    <h1 className="AdmissionAttxt">Job Purpose And Prefrences</h1>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">Applicant's Preferred Location *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Preferred Location" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-301q99-80 149.5-154T680-594q0-90-56-148t-144-58q-88 0-144 58t-56 148q0 65 50.5 139T480-301Zm0 101Q339-304 269.5-402T200-594q0-125 78-205.5T480-880q124 0 202 80.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM200-80v-80h560v80H200Zm280-520Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <p className="p11">Applicant's Notice Period *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Notice Period" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">Total Experience (Years) *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Total Experience" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-280q-17 0-29.5-12.5T438-322q0-17 12.5-29.5T480-364q17 0 29.5 12.5T522-322q0 17-12.5 29.5T480-280Zm-30-128q0-46 7.5-63t42.5-47q14-14 24-27.5t10-30.5q0-18-13.5-32T480-622q-27 0-41 15.5T420-574l-54-22q12-35 41-59.5t73-24.5q47 0 80.5 25.5T594-578q0 24-12 45t-30 39q-30 30-36 42t-6 44h-60ZM280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm0-80h400v-480H280v480Zm0-560h400v-40H280v40Zm0 0v-40 40Zm0 640v40-40Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <p className="p11">Relevant Experience *</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Relevant Experience" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-280q-17 0-29.5-12.5T438-322q0-17 12.5-29.5T480-364q17 0 29.5 12.5T522-322q0 17-12.5 29.5T480-280Zm-30-128q0-46 7.5-63t42.5-47q14-14 24-27.5t10-30.5q0-18-13.5-32T480-622q-27 0-41 15.5T420-574l-54-22q12-35 41-59.5t73-24.5q47 0 80.5 25.5T594-578q0 24-12 45t-30 39q-30 30-36 42t-6 44h-60ZM280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm0-80h400v-480H280v480Zm0-560h400v-40H280v40Zm0 0v-40 40Zm0 640v40-40Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">Availability For Interview</p>
        <div className="flextdiv">
          <input className="input1class" type="date" name id placeholder="Availability For Interview" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-800q134 0 227 93t93 227q0 134-93 227t-227 93q-134 0-227-93t-93-227q0-134 93-227t227-93Zm0 560q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Zm0-100q48 0 86-27.5t54-72.5H340q16 45 54 72.5t86 27.5ZM340-560q0 17 11.5 28.5T380-520q17 0 28.5-11.5T420-560q0-17-11.5-28.5T380-600q-17 0-28.5 11.5T340-560Zm200 0q0 17 11.5 28.5T580-520q17 0 28.5-11.5T620-560q0-17-11.5-28.5T580-600q-17 0-28.5 11.5T540-560ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40ZM240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720Zm120-680v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80ZM480-480Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
      <div className="div11">
        <p className="p11">Expected Joining Date</p>
        <div className="flextdiv">
          <input className="input1class" type="date" name id placeholder="Enter Contact Number" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-800q134 0 227 93t93 227q0 134-93 227t-227 93q-134 0-227-93t-93-227q0-134 93-227t227-93Zm0 560q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Zm0-100q48 0 86-27.5t54-72.5H340q16 45 54 72.5t86 27.5ZM340-560q0 17 11.5 28.5T380-520q17 0 28.5-11.5T420-560q0-17-11.5-28.5T380-600q-17 0-28.5 11.5T340-560Zm200 0q0 17 11.5 28.5T580-520q17 0 28.5-11.5T620-560q0-17-11.5-28.5T580-600q-17 0-28.5 11.5T540-560ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40ZM240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720Zm120-680v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80ZM480-480Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
  </div>
  <div className="firstDiv">
    <h1 className="AdmissionAttxt">Additional Information</h1>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">Have You Done Any Courses and Certificates?</p>
        <div className="flextdiv">
          <input className="input1class" type="text" name id placeholder="Enter Your Certifications" />
          <svg className="svgimg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-440v80h640v-80H160Zm0-440h640q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H640v200l-160-80-160 80v-200H160q-33 0-56.5-23.5T80-360v-440q0-33 23.5-56.5T160-880Zm0 320h640v-240H160v240Zm0 200v-440 440Z" /></svg>
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">What motivated you to apply for this position?</p>
        <div className="flextdiv">
          <textarea className="textareaadditional" placeholder="Type Here..." name id defaultValue={""} />
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">How do you prioritize your tasks when working on multiple projects?
        </p>
        <div className="flextdiv">
          <textarea className="textareaadditional" placeholder="Type Here..." name id defaultValue={""} />
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
    <div className="firstdivsubdiv1">
      <div className="div11">
        <p className="p11">How do you prioritize your tasks when working on multiple projects?
        </p>
        <div className="flextdiv">
          <textarea className="textareaadditional" placeholder="Type Here..." name id defaultValue={""} />
        </div>
        <p className="requiredError">This Field Is Required<img src="error.svg" alt srcSet /></p>
      </div>
    </div>
  </div>
  <div className="buttondiv">
    <button className="applybtn">Apply Now →</button>
  </div>
</div>

    </>
  )
}

export default ApplicationForm1
