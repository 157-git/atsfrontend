import React, { useState } from "react";
import "./JDTemplateGen.css";
import { Modal } from "antd";
import JobDescriptionEdm from "../JobDiscription/jobDescriptionEdm";
import ShareEDM from "../JobDiscription/shareEDM";
import ShareDescription from "../EmployeeDashboard/shareDescription";

const JDTemplateGen = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    designation: "",
    position: "",
    qualification: "",
    yearOfPassing: "",
    stream: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    bond: "",
    skills: "",
    shift: "",
    address: "",
    weekOff: "",
    noticePeriod: "",
    jobRole: "",
    perks: "",
    incentive: "",
    gender: "",
    ageCriteria: "",
    positionOverview: "",
    contactPerson: {
      name: "",
      email: "",
      mobile: "",
    },
    contactCompanyName: "",
    companyLogo: null,
  });

  const [responsibilities, setResponsibilities] = useState([""]);
  const [jobRequirements, setJobRequirements] = useState([""]);
  const [preferredQualifications, setPreferredQualifications] = useState([""]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isOpenEdm, setIsOpenEdm] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "companyLogo") {
      const file = files[0];
      setFormData({ ...formData, companyLogo: file });
      setLogoPreview(URL.createObjectURL(file));
    } else if (name.startsWith("contactPerson.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        contactPerson: { ...formData.contactPerson, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (index, value, array, setter) => {
    const updated = [...array];
    updated[index] = value;
    setter(updated);
  };

  const handleArrayDelete = (index, array, setter) => {
    const updated = array.filter((_, i) => i !== index);
    setter(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData, responsibilities, jobRequirements, preferredQualifications });
    alert("Form submitted! Check console.");
  };
  const handleOpenModals = (modalType) => {
    setOpenModal(true);
    setIsOpenEdm(modalType);
  }
  const handleonJobDescriptionEdm =async()=>{
    setIsOpenEdm("");
  }
  const commonEDMData = {
    designation: formData.designation,
    detailAddress: formData.address,
    employeeName: formData.contactPerson.name,
    experience: formData.experience,
    jobRole: formData.jobRole,
    jobType: formData.jobType,
    location: formData.location,
    noticePeriod: formData.noticePeriod,
    officialContactNo: formData.contactPerson.mobile,
    officialMail: formData.contactPerson.email,
    requirementId: 183,
    salary: formData.salary,
    shift: formData.shift,
    skills: formData.skills,
    weekOff: formData.weekOff,
    image: logoPreview
  };
  const fullBannerData = {
    ...formData,
    requirementId: 183,
    responsibilities: responsibilities.map((r) => ({ responsibilitiesMsg: r })),
    jobRequirements: jobRequirements.map((r) => ({ jobRequirementMsg: r })),
    preferredQualifications: preferredQualifications.map((r) => ({ preferredQualificationMsg: r })),
    positionOverview: { positionOverviewId: 6045, overview: formData.positionOverview, employeeId: 0 },
    detailAddress: formData.address,
    employeeName: formData.contactPerson.name,
    officialContactNo: formData.contactPerson.mobile,
    officialMail: formData.contactPerson.email,
    image: logoPreview
  };

  return (
    <>
    <form className="form-containerjdtemplate">
      <h2 className="head2tagforjdtemplate">Job Description Form</h2>

      <div className="form-gridjdtemplate">
        {["companyName","companyLink", "designation", "position", "qualification", "yearOfPassing",
          "stream", "location", "salary", "jobType", "experience", "bond", "skills",
          "shift", "address", "weekOff", "noticePeriod", "jobRole", "perks",
          "incentive", "gender", "ageCriteria"].map((field, idx) => {
            const formattedLabel = field
              .replace(/([A-Z])/g, " $1")         // add space before capital letters
              .replace(/^\w/, (c) => c.toUpperCase()); // capitalize first letter
          
            return (
              <div key={idx} className="form-fieldjdtemplate">
                <label className="inputlablesforjdtemplates" htmlFor={field}>{formattedLabel}</label>
                <input
                  id={field}
                  type="text"
                  name={field}
                  value={formData[field]}
                  placeholder={formattedLabel}
                  onChange={handleChange}
                  className="inputjdtemplate"
                />
              </div>
            );
          })}
        <div className="form-fieldjdtemplate">
        <label className="inputlablesforjdtemplates">positionOverview</label>
        <textarea
          name="positionOverview"
          value={formData.positionOverview}
          placeholder="Position Overview"
          onChange={handleChange}
          className="full-width textareajdtemplate"
        />
        </div>
      </div>

      {/* Dynamic Arrays */}
      {[{ label: "Responsibilities", state: responsibilities, setState: setResponsibilities },
        { label: "Job Requirements", state: jobRequirements, setState: setJobRequirements },
        { label: "Preferred Qualifications", state: preferredQualifications, setState: setPreferredQualifications },
      ].map(({ label, state, setState }, i) => (
        <div key={i}>
          <h4 className="head4tagforjdtemplate">{label}</h4>
          {state.map((val, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={val}
                onChange={(e) => handleArrayChange(index, e.target.value, state, setState)}
                placeholder={`${label} ${index + 1}`}
                className="inputjdtemplate"
              />
              <button type="button" onClick={() => handleArrayDelete(index, state, setState)} className="delete-btnjdtemplate">❌</button>
            </div>
          ))}
          <button className="buttonjdtemplate" type="button" onClick={() => setState([...state, ""])}>+ Add {label}</button>
        </div>
      ))}

      {/* Contact Person */}
      <h4 className="head4tagforjdtemplate">Contact Person</h4>
      <input
        type="text"
        name="contactPerson.name"
        value={formData.contactPerson.name}
        onChange={handleChange}
        placeholder="Contact Name"
        className="inputjdtemplate"
      />
      <input
        type="email"
        name="contactPerson.email"
        value={formData.contactPerson.email}
        onChange={handleChange}
        placeholder="Contact Email"
        className="inputjdtemplate"
      />
      <input
        type="text"
        name="contactPerson.mobile"
        value={formData.contactPerson.mobile}
        onChange={handleChange}
        placeholder="Contact Mobile"
        className="inputjdtemplate"
      />
      <input
        type="text"
        name="contactCompanyName"
        value={formData.contactCompanyName}
        onChange={handleChange}
        placeholder="Contact Company Name"
        className="inputjdtemplate"
      />

      {/* Logo Upload */}
      <div>
        <label>Your Company Logo</label>
        <input type="file" name="companyLogo" onChange={handleChange} accept="image/*" className="inputjdtemplate" />
        {logoPreview && <img src={logoPreview} alt="Logo Preview" className="logo-previewjdtemplate" />}
      </div>
    </form>
    <div className="buttondivjdtemplateform">
    <button className="daily-tr-btn newcssbuttonjdtemplate" onClick={()=> handleOpenModals("videoEdm")}>Share Video Edm</button>
      <button className="daily-tr-btn newcssbuttonjdtemplate" onClick={()=> handleOpenModals("shareEdm")}>Share Edm</button>
      <button className="daily-tr-btn newcssbuttonjdtemplate" onClick={()=> handleOpenModals("bannerEdm")}>Share Banner Edm</button>
    </div>
    
      {isOpenEdm === "videoEdm" && (
       <>
       <JobDescriptionEdm descriptionFromTempGen = {commonEDMData} onJobDescriptionEdm = {handleonJobDescriptionEdm}/>
       </>
      )}
      {isOpenEdm === "shareEdm" && (
       <>
       <ShareEDM descriptionFromTempGen = {commonEDMData} onShareEdm = {handleonJobDescriptionEdm}/>
       </>
      )}
      {isOpenEdm === "bannerEdm" && (
       <>
       <ShareDescription Descriptions = {fullBannerData}/>
       </>
      )}
 
    </>
  );
};

export default JDTemplateGen;