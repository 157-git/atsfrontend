// Rajlaxmi Jagadale Create that 157offerletter date 18/03/2025
import { useState, useRef, useEffect } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import "../TeamLeader/appointmentLetter.css"

const AppointmentLetter = () => {
  const [offerDetails, setOfferDetails] = useState({
    date: "21st August 2024 ",
    name: "Dear xyz",
    location: "Pune",
    position: "Assistant Manager, Finance & Account department",
    companyName: "157 Industries Private Limited",
    salary: "XXX/-",
    startDate: " 26th September 2024",
    directorname: "Ajinkya Bandamantri",
    basicpermonth: "28762",
    basicperyear: "345146",
    hrapermonth: "11505",
    hraperyear: "138059",
    conveyancepermonth: "1600",
    Conveyanceperyear: "19200",
    medicalallowancepermonth: "5000",
    medicalallowanceperyear: "60000",
    otherallowancepermonth: "15037",
    otherallowanceperyear: "180444",
    professionalallowancepermonth: "5000",
    professionalallowanceperyear: "60000",
    ltapermonth: "5000",
    ltaperyear: "60000",
    bonuspermonth: "2396",
    bonusperyear: "28752",
    totalapermonth: "74300",
    totalaperyear: "891600",
    providentfundpermonth: "1950",
    providentfundperyear: "23400",
    esicpermonth: "0",
    esicperyear: "0",
    leavepermonth: "0",
    leaveperyear: "0",
    secondbonuspermonth: "0",
    secondbonusperyear: "0",
    graduitypermont: "0",
    graduityperyear: "0",
    totalbpermonth: "1950",
    totalbperyear: "23400",
    totalctcpermonth: "76250",
    totalctcperyear: "915000",
    deductionspermonth: "",
    deductionsperyear: "",
    secondprovidentfundpermonth: "1800",
    secondprovidentfundperyear: "21600",
    secondesicemppermonth: "0",
    secondesicempperyear: "0",
    professionaltaxpermonth: "200",
    professionaltaxperyear: "2500",
    totaldeductioncpermonth: "2000",
    totaldeductioncperyear: "24100",
    netsalarypermonth: "72300",
    netsalaryperyear: "867600",
    noticeperiod: " 30 days",
    month: "3 month",
    policy :" Infosys' HR policy.",
    months :"12 months",
    job:"(whether full-time or part-time)",
    year:"(1) year",
    software:"computer software programs, modules,training materials, development tools, and/or written documentation",
  })

  const pageRefs = useRef([])
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const editableRefs = useRef({})

  const addPageRef = (el, index) => {
    if (el && !pageRefs.current[index]) {
      pageRefs.current[index] = el
    } else if (el) {
      pageRefs.current[index] = el
    }
  }

  const handleContentEdit = (field, event) => {
    const newValue = event.target.innerText
    setOfferDetails((prev) => ({
      ...prev,
      [field]: newValue,
    }))
  }

  useEffect(() => {
    Object.keys(offerDetails).forEach((field) => {
      if (editableRefs.current[field]) {
        editableRefs.current[field].forEach((ref) => {
          if (ref && ref.innerText !== offerDetails[field]) {
            ref.innerText = offerDetails[field]
          }
        })
      }
    })
  }, [offerDetails])

  const registerEditableRef = (field, element) => {
    if (element) {
      if (!editableRefs.current[field]) {
        editableRefs.current[field] = []
      }

      if (!editableRefs.current[field].includes(element)) {
        editableRefs.current[field].push(element)
      }
    }
  }

  const downloadPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      const clonedPages = []

      for (let i = 0; i < pageRefs.current.length; i++) {
        const originalPage = pageRefs.current[i]
        if (originalPage) {
          const clonedPage = originalPage.cloneNode(true)

          const highlightedElements = clonedPage.querySelectorAll(".editable-highlightofferletter")
          highlightedElements.forEach((el) => {
            el.classList.remove("editable-highlightofferletter")
          })

          clonedPage.style.position = "absolute"
          clonedPage.style.left = "-9999px"
          document.body.appendChild(clonedPage)
          clonedPages.push(clonedPage)
        }
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = 210
      const pageHeight = 297
      const margin = 10
      const contentWidth = pageWidth - margin * 2

      for (let i = 0; i < clonedPages.length; i++) {
        const page = clonedPages[i]

        if (page) {
          const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
          })

          const imgData = canvas.toDataURL("image/jpeg", 1.0)
          const pageAspectRatio = canvas.height / canvas.width
          const pdfContentWidth = contentWidth
          const pdfContentHeight = pdfContentWidth * pageAspectRatio

          if (i > 0) {
            doc.addPage()
          }

          doc.addImage(imgData, "JPEG", margin, margin, pdfContentWidth, pdfContentHeight, `page-${i}`, "FAST")

          document.body.removeChild(page)
        }
      }

      doc.save("Job_Offer_Letter.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("There was an error generating the PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }
