 /* Name:-Prachi Parab Component:-PieChart report
         End LineNo:-1 to 105 Date:-10/07 */

         import React, { useState } from 'react';
         import "../Reports/PieChartReport.css";
         import { Pie } from 'react-chartjs-2';
         import { Chart, ArcElement,Tooltip } from 'chart.js';
         
         Chart.register(Tooltip);
         Chart.register(ArcElement);
         
         const PieChart = ({data}) => {
         
           console.log(data)
         
           
           const tableData = {
             labels: data.map(item => item.category),
         
             datasets: [
               {
                 label: '',
                 data:  data.map(item => item.count),
                 backgroundColor: [
                   'rgba(160, 82, 45, 0.7)',
                   '#ffc3ba',
                   '#B4B4B8',
                   'rgba(127,101,77,0.8)',
                   '#004c4c',
                   '#ff8080',
                   'rgba(117,118,118)',     
                   '#bf4545',     
                   '#ffded9',       
                   'rgba(127,108,84,0.5)',   
                   '#982828',     
                   '#f8cec8',   
                   '#008080',
                   'rgba(168,118,118, 0.9)',
                   '#EF9C66',
                   'rgba(255,213,175,0.7)',
                   '#6b0b0b'
         
                 ],
                 borderWidth: 2,
                 hoverOffset: 5,
               
                 
               },
               
             ],
            
             
           };
           const options = {
             tooltips: {
                 callbacks: {
                     label: function(tooltipItem, chartData) {
                         const dataset = chartData.datasets[tooltipItem.datasetIndex];
                         const label = chartData.labels[tooltipItem.index];
                         const value = dataset.data[tooltipItem.index];
                         
                         return `${label}: ${value}`;
                     }
                 }
             }
         };
         
         
         
         
           // if (!data || !data.datasets || data.datasets.length === 0 || !data.datasets[0].data || data.datasets[0].data.length === 0) {
           //   // Handle empty or invalid data scenario
           //   return <div>No data available for the pie chart</div>;
           // }
           
         
           return (
             <div className="chart-container">
               <div className='piechart-container'>
               <Pie data={tableData}  options={options}/>
               </div>
               <div>
                   <div className='piechrt-legends'>
                   <h5 className='text-index-piechart'>Index</h5>
                     <div className='piechart-legend-flex'>
                     
                   <ul className="legend">
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'rgba(160, 82, 45, 0.7)'}}></span> Selected</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#ffc3ba'}} ></span> Rejected</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#B4B4B8'}}></span> LineUp</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'rgba(127,101,77,0.8)'}}></span> Hold</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#004c4c'}}></span> Dropout</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#ff8080'}}></span> Join</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'rgba(117,118,118)'}} ></span> Not Join</li>
                     
                    
                   </ul>
                   <div className='piechart-legend-flex'>
                   <ul className="legend">
                   
                      <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#6b0b0b'}}></span> No Show</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#ffded9'}}></span> Active</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#ffded9'}}></span> Inactive</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'rgba(127,108,84,0.5)'}}></span> L1</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#982828'}} ></span> L2</li>
                     <li className="legend-item"><span className="legend-color" style={{backgroundColor:'#f8cec8'}}></span> L3</li>
            
                     </ul>
                     </div>
         
                   </div>
         
         
         
         
         
                 </div>
         
         
               </div>
         
               
             </div>
           );
         };
         
         export default PieChart;