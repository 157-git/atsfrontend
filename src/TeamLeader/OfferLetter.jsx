//  Rajlaxmi jagadale Create that Infosysofferletter Date 18/03/2025
import { useState, useRef, useEffect } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import "../TeamLeader/offerLetter.css"

const OfferLetter = () => {
  const [offerDetails, setOfferDetails] = useState({
    date: "3rd  February 2025",
    name: " Dear xyz",
    location: "Pune",
    position: " Senior Software Developer",
    companyName: "157 Industries Private Limited ",
    companyNames: "Infosys India Pvt Ltd",
    salary: "XXXXXX",
    startDate: "4th February 2025",
    directorname: "Ajinkya Bandamantri",
    specificadddate: "4th  February 2025",
    basicpermonth: "96667",
    basicperyear: "1160004",
    hrapermonth: "39167",
    hraperyear: "470004",
    conveyancepermonth: "1600",
    Conveyanceperyear: "19200",
    medicalallowancepermonth: "8000",
    medicalallowanceperyear: "96000",
    otherallowancepermonth: "59614",
    otherallowanceperyear: "715364",
    professionalallowancepermonth: "8000",
    professionalallowanceperyear: "96000",
    ltapermonth: "8000",
    ltaperyear: "96000",
    bonuspermonth: "8052",
    bonusperyear: "96624",
    totalapermonth: "229100",
    totalaperyear: "2749196",
    providentfundpermonth: "12567",
    providentfundperyear: "150804",
    esicpermonth: "0",
    esicperyear: "0",
    leavepermonth: "0",
    leaveperyear: "0",
    secondbonuspermonth: "0",
    secondbonusperyear: "0",
    graduitypermont: "0",
    graduityperyear: "0",
    totalbpermonth: "12567",
    totalbperyear: "150804",
    totalctcpermonth: "241667",
    totalctcperyear: "2900000",
    deductionspermonth: "",
    deductionsperyear: "",
    secondprovidentfundpermonth: "11600",
    secondprovidentfundperyear: "139200",
    secondesicemppermonth: "0",
    secondesicempperyear: "0",
    professionaltaxpermonth: "200",
    professionaltaxperyear: "2500",
    totaldeductioncpermonth: "11800",
    totaldeductioncperyear: "141700",
    netsalarypermonth: "217300",
    netsalaryperyear: "2607596",
    noticeperiod: "30 days",
    month: "3 month",
    months:"12 months",
    software:"computer software programs, modules,training materials, development tools, and/or written documentation",
    policy:"Infosys' HR policy.",
    Infosys:"Infosys",
    job:"(whether full-time or part-time)",
    year:"(1) year"
  })

  const pageRefs = useRef([])
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const addPageRef = (el, index) => {
    if (el && !pageRefs.current[index]) {
      pageRefs.current[index] = el
    } else if (el) {
      pageRefs.current[index] = el
    }
  }

  const handleContentEdit = (e, field) => {
    const newValue = e.target.innerText
    setOfferDetails((prev) => ({
      ...prev,
      [field]: newValue,
    }))
  }

  useEffect(() => {
    const contentEditableElements = document.querySelectorAll("[data-field]")
    contentEditableElements.forEach((element) => {
      const field = element.getAttribute("data-field")
      if (field && offerDetails[field] !== undefined) {
        if (element.innerText !== offerDetails[field]) {
          element.innerText = offerDetails[field]
        }
      }
    })
  }, [offerDetails])

  const downloadPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      const clonedPages = []

      for (let i = 0; i < pageRefs.current.length; i++) {
        const originalPage = pageRefs.current[i]
        if (originalPage) {
          const clonedPage = originalPage.cloneNode(true)

          const highlightedElements = clonedPage.querySelectorAll(".editable-highlight")
          highlightedElements.forEach((el) => {
            el.classList.remove("editable-highlight")
            el.style.backgroundColor = "transparent"
            el.style.borderBottom = "none"
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
      const contentHeight = pageHeight - margin * 2

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
//Rajlaxmi jagadale added that code date 20/03/2025
  const EditableSpan = ({ field }) => (
    <span
      contentEditable="true"
      data-field={field}
      onBlur={(e) => handleContentEdit(e, field)}
      suppressContentEditableWarning={true}
      className="editable-highlight"
    >
      {offerDetails[field]}
    </span>
  )
//Rajlaxmi jagadale some changes 20/03/2025
  return (
    <div className="offer-letter-container">
      <div className="offer-letter" ref={(el) => addPageRef(el, 0)}>
        {/* Heading Should be Changed While final deployment */}
        <h2 className="title newBoldClassForOfferLetter">APPOINTMENT LETTER </h2> 
        <span className="newBoldClassForOfferLetter">
          {" "}
          <p className="date">
            <EditableSpan field="date" />
          </p>
          <p>
            <EditableSpan field="location" />
          </p>
        </span>
       
        <span className="newBoldClassForOfferLetter">
          <EditableSpan field="name" />,
        </span>
        <p>
          We are pleased to share with you an appointment letter to join <span className="newBoldClassForOfferLetter"> <EditableSpan field="companyName" /></span>
        </p>
        <p>
          As previously agreed, you have been appointed at{" "}
          <span className="newBoldClassForOfferLetter">
            <EditableSpan field="companyNames" />
          </span>
          , <span className="newBoldClassForOfferLetter"> <EditableSpan field="location" /> </span>, for the position of{" "}
          <span className="newBoldClassForOfferLetter">
            <EditableSpan field="position" />
          </span>
          , with a
          <span className="newBoldClassForOfferLetter">
            {" "}
            tentative start date of <EditableSpan field="startDate" />
          </span>
          , contingent upon the successful completion of your background check. You are requested to report to the
          specified address on{" "}
          <span className="newBoldClassForOfferLetter">
            <EditableSpan field="specificadddate" />
          </span>
          in Pune.In case of any changes to the joining date, you will be informed via email.
        </p>
        <p>
          We believe you will play an important role in our continued growth and success, and we look forward to
          welcoming you to the 157 family.
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
          Your total annual CTC is <span className="newBoldClassForOfferLetter"> <EditableSpan field="salary" /> </span>
          Your salary date will commence upon client onboarding..
        </p>
        <p>Apart from Provident Fund and Professional Tax, no other deductions will be made from our end.</p>
        <b>Your salary date will commence upon client onboarding.</b>
        <b>
          <p>
            Your salary disbursement will be entirely based on the approved attendance days from Infosys and the routing
            partner. Additionally, the salary will commence from the day you are onboarded to the project at the client
            end, not from the PO date.{" "}
          </p>
        </b>
        <b>Payment will be released based on the total number of billing days approved by the assigned client. </b>
        <p>
          If there is no acceptance of the appointment letter via email within three calendar days from the date of
          issue, this offer will be automatically revoked.
        </p>
        <p>Please sign all pages of the offer letter to indicate your acceptance.</p>
        <p>We would like to extend a warm welcome and wish you a rewarding career with us!</p>
        <p>Best wishes,</p>
        <span className="newBoldClassForOfferLetter">
          <EditableSpan field="directorname" />
        </span>
        <p>
        <span className="newBoldClassForOfferLetter"> Director</span>
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">
            <EditableSpan field="companyName" />
          </span>
        </p>
      </div>

      <div className="offer-letter" ref={(el) => addPageRef(el, 1)}>
        <h3 className="title newBoldClassForOfferLetter">TERMS AND CONDITIONS OF EMPLOYMENT</h3>
        <p>
        <span className="newBoldClassForOfferLetter">1. Commencement of employment</span>
        </p>
        <p>
          You shall report to work at the Company's premises on{" "}
          <span className="newBoldClassForOfferLetter">
            <EditableSpan field="startDate" />, or as informed over the call
          </span>
          . In case you fail to join the company by the aforesaid date, you would be breaching the terms & conditions
          governing your employment with the company.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">2. Designation & Location</span>
        </p>
        <p>
          You will be designated as a{" "}
          <span className="newBoldClassForOfferLetter">
            <EditableSpan field="position" />
          </span>{" "}
          with    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>,<b>India</b>.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">3. No other job commitment:</span>
        </p>
        <p>
          a.You accept that you are being hired in accordance with the clayuses and terms set forth in this Agreement,
          and officially state that you are not employed by any other company and that you are free of any commitment to
          any preceding employer. You agree that you are required to terminate your employment contract, including your
          notice period, or any other employment relationship with any preceding employer before the date on which this
          agreement takes effect. You agree that you are responsible for any work or employment dispute arising from a
          breach in this regard.
        </p>
        <p>
          b. While you are employed with    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>, you will not engage in any other
          employment, consulting, or other business activity    <span className="newBoldClassForOfferLetter"> <EditableSpan field="job" /></span> that would create a
          conflict of interest with the company. By signing this letter of agreement, you confirm that you have no
          contractual commitments or other legal obligations that would prohibit you from performing your duties for the
          Company.
        </p>
        <p>
          c. You agree not to own or operate an independent commercial business, nor to trade for your own or another's
          benefit in Client's line of business.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">4. Job Duties:</span>
        </p>
        <p>
          You agree to perform the assigned job and to do whatever else the Company instructs you to do, and to complete
          any assigned training.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">5. Working Hours:</span>
        </p>
        <p>
          You will be required to work as per the client's working hours. Further, depending on the workload and
          business requirements, at any given time, you may be required to work in shifts and/or during weekends. You
          may also be expected to travel to other locations at times outside of your official hours of work.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">6. Probation period:</span>
        </p>
        <p>
          Your employment will be subject to a    <span className="newBoldClassForOfferLetter"><EditableSpan field="month" /> </span> probationary period with{" "}
          <span className="newBoldClassForOfferLetter"> <EditableSpan field="noticeperiod" /> </span> of notice period. If your performance is not satisfactory, or if
          any compliance issues arise while you are working, or any unethical practices are observed,
          <span className="newBoldClassForOfferLetter"> <EditableSpan field="companyName" /> </span> may terminate your employment without any notice period.
        </p>
        <p>
          After the probation period, you will still be required to serve a    <span className="newBoldClassForOfferLetter"><EditableSpan field="noticeperiod" /></span>
           notice period if you wish to leave the organization.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">7. Buy Out Notice period:</span>
        </p>
        <p>
          If you are eligible for a buyout option in your current organization,    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>{" "}
          will not be liable to pay any amount for this. In this scenario, if you decide to terminate your employment at
          any time during your tenure with    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>, you will have to bear the buyout amount
          yourself, and    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /> </span> will not be responsible for any payment in this case.
        </p>
      </div>

      <div className="offer-letter" ref={(el) => addPageRef(el, 2)}>
        <p>
        <span className="newBoldClassForOfferLetter">8. Appraisals:</span>
        </p>
        <p>
          Your performance will be evaluated annually and based on your manager's feedback you may become eligible for
          an increment.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">9. Ownership of work:</span>
        </p>
        <p>
          Any product created, service rendered during the course of your employment, including but not limited to any
          intellectual property in relation thereto, will be for and on behalf of the Company and shall solely and
          exclusively belong to the Company. If you conceive of any new or advanced methods of improving processes,
          formulae, or systems in relation to the operation of the company, such developments will be fully communicated
          to the company and will remain the sole property of the company.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">10. Leave details:</span>
        </p>
        <p>
          Annual Leave - You will be entitled to paid leave from    <span className="newBoldClassForOfferLetter"><EditableSpan field="Infosys" /> </span> each calendar year, subject to    <span className="newBoldClassForOfferLetter"><EditableSpan field="policy" /></span>
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">11. Termination of employment:</span>
        </p>
        <p>
          a.    <span className="newBoldClassForOfferLetter">Termination with Notice</span> - You are required to give advance notice of{" "}
          <span className="newBoldClassForOfferLetter"><EditableSpan field="noticeperiod" /></span> in writing over email as your resignation from Employment. In the
          event of separation, the notice period applicable to the organization as well as the employee is{" "}
          <span className="newBoldClassForOfferLetter"><EditableSpan field="noticeperiod" /></span>.
        </p>
        <p>
          b.    <span className="newBoldClassForOfferLetter">Termination without Notice</span> - The company may terminate your employment immediately and without any
          notice due to serious misconduct or serious breach of employment rules. In that case, you are not eligible for
          any kind of pay from    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">12. Confidentiality:</span>
        </p>
        <p>
          During your employment with the Company, you may learn trade secrets or confidential information, which
          relates to the Company and the Clients. Unless required in the proper performance of your duties, you must not
          directly or indirectly use or disclose any Confidential Matter except for the sole benefit and with the
          consent of the Company.
        </p>
        <p>
          You also agree that details of your employment contract are strictly confidential between you and{" "}
          <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>. If you are unsure about the confidential nature of specific information,
          you must seek your manager's advice and clarification.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">13. Non-Competition and Non-Solicitation:</span>
        </p>
        <p>
          During the period until one    <span className="newBoldClassForOfferLetter"><EditableSpan field="year" /></span> following the termination of your employment for whatever reason (which
          time period shall be extended by the length of time during which you are in violation of this paragraph), you
          shall not directly or indirectly solicit the business (or otherwise deal in a manner adverse to the Company
          with) or provide any software engineering, consulting or programming services to any customer or end-user of
          any customer of the Company for which or for whose benefit you have provided services during your employment,
          either directly or indirectly solicit the services of (or otherwise deal in a manner adverse to the Company
          with) any employee of the Company or induced such employee to terminate his or her employment.
        </p>
        <p>
          During the term if you are assigned with CLIENTS and for a period of    <span className="newBoldClassForOfferLetter"><EditableSpan field="months" /></span> after termination or expiration
          of your employment with the Company, you agree that you will not in any manner, either on your own behalf or
          on behalf of any other person or entity, directly or indirectly compete with COMPANY by soliciting the CLIENT
          in any department or any location globally for any opportunities.
        </p>
        <p>For violations and restrictions please refer to Employee Handbook.</p>
      </div>

      <div className="offer-letter" ref={(el) => addPageRef(el, 3)}>
        <p>
        <span className="newBoldClassForOfferLetter">14. Safekeeping and Return of company property:</span>
        </p>
        <p>
          You will be responsible for the safekeeping and return in good condition of all the Company's properties,
          which may be in your use or custody. Company shall have the right to deduct the monetary value of such
          properties from your dues and take such actions as deemed proper in the event of your failure to account for
          them to the Company's satisfaction.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">15. Intellectual Property Rights:</span>
        </p>
        <p>
          You hereby agree that    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span> shall own, on a perpetual, irrevocable, exclusive,
          royalty-free, fully paid up, and worldwide basis, all right, title, and interest in, to, and under, including
          all Intellectual Property Rights throughout the world therein, all work product, both tangible and intangible,
          performed for the CLIENT, its Affiliates, or its or their clients or customers.
        </p>
        <p>
          You acknowledge and agree that you may use the Client's Materials solely for the benefit of{" "}
          <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>, its Affiliates, and the Services Recipients pursuant to this Agreement.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">16. Ownership of Client Data:</span>
        </p>
        <p>
          All Client Data is and shall remain the sole and exclusive property of    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span> /
          Client. Without
          <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>
          's approval (in its sole discretion), Contractor shall not use Client Data for any purpose other than to
          provide the Services.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">17. Rights Granted:</span>
        </p>
        <p>
          To the extent that any of the Services provided hereunder by you result in your creation of any works that may
          be protected under the copyright law, including, but not limited to computer    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>, (hereinafter "Work"), each such Work
          shall be deemed specially commissioned by    <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span> and shall be considered a "work
          made for hire", as defined in the India Copyright Act 1957.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">18. Compliance:</span>
        </p>
        <p>
          The company's rules, regulations, and directions relating to employees, including the Group's Code of Conduct,
          which are now or may hereafter be in force, will apply to you and will be strictly complied with by you. You
          should therefore acquaint yourself with all the Company rules and policies which are applicable to you.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">19. Data Protection:</span>
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
        <span className="newBoldClassForOfferLetter">20. Code of Conduct and Policies:</span>
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

      <div className="offer-letter" ref={(el) => addPageRef(el, 4)}>
        <p>
        <span className="newBoldClassForOfferLetter">21. No Waiver Survival:</span>
        </p>
        <p>
          No delay by the Company in enforcing any Company right under this Agreement constitutes a waiver. Upon
          termination of this Agreement, some provisions will survive and will be enforceable going forward.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">22. Governing Law and Jurisdiction:</span>
        </p>
        <p>
          This Agreement is subject exclusively to the law of India, the courts at [insert location] depending on the
          place of work will have exclusive jurisdiction over any claims between the parties (that is, over disputes
          under this Agreement and also over disputes that do not implicate provisions in this Agreement).
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">23. Entire Agreement:</span>
        </p>
        <p>
          This Agreement represents the entire agreement of the parties and it supersedes all prior statements,
          discussions and understandings. The Company reserves the right to change its policies from time to time. You
          would be informed in writing about any change in the Company policy. During your employment with the company,
          you shall be subject to all rules and regulations, as are made / amended by the company.
        </p>
        <p>
          Please confirm your acceptance of the terms and conditions of employment by signing the attached copy of this
          letter. Kindly ensure that you also initial each page and any attachment here to.
        </p>
        <p>
        <span className="newBoldClassForOfferLetter">Acceptance:</span>
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
        <b></b>
      </div>

      <div className="offer-letter" ref={(el) => addPageRef(el, 5)}>
        <p className="tname">Annexure "A"</p>
        <table className="salary-table">
          <thead>
            <tr>
              <th>Particular</th>
              <th>Per Month</th>
              <th>Per Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
              <span className="newBoldClassForOfferLetter">Total Earning per month</span>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Basic</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="basicpermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="basicperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>HRA</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="hrapermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="hraperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Conveyance</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="conveyancepermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="Conveyanceperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Medical Allowance</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="medicalallowancepermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="medicalallowanceperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Other Allowance</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="otherallowancepermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="otherallowanceperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Professional Allowance</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="professionalallowancepermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="professionalallowanceperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>LTA</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="ltapermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="ltaperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Bonus</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="bonuspermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="bonusperyear" /></span>
              </td>
            </tr>
            <tr className="total-row">
              <td>
              <span className="newBoldClassForOfferLetter">Total A</span>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="totalapermonth" /></span>
                </b>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="totalaperyear" /></span>
                </b>
              </td>
            </tr>
            <tr>
              <td>
              <span className="newBoldClassForOfferLetter">Additional payment as per government rule.</span>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Provident Fund - Employers 13%</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="providentfundpermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="providentfundperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>ESIC Employees 3.75% </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="esicpermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="esicperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Leave</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="leavepermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="leaveperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Bonus</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="secondbonuspermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="secondbonusperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Gratuity</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="graduitypermont" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="graduityperyear" /></span>
              </td>
            </tr>
            <tr className="total-row">
              <td>
              <span className="newBoldClassForOfferLetter">Total B</span>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="totalbpermonth" /></span>
                </b>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="totalbperyear" /></span>
                </b>
              </td>
            </tr>
            <tr className="highlight-row">
              <td>
              <span className="newBoldClassForOfferLetter">Total CTC per month salary A + B </span>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="totalctcpermonth" /></span>
                </b>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="totalctcperyear" /></span>
                </b>
              </td>
            </tr>
            <tr>
              <td>
              <span className="newBoldClassForOfferLetter">Deductions as per government rule. </span>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Provident Fund - Employees 12%</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="secondprovidentfundpermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="secondprovidentfundperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>ESIC Employees 0.75% </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="secondesicemppermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="secondesicempperyear" /></span>
              </td>
            </tr>
            <tr>
              <td>Professional Tax</td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="professionaltaxpermonth" /></span>
              </td>
              <td>
              <span className="newBoldClassForOfferLetter"><EditableSpan field="professionaltaxperyear" /></span>
              </td>
            </tr>
            <tr className="total-row">
              <td>
              <span className="newBoldClassForOfferLetter">Total Deduction C</span>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="totaldeductioncpermonth" /></span>
                </b>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"> <EditableSpan field="totaldeductioncperyear" /></span>
                </b>
              </td>
            </tr>
            <tr className="highlight-row">
              <td>
              <span className="newBoldClassForOfferLetter">Net Salary For Month </span>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="netsalarypermonth" /></span>
                </b>
              </td>
              <td>
                <b>
                <span className="newBoldClassForOfferLetter"><EditableSpan field="netsalaryperyear" /></span>
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
        <span className="newBoldClassForOfferLetter">Authorized Signatory</span>
        </p>
        <p>
          <b>
          <span className="newBoldClassForOfferLetter"><EditableSpan field="directorname" /></span>
          </b>
        </p>
        <p>
          <b>
          <span className="newBoldClassForOfferLetter"><EditableSpan field="companyName" /></span>
          </b>
        </p>
      </div>

      <div className="download-btn-container">
        <button onClick={downloadPDF} className="download-btn" disabled={isGeneratingPDF}>
          {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  )
}

export default OfferLetter;