// Rajlaxmi jagadale added that code date 20/03/2025
  const EditableSpan = ({ field }) => (
    <span
      contentEditable="true"
      ref={(el) => registerEditableRef(field, el)}
      onBlur={(e) => handleContentEdit(field, e)}
      suppressContentEditableWarning={true}
      className="editable-highlightofferletter"
    >
      {offerDetails[field]}
    </span>
  )
// rajlaxmi jagadale some change of that code date 20/03/2025
  return (
    <div className="offer-letter-containerofferletter">
      <div className="offer-offerletter" ref={(el) => addPageRef(el, 0)}>
          {/* Heading Should be Changed While final deployment */}
        <h2 className="titleofferletter">APPOINTMENT LETTER </h2>
        <b>
          {" "}
          <p>
          <EditableSpan field="date" />
        </p>
          <p>
          <EditableSpan field="location" />
        </p>
        </b>
        <p>
          <EditableSpan field="name" />
        </p>
        <p>
          We are pleased to share with you an appointment letter to join <EditableSpan field="companyName" />
        </p>
        <p>
          As previously agreed, you have been appointed at <EditableSpan field="companyName" />,{" "}
          <EditableSpan field="location" />, for the position of <EditableSpan field="position" />, with a
          <b>
            {" "}
            tentative start date of <EditableSpan field="startDate" />
          </b>
          , contingent upon the successful completion of your background check. In case of any changes to the joining
          date, you will be informed via email.
        </p>
        <p>
          We believe you will play an important role in our continued growth and success, and we look forward to
          welcoming you to the <EditableSpan field="companyName" /> family.
        </p>
        <p>
          The confirmation of your employment is subject to the background verification of your documents. If the
          background verification results in a red or orange status (indicating uncertain or false information), it will
          lead to immediate termination without any opportunity for remuneration.
        </p>
        <p>
          The terms and conditions outlined in this employment letter ("Agreement"), as amended from time to time, along
          with the Company's "General Terms and Conditions of Service" as laid out in the Company's official email and
          all applicable regulations and policies, form the basis of your employment.
        </p>
        <p>
          Your total annual CTC is{" "}
          <b>
            <EditableSpan field="salary" />
          </b>
          .
        </p>
        <p>Apart from Provident Fund and Professional Tax, no other deductions will be made from our end.</p>
        <p>
          If there is no acceptance of the appointment letter via email within three calendar days from the date of
          issue, this offer will be automatically revoked.
        </p>
        <p>Please sign all pages of the offer letter to indicate your acceptance.</p>
        <p>We would like to extend a warm welcome and wish you a rewarding career with us!</p>
        <p>Best wishes,</p>
        <b>
          <EditableSpan field="directorname" />
        </b>
        <p>
          <b>Director</b>
        </p>
        <p>
          <b>
            <EditableSpan field="companyName" />
          </b>
        </p>
      </div>

      <div className="offer-offerletter" ref={(el) => addPageRef(el, 1)}>
        <h3 className="titleofferletter">TERMS AND CONDITIONS OF EMPLOYMENT</h3>
        <p>
          <b>1. Commencement of employment</b>
        </p>
        <p>
          You shall report to work at the Company's premises on{" "}
          <b>
            <EditableSpan field="startDate" />
          </b>
          , or as informed over the call. In case you fail to join the company by the aforesaid date, you would be
          breaching the terms & conditions governing your employment with the company.
        </p>
        <p>
          <b>2. Designation & Location</b>
        </p>
        <p>
          You will be designated as a <EditableSpan field="position" /> with <EditableSpan field="companyName" />.
        </p>
        <p>
          <b>3. No other job commitment:</b>
        </p>
        <p>
          a. You accept that you are being hired in accordance with the clauses and terms set forth in this Agreement,
          and officially state that you are not employed by any other company and that you are free of any commitment to
          any preceding employer.
        </p>
        <p>
          b. While you are employed with <EditableSpan field="companyName" />, you will not engage in any other
          employment, consulting, or other business activity <EditableSpan field="job" /> that would create a
          conflict of interest with the company.
        </p>
        <p>
          c. You agree not to own or operate an independent commercial business, nor to trade for your own or another's
          benefit in Client's line of business.
        </p>
        <p>
          <b>4. Job Duties:</b>
        </p>
        <p>
          You agree to perform the assigned job and to do whatever else the Company instructs you to do, and to complete
          any assigned training.
        </p>
        <p>
          <b>5. Working Hours:</b>
        </p>
        <p>
          You will be required to work as per the client's working hours. Further, depending on the workload and
          business requirements, at any given time, you may be required to work in shifts and/or during weekends. You
          may also be expected to travel to other locations at times outside of your official hours of work.
        </p>
        <p>
          <b>6. Probation period:</b>
        </p>
        <p>
          Your employment will be subject to a <EditableSpan field="month" />
           probationary period with <EditableSpan field="noticeperiod" /> of notice period. If your
          performance is not satisfactory, or if any compliance issues arise while you are working, or any unethical
          practices are observed,
          <EditableSpan field="companyName" /> may terminate your employment without any notice period.
        </p>
        <p>
          After the probation period, you will still be required to serve a <EditableSpan field="noticeperiod" />
           notice period if you wish to leave the organization.
        </p>
        <p>
          <b>7. Buy Out Notice period:</b>
        </p>
        <p>
          If you are eligible for a buyout option in your current organization, <EditableSpan field="companyName" />{" "}
          will not be liable to pay any amount for this. In this scenario, if you decide to terminate your employment at
          any time during your tenure with <EditableSpan field="companyName" />, you will have to bear the buyout amount
          yourself, and <EditableSpan field="companyName" /> will not be responsible for any payment in this case.
        </p>
      </div>

      <div className="offer-offerletter" ref={(el) => addPageRef(el, 2)}>
        <p>
          <b>8. Appraisals:</b>
        </p>
        <p>
          Your performance will be evaluated annually and based on your manager's feedback you may become eligible for
          an increment.
        </p>
        <p>
          <b>9. Ownership of work:</b>
        </p>
        <p>
          Any product created, service rendered during the course of your employment, including but not limited to any
          intellectual property in relation thereto, will be for and on behalf of the Company and shall solely and
          exclusively belong to the Company.
        
          If you conceive of any new or advanced methods of improving processes, formulae, or systems in relation to the
          operation of the company, such developments will be fully communicated to the company and will remain the sole
          property of the company.
        </p>
        <p>
          <b>10. Leave details:</b>
        </p>
        <p>
          Annual Leave - You will be entitled to paid leave from Infosys each calendar year, subject to <EditableSpan field="policy" />
        </p>
        <p>
          <b>11. Termination of employment:</b>
        </p>
        <p>
          a. <b>Termination with Notice</b> - You are required to give advance notice of{" "}
          <EditableSpan field="noticeperiod" /> in writing over email as your resignation from Employment. In the
          event of separation, the notice period applicable to the organization as well as the employee is{" "}
          <EditableSpan field="noticeperiod" />.
        </p>
        <p>
          b. <b>Termination without Notice</b> - The company may terminate your employment immediately and without any
          notice due to serious misconduct or serious breach of employment rules. In that case, you are not eligible for
          any kind of pay from <EditableSpan field="companyName" />.
        </p>
        <p>
          <b>12. Confidentiality:</b>
        </p>
        <p>
          During your employment with the Company, you may learn trade secrets or confidential information, which
          relates to the Company and the Clients. Unless required in the proper performance of your duties, you must not
          directly or indirectly use or disclose any Confidential Matter except for the sole benefit and with the
          consent of the Company.
        </p>
        <p>
          You also agree that details of your employment contract are strictly confidential between you and{" "}
          <EditableSpan field="companyName" />. If you are unsure about the confidential nature of specific information,
          you must seek your manager's advice and clarification.
        </p>
        <p>
          <b>13. Non-Competition and Non-Solicitation:</b>
        </p>
        <p>
          During the period until one <EditableSpan field="year" /> following the termination of your employment for whatever reason (which
          time period shall be extended by the length of time during which you are in violation of this paragraph), you
          shall not directly or indirectly solicit the business (or otherwise deal in a manner adverse to the Company
          with) or provide any software engineering, consulting or programming services to any customer or end-user of
          any customer of the Company for which or for whose benefit you have provided services during your employment,
          either directly or indirectly solicit the services of (or otherwise deal in a manner adverse to the Company
          with) any employee of the Company or induced such employee to terminate his or her employment.
        </p>
        <p>
          During the term if you are assigned with CLIENTS and for a period of <EditableSpan field="months" /> after termination or expiration
          of your employment with the Company, you agree that you will not in any manner, either on your own behalf or
          on behalf of any other person or entity, directly or indirectly compete with COMPANY by soliciting the CLIENT
          in any department or any location globally for any opportunities.
        </p>
        <p>For violations and restrictions please refer to Employee Handbook.</p>
      </div>

      <div className="offer-offerletter" ref={(el) => addPageRef(el, 3)}>
        <p>
          <b>14. Safekeeping and Return of company property:</b>
        </p>
        <p>
          You will be responsible for the safekeeping and return in good condition of all the Company's properties,
          which may be in your use or custody. Company shall have the right to deduct the monetary value of such
          properties from your dues and take such actions as deemed proper in the event of your failure to account for
          them to the Company's satisfaction.
        </p>
        <p>
          <b>15. Intellectual Property Rights:</b>
        </p>
        <p>
          You hereby agree that <EditableSpan field="companyName" /> shall own, on a perpetual, irrevocable, exclusive,
          royalty-free, fully paid up, and worldwide basis, all right, title, and interest in, to, and under, including
          all Intellectual Property Rights throughout the world therein, all work product, both tangible and intangible,
          performed for the CLIENT, its Affiliates, or its or their clients or customers.
        </p>
        <p>
          You acknowledge and agree that you may use the Client's Materials solely for the benefit of{" "}
          <EditableSpan field="companyName" />, its Affiliates, and the Services Recipients pursuant to this Agreement.
        </p>
        <p>
          <b>16. Ownership of Client Data:</b>
        </p>
        <p>
          All Client Data is and shall remain the sole and exclusive property of <EditableSpan field="companyName" /> /
          Client. Without
          <EditableSpan field="companyName" />
          's approval (in its sole discretion), Contractor shall not use Client Data for any purpose other than to
          provide the Services.
        </p>
        <p>
          <b>17. Rights Granted:</b>
        </p>
        <p>
          To the extent that any of the Services provided hereunder by you result in your creation of any works that may
          be protected under the copyright law, including, but not limited to <EditableSpan field="software" />, (hereinafter "Work"), each such Work
          shall be deemed specially commissioned by <EditableSpan field="companyName" /> and shall be considered a "work
          made for hire", as defined in the India Copyright Act 1957.
        </p>
        <p>
          <b>18. Compliance:</b>
        </p>
        <p>
          The company's rules, regulations, and directions relating to employees, including the Group's Code of Conduct,
          which are now or may hereafter be in force, will apply to you and will be strictly complied with by you. You
          should therefore acquaint yourself with all the Company rules and policies which are applicable to you.
        </p>
        <p>
          <b>19. Data Protection:</b>
        </p>
        <p>
          By signing this statement, you acknowledge and agree that the Company is permitted to hold personal
          information about you as part of its personnel and other business records, and that the Company may use such
          information in the course of the Company's business.
        </p>
        <p>
          You agree that the Company may disclose information about you to other Group companies or third parties if the
          Company considers that to do so is required for the proper conduct of the Company's business or that of any of
          its associates. This Clause applies to information held, used, or disclosed in any medium.
        </p>
        <p>
          <b>20. Code of Conduct and Policies:</b>
        </p>
        <p>
          You agree to read, follow, and perform your job in compliance with the Company's Code of Conduct and
          Anti-Money Laundering Policy, each as amended from time to time, and with all other applicable "Rules", laws,
          workplace safety rules, and anti-bribery rules including Trading Policy as governed by the Company's Clients.
          If the Company has reason to believe you violated the Code of Conduct or a Rule, you agree to cooperate in any
          investigation and comply with any properly imposed discipline including, but not limited to, immediate
          dismissal.
        </p>
      </div>

      <div className="offer-offerletter" ref={(el) => addPageRef(el, 4)}>
        <p>
          <b>21. No Waiver Survival:</b>
        </p>
        <p>
          No delay by the Company in enforcing any Company right under this Agreement constitutes a waiver. Upon
          termination of this Agreement, some provisions will survive and will be enforceable going forward.
        </p>
        <p>
          <b>22. Governing Law and Jurisdiction:</b>
        </p>
        <p>
          This Agreement is subject exclusively to the law of India, the courts at [insert location] depending on the
          place of work will have exclusive jurisdiction over any claims between the parties (that is, over disputes
          under this Agreement and also over disputes that do not implicate provisions in this Agreement).
        </p>
        <p>
          <b>23. Entire Agreement:</b>
        </p>
        <p>
          This Agreement represents the entire agreement of the parties and it supersedes all prior statements,
          discussions and understandings. The Company reserves the right to change its policies from time to time.
        
          You would be informed in writing about any change in the Company policy. During your employment with the
          company, you shall be subject to all rules and regulations, as are made / amended by the company.
        </p>
        <p>
          Please confirm your acceptance of the terms and conditions of employment by signing the attached copy of this
          letter. Kindly ensure that you also initial each page and any attachment here to.
        </p>
        <p>
          <b>Acceptance:</b>
        </p>
        <p>
          I, __________________________________________________________ accept the employment on the above terms and
          conditions.
        </p>
        <p>
          I confirm that I will report to work on ____, which shall constitute the date of commencement of my employment
          with the company. The Company may withdraw the offer in case I fail to communicate the date of joining or fail
          to join on the communicated date.
        </p>
      </div>

      {/* Page 6 */}
      <div className="offer-offerletter" ref={(el) => addPageRef(el, 5)}>
        <b>
          <p style={{ textAlign: "center" }}>Annexure "A"</p>
        </b>
        <table className="salary-tableofferletter">
          <thead>
            <tr>
              <th className="salary-tableofferletterth">Particular</th>
              <th className="salary-tableofferletterth">Per Month</th>
              <th className="salary-tableofferletterth">Per Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="salary-tableofferlettertd" >
                <b>Total Earning per month</b>
              </td>
              <td className="salary-tableofferlettertd"></td>
              <td className="salary-tableofferlettertd"></td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Basic + DA</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="basicpermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="basicperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">HRA</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="hrapermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="hraperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Conveyance</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="conveyancepermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="Conveyanceperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Medical Allowance</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="medicalallowancepermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="medicalallowanceperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Other Allowance</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="otherallowancepermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="otherallowanceperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Professional Allowance</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="professionalallowancepermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="professionalallowanceperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">LTA</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="ltapermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="ltaperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd"> Bonus</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="bonuspermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="bonusperyear" />
              </td>
            </tr>
            <tr className="total-row">
              <td className="salary-tableofferlettertd">
                <b>Total A</b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totalapermonth" />
                </b>
              </td >
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totalaperyear" />
                </b>
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">
                <b>Additional payment as per government rule.</b>
              </td>
              <td className="salary-tableofferlettertd"></td>
              <td className="salary-tableofferlettertd"></td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Provident Fund - Employers 13%</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="providentfundpermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="providentfundperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">ESIC Employees 3.75% </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="esicpermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="esicperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Leave</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="leavepermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="leaveperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Bonus</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="secondbonuspermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="secondbonusperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Gratuity</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="graduitypermont" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="graduityperyear" />
              </td>
            </tr>
            <tr className="total-row">
              <td className="salary-tableofferlettertd">
                <b>Total B</b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totalbpermonth" />
                </b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totalbperyear" />
                </b>
              </td>
            </tr>
            <tr className="highlight-rowofferletter">
              <td className="salary-tableofferlettertd">
                <b>Total CTC per month salary A + B </b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totalctcpermonth" />
                </b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totalctcperyear" />
                </b>
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">
                <b>Deductions as per government rule. </b>
              </td>
              <td className="salary-tableofferlettertd"></td>
              <td className="salary-tableofferlettertd"></td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Provident Fund - Employees 12%</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="secondprovidentfundpermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="secondprovidentfundperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">ESIC Employees 0.75% </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="secondesicemppermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="secondesicempperyear" />
              </td>
            </tr>
            <tr>
              <td className="salary-tableofferlettertd">Professional Tax</td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="professionaltaxpermonth" />
              </td>
              <td className="salary-tableofferlettertd">
                <EditableSpan field="professionaltaxperyear" />
              </td>
            </tr>
            <tr className="total-row">
              <td className="salary-tableofferlettertd">
                <b>Total Deduction C</b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totaldeductioncpermonth" />
                </b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="totaldeductioncperyear" />
                </b>
              </td>
            </tr>
            <tr className="highlight-rowofferletter">
              <td className="salary-tableofferlettertd">
                <b>Net Salary For Month </b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="netsalarypermonth" />
                </b>
              </td>
              <td className="salary-tableofferlettertd">
                <b>
                  <EditableSpan field="netsalaryperyear" />
                </b>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          If you accept the terms and conditions above mentioned, please sign the declaration in the duplicate and
          return to us. The original shall be retained by you.
        </p>
        <p>With the signature below, I accept this offer for employment.</p>
        <p>
          <b>Authorized Signatory</b>
        </p>
        <p>
          <b>
            <EditableSpan field="directorname" />
          </b>
        </p>
        <p>
          <b>
            <EditableSpan field="companyName" />
          </b>
        </p>
      </div>

      <div className="download-btn-containerofferletter">
        <button onClick={downloadPDF} className="download-btnofferletter" disabled={isGeneratingPDF}>
          {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  )
}

export default AppointmentLetter;