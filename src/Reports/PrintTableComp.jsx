import React from 'react'

const PrintTableComp = ({userName, currentDate, finalStartDatePropState, finalEndDatePropState, data}) => {
  return (
     <div className="tablecont">
             <div className="tabledivmain">
               <div className="infodiv">
                 <p>{userName}</p>
                 <p>{currentDate}</p>
                 <p>
                   This Report Data Is Generated From {finalStartDatePropState} to{" "}
                   {finalEndDatePropState}
                 </p>
               </div>
               <table className="textAlignCenterForTableOfReport">
                 <thead>
                   <tr>
                     <td className="forborderfortds widthSetForTds">Categories</td>
                     <td className="widthSetForTds">Counts</td>
                   </tr>
                 </thead>
                 <tbody>
                   {data.map((item, index) => (
                     <tr>
                       <td className="forborderfortds widthSetForTds">
                         {item.category}
                       </td>
                       <td className="widthSetForTds">{item.count}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
  )
}

export default PrintTableComp
