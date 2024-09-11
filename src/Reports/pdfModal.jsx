 /* Name:-Prachi Parab Component:-Create Report Table page 
         End LineNo:-4 to 28 Date:-09/07 */

         import React from 'react';
         import Modal from 'react-modal';
         import PieChartReport from '../Reports/PieChartReport';
         import SliderReport from '../Reports/SliderReports';
         
         Modal.setAppElement('#root'); // Set the root element for accessibility
         
         const PdfModal = ({ isOpen, closeModal, pdfContent }) => {
           return (
             <Modal
               isOpen={isOpen}
               onRequestClose={closeModal}
               contentLabel="PDF Modal"
               className="pdf-modal"
             >
               <div>
                 <button onClick={closeModal}>Close</button>
                
                 {/* <embed src={pdfContent} type="application/pdf" width="100%" height="500px" /> */}
                 
                <div>root.render(<PieChartReport />);  </div>
                 <SliderReport/>
               </div>
             </Modal>
           );
         };
         
         export default PdfModal;