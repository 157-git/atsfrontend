// Prachi Parab  component :Rights + instructions + best view + information  19/07/2024 wholepage


import React, { useRef } from 'react';
import '../IssueLetter/IssueLetter.css';
import { useReactToPrint } from 'react-to-print';

const IssueLetter = () => {
    const policyRef=useRef();

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
        pdf.save('IssueLetter.pdf');
    };

    
    const handlePrint = useReactToPrint({
        content: () => policyRef.current,
        documentTitle: 'Issue Letter',
    });
  

  return (
    <div className='rightsandInstructions'>

    <div ref={policyRef}  className="issue-containers"id='issue-containers'> 
        
        
      
        <div id='issueletter' className='issueLetterdiv'>
        <div className="policy-header">  
        <h3 >Issue Letter</h3>
        </div>

      
        <p className='Instruction-soft'>
        <p>Company Name</p>
        <p>Manager Name /HR Name </p>
        <p>Mobile No</p>


        <p>Date:</p>

        <p>To,</p>

       <p>Mr.</p> 

        <p>----------------------</p>

        <p>---------------------</p>



        <p>Sub. Warning Letter</p>

        <p>Mr./Mrs.</p>

        <p>It has been observed that since your joining you are not performing up to the level that been expected, resulting to put you in the list of poor performers, which is directly resulting in willful insubordination and gross negligence of duties, in your capacity as Operator.

        Performing below the level is making yourself liable for necessary action.</p>

        <p>You are hereby warned to develop your performance; failure to do so shall invoke appropriate action.</p>

        <p>You are further advised to submit a written explanation on your poor performance as soon as you receive this letter.</p>

        <p>Kindly treat this as very urgent.</p>

        <p>For' -----------------------</p>

        <p>Name:</p>

        <p>Designation</p>

          

        </p>
        </div>

        

       
        </div>
        <div className='handlePrintDiv'>
        <button className='issue-button' onClick={handlePrint}>Export PDF</button>
        </div>
      

      
    
    </div>
  );
};

export default IssueLetter;