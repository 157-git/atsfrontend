 /* Name:-Prachi Parab Component:-Generate pdf file page 
         End LineNo:-4 to 93 Date:-08/07 */

         import { drawText, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
         
         async function createPdf(data,SuperUserName,TeamLeaderName,ManagerName,RecruiterName,DateReportData,totalCandidatepdf) {
             const pdfDoc = await PDFDocument.create();
             const page = pdfDoc.addPage();
             const { width, height } = page.getSize();
             const headers=['Status of Candidate','No of Candidate']
         
             const tableRows=data.map((row)=>[row.category,row.count.toString()]);
         
             const font=await pdfDoc.embedFont(StandardFonts.Helvetica);
             const fontSize=12;
             const fontSizeHeader=14;
         
            // Table settings
           const tableTopMargin = 700; // Adjust as needed
           const columnWidths = [200, 200]; // Adjust column widths
           const rowHeight = 20;
           const tableLeftMargin = 50;
           const cellPadding = 5;
           const borderWidth = 1; // Border width
           const topPosition = height - 50;
          
           // Draw table headers with borders
           let y = tableTopMargin;
           
           page.drawText(SuperUserName,{
             x: 50,
             y: 792 ,
             size: 12,
             color: rgb(0, 0, 0)
           });
           page.drawText(ManagerName,{
             x: 50,
             y: 776,
             size: 12,
             color: rgb(0, 0, 0)
           });
           page.drawText(TeamLeaderName,{
             x: 50,
             y: 760,
             size: 12,
             color: rgb(0, 0, 0)
           });
           page.drawText(RecruiterName,{
             x: 50,
             y: 746,
             size: 12,
             color: rgb(0, 0, 0)
           });
         
         
         
           page.drawText(DateReportData,{
             x: 300,
             y: topPosition,
             size: 12,
             color: rgb(0, 0, 0)
           });
         
         
          
         
           headers.forEach((header, columnIndex) => {
             drawTableCell(page, header, tableLeftMargin + sum(columnWidths.slice(0, columnIndex)) + cellPadding, y, columnWidths[columnIndex], rowHeight, fontSizeHeader, font, true);
           });
           y -= rowHeight;
         
         
         
           // Draw table rows with borders
           tableRows.forEach((row) => {
             row.forEach((cell, columnIndex) => {
               drawTableCell(page, cell, tableLeftMargin + sum(columnWidths.slice(0, columnIndex)) + cellPadding, y, columnWidths[columnIndex], rowHeight, fontSize, font);
             });
             y -= rowHeight;
           });
          page.drawText(totalCandidatepdf,{
             x: 300,
             y: 330,
             size: 14,
             color: rgb(0, 0, 0)
           });
           
           
         
         
         //   pdfDoc.setTitle('Table Data');
         
             const pdfBytes = await pdfDoc.save();
             
             return URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
           }
         
           function sum(arr) {
             return arr.reduce((acc, val) => acc + val, 0);
           }
         
           function drawTableCell(page, text, x, y, width, height, fontSize, font, isHeader = false) {
             // Draw border
             page.drawRectangle({
               x,
               y,
               width,
               height,
               borderColor: rgb(0, 0, 0),
               borderWidth: 1,
             });
         
              // Calculate text position for center alignment
             const textWidth = font.widthOfTextAtSize(text, fontSize);
             const textHeight = font.heightAtSize(fontSize);
             const textX = x + (width - textWidth) / 2;
             const textY = y + height - (height - textHeight) / 2 - 10; // Adjusted for text alignment
         
         
               // Draw text
         //   const textX = x +height; // Padding left
         //   const textY = y + height -12; // Adjusted for text alignment
           page.drawText(text, {
             x: textX,
             y: textY,
             size: fontSize,
             font,
             color: rgb(0, 0, 0),
             
             lineHeight: 14, // Adjust line height as needed
             textAlign: 'center', // Adjust text alignment as needed (left, right, center)
             verticalAlign: 'bottom', // Adjust vertical alignment as needed (top, middle, bottom)
           });
           
         
           
         }
           
           export { createPdf };