/* Name:-Prachi Parab Component:-Create Report Table page 
         End LineNo:-4 to 319 Date:-06/07 */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Reports/CreateReportTable.css";
import ShortListedCandidates from "./LineUpDataReport";
import downloadAnime from "../assets/downloadanimated.gif";
import PdfModal from "./pdfModal";
import { createPdf } from "./pdfUtils";
import PieChart from "./PieChartReport";
import PDFGenerator from "./PDFMain";
import SliderReport from "./SliderReports";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Loader from "../EmployeeSection/loader";
import BarChartComponent from "./BarChartComponent";
import FilterComponent from "./FilterComponent";
import { separateBySpace } from "../HandlerFunctions/separateBySpace";
import PrintTableComp from "./PrintTableComp";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDateTime";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Tag } from "antd";

const Attendance = ({
  reportDataDatewise,
  selectedIdsProp,
  selectedJobRole,
  finalStartDatePropState,
  finalEndDatePropState,
  loginEmployeeName,
  selectedRole,
  selectedIds,
}) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [LineUpDataReport, setLineUpDataReport] = useState(false);
  const [LineUpItems, setLineUpItems] = useState(reportDataDatewise);
  const [FilterLineUpItems, setFilterLineUpItems] = useState("selected");
  const [filterDataCategory, setfilterDataCategory] = useState();
  const { userType } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const { workId } = useParams();
  const navigator = useNavigate();
  const handleFilterLineUpChange = (newFilter) => {
    setFilterLineUpItems(newFilter);
    setLineUpDataReport(true);
  };

  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (userType === "Recruiters") {
      setUserName(`Recruiters : ${loginEmployeeName}`);
    } else if (userType === "TeamLeader") {
      setUserName(`TeamLeader : ${loginEmployeeName}`);
    } else if (userType === "Manager") {
      setUserName(`Manager : ${loginEmployeeName}`);
    } else if (userType === "SuperUser") {
      setUserName(`SuperUser : ${loginEmployeeName}`);
    }
  }, []);

  const handleDownloadPdf = async () => {
    setLoading(true);
    try {
      const newbarchartclassforsetstyles = document.getElementsByClassName(
        "newbarchartclassforsetstyles"
      );
      if (newbarchartclassforsetstyles.length > 0) {
        newbarchartclassforsetstyles[0].style.width = "450px";
        newbarchartclassforsetstyles[0].style.width = "450px";
      }

      const setDisplayBlockNewChartPrint = document.getElementsByClassName(
        "setDisplayBlockNewChartPrint"
      );
      if (setDisplayBlockNewChartPrint.length > 0) {
        setDisplayBlockNewChartPrint[0].style.display = "block";
        setDisplayBlockNewChartPrint[0].style.width = "60%";
        setDisplayBlockNewChartPrint[0].style.paddingLeft = "50px";
      }

      const newsahilcanvas = document.getElementsByClassName("newsahilcanvas");
      if (newsahilcanvas.length > 0) {
        newsahilcanvas[0].style.height = "400px";
      }

      const newclassforalignitemscenter = document.getElementsByClassName(
        "newclassforalignitemscenter"
      );
      if (newclassforalignitemscenter.length > 0) {
        newclassforalignitemscenter[0].style.alignItems = "end";
      }

      const forcharborderpage = document.getElementsByClassName(
        "setchartsdiplayflex"
      );
      if (forcharborderpage.length > 0) {
        forcharborderpage[0].style.border = "2px solid black";
        forcharborderpage[0].style.padding = "10px";
      }

      const forPieWidthContainer =
        document.getElementsByClassName("mainChartContainer");
      if (forPieWidthContainer.length > 0) {
        // forPieWidthContainer[0].style.display = 'block';
        forPieWidthContainer[0].style.width = "fit-content";
        // forPieWidthContainer[0].style.border = '2px solid black';
        forPieWidthContainer[0].style.padding = "10px";
        forPieWidthContainer[0].style.marginTop = "150px";
      }
      const forPieWidthContainer1 =
        document.getElementsByClassName("tabledivmain");
      if (forPieWidthContainer1.length > 0) {
        // forPieWidthContainer[0].style.display = 'block';
        forPieWidthContainer1[0].style.display = "block";
      }

      const input = document.getElementById("divToPrint");

      // Adjust the canvas dimensions for better resolution
      const options = { scale: 2 }; // Adjust the scale for higher resolution
      const canvas = await html2canvas(input, options);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait", // or "landscape"
        unit: "px", // Unit in which to measure dimensions
        format: [(canvas.width = 450), (canvas.height = 570)], // Match canvas size
      });

      // Add the image to the PDF
      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        (canvas.width = 430),
        (canvas.height = 550)
      );

      // Save the PDF
      pdf.save("document.pdf");
      // Open the modal (if necessary)

      if (forcharborderpage.length > 0) {
        forcharborderpage[0].style.border = "none";
        forcharborderpage[0].style.padding = "none";
      }
      if (newclassforalignitemscenter.length > 0) {
        newclassforalignitemscenter[0].style.alignItems = "center";
      }
      if (forPieWidthContainer.length > 0) {
        forPieWidthContainer[0].style.width = "50%";
        // forPieWidthContainer[0].style.border = 'none';
        forPieWidthContainer[0].style.padding = "none";
        forPieWidthContainer[0].style.marginTop = "0";
      }
      if (forPieWidthContainer1.length > 0) {
        // forPieWidthContainer[0].style.display = 'block';
        forPieWidthContainer1[0].style.display = "none";
      }
      if (setDisplayBlockNewChartPrint.length > 0) {
        setDisplayBlockNewChartPrint[0].style.display = "flex";
        setDisplayBlockNewChartPrint[0].style.width = "100%";
        setDisplayBlockNewChartPrint[0].style.paddingLeft = "0";
      }
      if (newsahilcanvas.length > 0) {
        newsahilcanvas[0].style.height = "500px";
      }
      if (newbarchartclassforsetstyles.length > 0) {
        newbarchartclassforsetstyles[0].style.width = "450px";
        newbarchartclassforsetstyles[0].style.width = "450px";
      }
      setModalIsOpen(true);
      setLoading(false);
    } catch (error) {
      console.error("Error creating and merging PDF:", error);
      setLoading(false);
    }
  };
  const closeModal = () => {
    // Clear the PDF URL and close the modal
    setPdfUrl("");
    setModalIsOpen(false);
  };
  console.log(reportDataDatewise);
  const [newData, setNewData] = useState([]);
  console.log(selectedIdsProp);
  const newIdsString = selectedIdsProp.join(",");
  console.log(newIdsString);

  const [displaycreatechartbtn, setdisplaycreatechartbtn] = useState(false);
  const [statusCategory, setStatusCategory] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // For total items count

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleFilterDataInterview(statusCategory, page, pageSize);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
    handleFilterDataInterview(statusCategory, 1, size);
  };

  const handleFilterDataInterview = async (category, page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      console.log(category);
      const response = await axios.get(
        `${API_BASE_URL}/candidate-category/${newIdsString}/${selectedJobRole}/${finalStartDatePropState}/${finalEndDatePropState}`,
        {
          params: {
            status: category,
            page: page,
            size: size,
          },
        }
      );

      setStatusCategory(category);
      setNewData(response.data);
      setTotalItems(response.data.totalItems); // Total count of candidates
      setLineUpDataReport(true);
      setdisplaycreatechartbtn(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const handleFilterChange = (category, subCategories) => {
    setSelectedCategory(category);
    setSelectedSubCategories(subCategories);
  };
  console.log(selectedSubCategories);

  const [displaycandidatedatareporttable, setdisplaycandatareport] =
    useState(false);
  const sahilDivRef = useRef(null);

  const handletoggletable = () => {
    setdisplaycandatareport(!displaycandidatedatareporttable);
    // Delay scrolling to allow state update
    setTimeout(() => {
      if (sahilDivRef.current) {
        sahilDivRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); // Adjust timing if needed
  };

  return (
    <div className="report-App-after">
      {loading && <Loader />}

      <div className="container-after1">
        <div className="attendanceTableData">
          <div style={{ textAlign: "-webkit-center" }}></div>

          <div className="silderReport-align-div">
            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "right",

                paddingBottom: "5px",
              }}
            >
              {/* <PdfModal isOpen={modalIsOpen} closeModal={closeModal} pdfContent={pdfUrl} /> */}
            </div>
          </div>

          <div className="btnShareAndDownload">
            {/* <button className="shareDownloadbtn" onClick={handleRadioChange}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z"/></svg>
                     </button> */}
            {selectedJobRole && selectedIds && (
              <p>
                <span className="newClassNameForMakeBold">
                  Selected Role :{" "}
                </span>
                <Tag color="#87d068">{selectedRole && selectedRole}</Tag>{" "}
                <span className="newClassNameForMakeBold">Count : </span>
                <Tag color="#2db7f5">
                  {selectedIds && selectedIds.length}
                </Tag>{" "}
              </p>
            )}
            {selectedRole &&
              selectedRole &&
              selectedIds &&
              selectedIds.length > 0 && (
                <button
                  className="shareDownloadbtn"
                  onClick={handleDownloadPdf}
                >
                  <img
                    className="downloadAnimeImg"
                    src={downloadAnime}
                    alt="Download"
                  />
                </button>
              )}
          </div>

          {selectedRole &&
            selectedRole &&
            selectedIds &&
            selectedIds.length > 0 && (
              <div className="tabaledivforreport">
                <table className="report-attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      {reportDataDatewise.map((reportData, index) => (
                        <th key={index} className="attendanceheading">
                          {separateBySpace(reportData.category)}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {reportDataDatewise.map((reportData, index) => (
                    <td
                      className="tabledata"
                      key={index}
                      onClick={() =>
                        handleFilterDataInterview(reportData?.category)
                      }
                    >
                      {reportData.count}
                      &nbsp;{" "}
                      <i class="fa fa-caret-down" aria-hidden="true">
                        {" "}
                      </i>
                    </td>
                  ))}
                </table>
              </div>
            )}

          {displaycreatechartbtn && (
            <button className="lineUp-Filter-btn" onClick={handletoggletable}>
              {" "}
              {displaycandidatedatareporttable ? (
                <>
                  {" "}
                  Hide Candidate Details <UpOutlined />{" "}
                </>
              ) : (
                <>
                  {" "}
                  Show Candidate Details <DownOutlined />{" "}
                </>
              )}
            </button>
          )}
          <div className="newdivformakechartsflex">
            {displaycreatechartbtn && (
              <>
                <FilterComponent
                  filteredLineUpItems={newData}
                  onFilterChange={handleFilterChange}
                />
              </>
            )}

            <div className="setchartsdiplayflex" id="divToPrint">
              <PrintTableComp
                userName={userName}
                currentDate={getFormattedDateTime()}
                finalStartDatePropState={finalStartDatePropState}
                finalEndDatePropState={finalEndDatePropState}
                data={reportDataDatewise}
              />
              <div className="setDisplayBlockNewChartPrint">
                {selectedRole &&
                  selectedRole &&
                  selectedIds &&
                  selectedIds.length > 0 && (
                    <PieChart
                      data={reportDataDatewise}
                      userName={userName}
                      finalStartDatePropState={finalStartDatePropState}
                      finalEndDatePropState={finalEndDatePropState}
                    />
                  )}

                <BarChartComponent
                  selectedCategory={selectedCategory}
                  selectedSubCategories={selectedSubCategories}
                  filteredLineUpItems={newData}
                  selectedStatusCategory={statusCategory}
                />
              </div>
            </div>
            <div className="shortlisted-candidates-css">
              {displaycandidatedatareporttable && (
                <div className="sahildiv" ref={sahilDivRef}>
                  <ShortListedCandidates
                    filteredLineUpItems={newData}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
