/* Mohini_PainAreaSolving_19/07/2024_wholePage */
import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../AboutUs/painAreaSolving.css";

const PainAreaSolving = () => {
  const policyRef = useRef();
  const handleGeneratePDF = async () => {
    const painareaContainer = document.getElementById("painarea-containers");
    const canvas = await html2canvas(issueContainer, { scale: 2 });
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
    <div className="painarea-container">
      <div
        ref={policyRef}
        className="painarea-containers"
        id="painarea-containers"
      >
        <div className="painarea-header">
          <h1 className="painarea-header">Pain Area Solving</h1>
        </div>
        <div className="painarea-content">
          <h2>1.System Performance Issues</h2>
          <ul>
            <li>
              Description: Clients often face problems with system speed,
              responsiveness, and overall performance.
            </li>
          </ul>
          <h5>Pain Areas:</h5>
          <ul>
            <li>
              Slow Processing: Systems may lag or take too long to process
              requests or data.
            </li>
            <li>Downtime: Frequent outages or unavailability of services.</li>
            <li>
              Scalability: Difficulty in scaling systems to handle increased
              loads or growth.
            </li>
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>Optimize code and infrastructure.</li>
            <li>
              Implement performance monitoring tools to proactively address
              issues.
            </li>
            <li>Upgrade hardware or cloud resources to improve scalability.</li>
          </ul>
          <h2>2.Integration Challenges</h2>
          <ul>
            <li>
              Description: Problems with integrating new systems or technologies
              with existing ones.{" "}
            </li>
          </ul>
          <h5>Pain Areas:</h5>
          <ul>
            <li>
              Compatibility Issues: Difficulties in ensuring different systems
              work together seamlessly.{" "}
            </li>
            <li>
              Data Silos: Fragmented data across multiple systems, leading to
              inefficiencies.
            </li>
            <li>
              Complex Integration Processes: High complexity in integrating
              various tools and platforms.{" "}
            </li>
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>
              Develop and use middleware solutions to facilitate integration.
            </li>
            <li>
              Provide custom integration services to ensure compatibility.
            </li>
            <li>Implement data synchronization and integration frameworks.</li>
          </ul>
          <h2>3.User Experience (UX) Problems</h2>
          <ul>
            <li>
              Description: Issues related to the usability and functionality of
              systems from the end-user perspective.
            </li>{" "}
          </ul>
          <h5>Pain Areas:</h5>
          <ul>
            <li>
              Complex Interfaces: Difficult-to-navigate or non-intuitive user
              interfaces.
            </li>
            <li>
              Lack of Customization: Systems that do not cater to specific user
              needs or preferences.
            </li>
            <li>Poor Performance: Interfaces that are slow or unresponsive.</li>
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>
              Conduct user research and usability testing to design intuitive
              interfaces.{" "}
            </li>
            <li>
              Implement customizable features to tailor the system to user
              needs.
            </li>
            <li>
              Optimize UI/UX to improve performance and user satisfaction.
            </li>
          </ul>
          <h2>4.Support and Maintenance</h2>
          <ul>
            <li>
              Description: Challenges related to the ongoing support and
              maintenance of IT systems.
            </li>
          </ul>
          <h5>Pain Areas:</h5>
          <ul>
            <li>
              Inadequate Support: Delays or insufficient support for resolving
              issues.
            </li>
            <li>
              Lack of Documentation: Insufficient or outdated documentation for
              systems.
            </li>
            <li>
              High Maintenance Costs: Expensive or time-consuming maintenance
              tasks.{" "}
            </li>
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>Provide responsive and effective customer support services.</li>
            <li>
              Offer regular maintenance and updates to keep systems running
              smoothly.
            </li>
            <li>
              Ensure comprehensive and up-to-date documentation for clients.
            </li>
          </ul>
          <h2>5.Cost Management</h2>
          <ul>
            <li>
              Description: Concerns about the cost-effectiveness of IT solutions
              and services.
            </li>
          </ul>

          <h5>Pain Areas:</h5>
          <ul>
            <li>
              High Costs: Expensive initial investments or ongoing operational
              costs.
            </li>
            <li>
              ROI Concerns: Uncertainty about the return on investment for IT
              solutions.
            </li>
            <li>
              Unpredictable Expenses: Unexpected costs related to system
              failures or upgrades.
            </li>
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>
              Offer flexible pricing models, including subscription-based or
              pay-as-you-go options.
            </li>
            <li>
              Provide cost-benefit analyses to demonstrate the value of
              solutions.
            </li>
            <li>Implement cost-control measures and budgeting tools.</li>
          </ul>
          <h2>6.Training and Adoption</h2>
          <ul>
            <li>
              Description: Issues related to the training of staff and the
              adoption of new technologies.{" "}
            </li>
          </ul>

          <h5>Pain Areas:</h5>
          <ul>
            <li>
              Lack of Training: Insufficient training leading to poor use of
              systems.
            </li>
            <li>
              Resistance to Change: Employees reluctant to adopt new
              technologies.
            </li>
            <li>
              Implementation Difficulties: Challenges in integrating new
              technologies into existing workflows.
            </li>
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>Offer comprehensive training programs and resources.</li>
            <li>
              Implement change management strategies to facilitate adoption.
            </li>
            <li>
              Provide support during and after implementation to ensure smooth
              transitions.
            </li>
          </ul>
          <h2>7.Customization Needs</h2>
          <ul>
            <li>
              Description: Requirements for custom features or modifications to
              standard solutions.
            </li>{" "}
          </ul>

          <h5>Pain Areas:</h5>
          <ul>
            <li>
              Limited Flexibility: Off-the-shelf solutions may not meet specific
              business needs.
            </li>
            <li>
              High Customization Costs: Expensive or complex customization
              requirements.
            </li>

            <li>
              Long Development Times: Extended timelines for developing custom
              features.{" "}
            </li>
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>Offer customizable solutions and modular designs.</li>
            <li>
              Provide consulting services to understand and address specific
              needs.{" "}
            </li>
            <li>
              Implement agile development practices to accelerate customization.
            </li>
          </ul>
          <h2>8.Data Security and Compliance</h2>
          <ul>
            <li>
              Description: Concerns about data breaches, security
              vulnerabilities, and regulatory compliance.
            </li>
          </ul>
          <h5>Pain Areas:</h5>
          <ul>
            <li>Data Breaches: Risk of unauthorized access or data loss.</li>
            <li>
              Compliance Issues: Difficulty in meeting industry-specific
              regulations.
            </li>
            <li>
              Inadequate Security Measures: Weak encryption, outdated security
              protocols.
            </li>{" "}
          </ul>
          <h5>Solutions:</h5>
          <ul>
            <li>
              Implement robust security measures, including encryption and
              access controls.{" "}
            </li>
            <li>
              Regularly update and patch systems to address vulnerabilities.
            </li>
            <li>Provide compliance consulting and auditing services.</li>
          </ul>
        </div>
      </div>
      <button className="lineUp-Filter-btn" onClick={handlePrint}>
        Export PDF
      </button>
    </div>
  );
};

export default PainAreaSolving;

/* Mohini_PainAreaSolving_19/07/2024_wholePage */
