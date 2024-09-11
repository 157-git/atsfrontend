/* Mohini_WorkplacePolicy_19/07/2024_wholePage */
import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../AboutUs/companyPolicy.css";

const WorkplacePolicy = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("");
  const policyRef = useRef();
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleVerify = () => {
    if (isChecked) {
      setMessage("You have agreed to the Workplace Health and Safety Policy.");
      alert("Verification successful!");
      handlePrint();
    } else {
      setMessage("Please agree to the policy before proceeding.");
      alert("Please agree to the policy before proceeding.");
    }
  };

  const handleGeneratePDF = async () => {
    const policyContainer = document.getElementById("policy-containers");
    const canvas = await html2canvas(policyContainer, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // Set margin size (in points)
    const borderWidth = 1; // Set border width (in points)

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
      pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
      pdf.rect(margin, margin, contentWidth, pdfHeight - 2 * margin); // Add border

      heightLeft -= pdfHeight - 2 * margin;
      position -= pdfHeight - 2 * margin; // Adjust position for next page

      page++;
    }

    // Saving the PDF
    pdf.save("WorkplacePolicy.pdf");
  };
  const handlePrint = useReactToPrint({
    content: () => policyRef.current,
    documentTitle: "WorkplacePolicy",
  });

  return (
    <div className="policy-container">
      <div ref={policyRef} className="policy-containers" id="policy-containers">
        <div className="policy-header">
          <h1> Company Policy</h1>
        </div>
        <div className="policy-content">
          <h2>Equal opportunity policy</h2>
          <h5>Policy Statement:</h5>
          <ul>
            <li>
              The company is committed to providing equal employment
              opportunities to all employees and applicants without regard to
              race, color, religion, gender, national origin, age, disability,
              or any other legally protected status.
            </li>
          </ul>
          <h5>Scope:</h5>
          <ul>
            <li>
              This policy applies to all aspects of employment, including
              recruitment, hiring, training, promotion, compensation, benefits,
              and termination.
            </li>
          </ul>
          <h5>Non-Discrimination:</h5>
          <ul>
            <li>
              The company prohibits discrimination in any form and strives to
              create a work environment that is free from harassment and bias.
            </li>
          </ul>
          <h5>Diversity and Inclusion:</h5>
          <ul>
            <li>
              The company values diversity and inclusion, recognizing that
              diverse teams foster innovation and improve business outcomes.
            </li>
          </ul>
          <h5>Reasonable Accommodations:</h5>
          <ul>
            <li>
              The company will provide reasonable accommodations to employees
              with disabilities and religious practices, as required by law.
            </li>
          </ul>
          <h5>Reporting and Grievance Procedure:</h5>
          <ul>
            <li>
              Employees are encouraged to report any incidents of discrimination
              or harassment to their manager or HR department. All reports will
              be investigated promptly and confidentially.
            </li>
          </ul>
          <h5>Accountability:</h5>
          <ul>
            <li>
              The company provides regular training to employees on diversity,
              inclusion, and anti-discrimination practices.
            </li>
          </ul>
          <h5>Review and Monitoring:</h5>
          <ul>
            <li>
              The policy is reviewed regularly to ensure it remains current and
              effective. Monitoring is conducted to assess compliance and
              address any issues.
            </li>
          </ul>

          <h2>Workplace health and safety</h2>
          <h5>Policy Statement:</h5>
          <ul>
            <li>
              Our company is committed to providing a safe and healthy work
              environment for all employees, contractors, and visitors.
            </li>
          </ul>
          <h5>Responsibilities:</h5>
          <ul>
            <li>
              Management: Ensure compliance with safety regulations and provide
              resources for health and safety initiatives.
            </li>
            <li>
              Employees: Follow safety procedures and report hazards or
              incidents immediately.
            </li>
          </ul>
          <h5>Emergency Procedures:</h5>
          <ul>
            <li>
              Establish clear emergency procedures and conduct regular drills to
              ensure preparedness.
            </li>
          </ul>
          <h5>Health and Wellness:</h5>
          <ul>
            <li>
              Promote employee wellness programs to support mental and physical
              health.
            </li>
          </ul>
          <h5>Equipment and Maintenance:</h5>
          <ul>
            <li>
              Ensure all equipment is regularly inspected, maintained, and meets
              safety standards.
            </li>
          </ul>
          <h5>Continuous Improvement:</h5>
          <ul>
            <li>
              Review and update the safety policy regularly to incorporate best
              practices and comply with legal requirements.
            </li>
          </ul>

          <h2>Employee code of conduct policy:</h2>
          <h5>Introduction:</h5>
          <ul>
            <li>
              This policy outlines the expected behavior and standards for all
              employees to ensure a respectful and professional workplace.
            </li>
          </ul>
          <h5>Respectful Behavior:</h5>
          <ul>
            <li>
              Employees must treat colleagues, clients, and partners with
              respect and courtesy at all times.
            </li>
          </ul>
          <h5>Integrity and Honesty:</h5>
          <ul>
            <li>
              Maintain honesty and transparency in all business dealings. Avoid
              conflicts of interest and report any unethical behavior.
            </li>
          </ul>
          <h5>Confidentiality:</h5>
          <ul>
            <li>
              Protect confidential information and do not disclose it to
              unauthorized parties.
            </li>
          </ul>
          <h5>Compliance with Laws:</h5>
          <ul>
            <li>
              Adhere to all applicable laws and regulations relevant to the
              business and industry.
            </li>
          </ul>
          <h5>Professionalism:</h5>
          <ul>
            <li>
              Demonstrate professionalism in appearance, communication, and
              conduct.
            </li>
          </ul>
          <h5>Use of Company Resources:</h5>
          <ul>
            <li>
              Use company resources responsibly and for business purposes only.
            </li>
          </ul>
          <h5>Anti-Discrimination and Harassment:</h5>
          <ul>
            <li>
              Uphold a zero-tolerance policy for discrimination, harassment, or
              any form of bullying.
            </li>
          </ul>
          <h5>Health and Safety:</h5>
          <ul>
            <li>
              Follow health and safety guidelines to ensure a safe working
              environment for everyone.
            </li>
          </ul>
          <h5>Reporting Violations:</h5>
          <ul>
            <li>
              Demonstrate professionalism in appearance, communication, and
              conduct.
            </li>
          </ul>
          <h5>Disciplinary Action:</h5>
          <ul>
            <li>
              Violations of the code may result in disciplinary action, up to
              and including termination.
            </li>
          </ul>

          <h2>Attendance, vacation and time-off policies:</h2>
          <h3>Attendance Policy</h3>
          <h5>Punctuality:</h5>
          <ul>
            <li>
              Employees are expected to arrive on time and be prepared to start
              work at the beginning of their scheduled shift.
            </li>
          </ul>
          <h5>Absence Notification:</h5>
          <ul>
            <li>
              Notify your manager as soon as possible if you are unable to
              attend work due to illness or emergency.
            </li>
          </ul>
          <h5>Documentation:</h5>
          <ul>
            <li>
              Provide necessary documentation for absences when required (e.g.,
              doctor's note).
            </li>
          </ul>
          <h5>Consequences:</h5>
          <ul>
            <li>
              Excessive unexcused absences may lead to disciplinary action.
            </li>
          </ul>

          <h3>Vacation Policy</h3>
          <h5>Accrual:</h5>
          <ul>
            <li>
              Vacation days are accrued based on length of service and company
              policy.
            </li>
          </ul>
          <h5>Request Process:</h5>
          <ul>
            <li>
              Submit vacation requests in advance for approval by your manager,
              ensuring minimal disruption to operations.
            </li>
          </ul>
          <h5>Carryover:</h5>
          <ul>
            <li>
              Unused vacation days may be carried over to the next year, up to a
              specified limit.
            </li>
          </ul>
          <h5>Payout:</h5>
          <ul>
            <li>
              Upon leaving the company, employees will be paid for any unused
              vacation days.
            </li>
          </ul>

          <h3>Time-Off Policy</h3>
          <h5>Sick Leave:</h5>
          <ul>
            <li>
              Employees are entitled to a certain number of paid sick days per
              year. Notify your manager as soon as possible if you need to take
              a sick day.
            </li>
          </ul>
          <h5>Personal Days:</h5>
          <ul>
            <li>
              Personal days can be used for personal matters and should be
              scheduled in advance when possible.
            </li>
          </ul>
          <h5>Family and Medical Leave:</h5>
          <ul>
            <li>
              Eligible employees may take unpaid leave for family or medical
              reasons, in accordance with legal requirements.
            </li>
          </ul>
          <h5>Public Holidays:</h5>
          <ul>
            <li>
              The company observes all federal and state holidays, providing
              paid time off.
            </li>
          </ul>

          <h2>Employee disciplinary action policy:</h2>

          <h5>Purpose:</h5>
          <ul>
            <li>
              Ensure fair and consistent handling of employee misconduct and
              performance issues.
            </li>
          </ul>
          <h5>Scope:</h5>
          <ul>
            <li>
              Applies to all employees and covers behavior, performance, and
              conduct.
            </li>
          </ul>
          <h5>Purpose:</h5>
          <ul>
            <li>
              Ensure fair and consistent handling of employee misconduct and
              performance issues.
            </li>
          </ul>
          <h5>Steps of Disciplinary Action:</h5>
          <ul>
            <li>
              Verbal Warning: For minor infractions, a verbal warning will be
              issued and documented.
            </li>
            <li>
              Written Warning: For repeated or serious issues, a formal written
              warning will be given.
            </li>
            <li>
              Final Warning: Further issues may result in a final written
              warning, outlining potential consequences.
            </li>
            <li>
              Suspension: Temporary removal from work may be implemented, with
              or without pay.
            </li>
            <li>
              Termination: Persistent issues or severe misconduct may lead to
              termination.
            </li>
          </ul>
          <h5>Types of Misconduct:</h5>
          <ul>
            <li>
              Examples include but are not limited to: insubordination,
              harassment, theft, policy violations, and poor performance.
            </li>
          </ul>
          <h5>Investigation:</h5>
          <ul>
            <li>
              All allegations will be promptly investigated. Employees may be
              placed on leave during the investigation.
            </li>
          </ul>
          <h5>Employee Rights:</h5>
          <ul>
            <li>
              Employees have the right to respond to allegations and present
              their case.
            </li>
          </ul>
          <h5>Confidentiality:</h5>
          <ul>
            <li>
              All disciplinary actions and investigations will be conducted with
              confidentiality.
            </li>
          </ul>
          <h5>Appeal Process:</h5>
          <ul>
            <li>
              Employees may appeal disciplinary actions by submitting a written
              request for review.
            </li>
          </ul>
          <h5>Documentation:</h5>
          <ul>
            <li>
              All steps and outcomes will be documented and stored in the
              employee's personnel file.
            </li>
          </ul>

          <h2>Employee complaint policies:</h2>
          <h5>Purpose:</h5>
          <ul>
            <li>
              Provide a process for employees to raise concerns or complaints in
              a safe and constructive manner.
            </li>
          </ul>
          <h5>Scope:</h5>
          <ul>
            <li>
              Applicable to all employees regarding workplace issues, including
              harassment, discrimination, and policy violations.
            </li>
          </ul>
          <h5>Procedure:</h5>
          <ul>
            <li>
              Informal Resolution: Employees are encouraged to address concerns
              directly with the involved party if comfortable.
            </li>
            <li>
              Formal Complaint: Submit a written complaint to HR detailing the
              issue, including dates, times, and any witnesses.
            </li>
          </ul>
          <h5>Investigation:</h5>
          <ul>
            <li>
              HR will investigate all complaints promptly and impartially.
              Confidentiality will be maintained as much as possible.
            </li>
          </ul>
          <h5>Resolution:</h5>
          <ul>
            <li>
              After the investigation, HR will communicate findings and any
              actions taken to the complainant and involved parties.
            </li>
          </ul>
          <h5>Retaliation:</h5>
          <ul>
            <li>
              Retaliation against anyone filing a complaint or participating in
              an investigation is strictly prohibited and will result in
              disciplinary action.
            </li>
          </ul>
          <h5>Support:</h5>
          <ul>
            <li>
              Employees may seek support from HR throughout the process and are
              encouraged to speak up without fear.
            </li>
          </ul>

          <h2>Ethics Policy</h2>

          <h5>Purpose:</h5>
          <ul>
            <li>
              Promote integrity, accountability, and ethical behavior in all
              business activities.
            </li>
          </ul>
          <h5>Scope:</h5>
          <ul>
            <li>
              Applies to all employees, contractors, and representatives of the
              company.
            </li>
          </ul>
          <h5>Core Principles:</h5>
          <ul>
            <li>Integrity: Conduct business honestly and transparently.</li>
            <li>Respect: Treat all individuals with dignity and fairness.</li>
            <li>
              Accountability: Take responsibility for actions and decisions.
            </li>
          </ul>
          <h5>Conflicts of Interest:</h5>
          <ul>
            <li>
              Avoid situations where personal interests conflict with company
              interests. Disclose any potential conflicts to management.
            </li>
          </ul>
          <h5>Confidentiality:</h5>
          <ul>
            <li>
              Protect confidential and proprietary information. Do not share it
              without authorization.
            </li>
          </ul>
          <h5>Compliance:</h5>
          <ul>
            <li>Adhere to all laws, regulations, and company policies.</li>
          </ul>
          <h5>Fair Dealing:</h5>
          <ul>
            <li>
              Engage in fair and honest dealings with customers, suppliers, and
              competitors.
            </li>
          </ul>
          <h5>Reporting Violations:</h5>
          <ul>
            <li>
              Report any unethical behavior or policy violations to HR or a
              designated ethics officer.
            </li>
          </ul>
          <h5>Non-Retaliation:</h5>
          <ul>
            <li>
              Ensure no retaliation against individuals who report concerns in
              good faith.
            </li>
          </ul>
          <h5>Training:</h5>
          <ul>
            <li>
              Participate in regular ethics training to reinforce ethical
              standards.
            </li>
          </ul>

          <h2>Work Schedule And Rest Period Policies</h2>
          <h3>Work Schedule</h3>
          <h5>Standard Hours:</h5>
          <ul>
            <li>
              Employees are expected to work [insert standard hours, e.g., 9 AM
              to 5 PM], Monday through Friday.
            </li>
          </ul>
          <h5>Flexible Hours:</h5>
          <ul>
            <li>
              Flexible work arrangements may be available with manager approval.
            </li>
          </ul>
          <h5>Overtime:</h5>
          <ul>
            <li>
              Overtime requires prior approval and will be compensated in
              accordance with legal requirements.
            </li>
          </ul>
          <h5>Shift Work:</h5>
          <ul>
            <li>
              Shift schedules will be communicated in advance and rotations will
              be managed fairly.
            </li>
          </ul>
          <h3>Rest Periods</h3>
          <h5>Breaks:</h5>
          <ul>
            <li>
              Employees are entitled to [insert duration, e.g., 15-minute]
              breaks for every [insert hours, e.g., 4 hours] worked.
            </li>
          </ul>
          <h5>Lunch:</h5>
          <ul>
            <li>
              A [insert duration, e.g., 1-hour] lunch break is provided each
              workday.
            </li>
          </ul>
          <h5>Rest Days:</h5>
          <ul>
            <li>
              Employees are entitled to at least one full day of rest each week.
            </li>
          </ul>
          <h5>Compliance:</h5>
          <ul>
            <li>
              Rest periods comply with applicable labor laws and regulations.
            </li>
          </ul>
        </div>
      </div>
      <div className="policy-agreement">
        <input
          type="checkbox"
          id="agree"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="agree">
          I agree to the Workplace Health and Safety Policy
        </label>
      </div>
      <div className="vefify-button">
        <button className="policy-button" onClick={handleVerify}>
          Verify
        </button>
        <button className="policy-button" onClick={handleVerify}>
          Export PDF
        </button>
      </div>
      <div>{message && <p className="policy-message">{message}</p>}</div>
    </div>
  );
};

export default WorkplacePolicy;
/* Mohini_WorkplacePolicy_19/07/2024_wholePage */
