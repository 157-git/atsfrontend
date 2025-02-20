import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Button, Checkbox, Dropdown, Menu } from 'antd';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartReportComponent = ({filteredLineUpItems, showChart, selectedSubCategories, selectedCategory, categories}) => {

    // const [selectedCategory, setSelectedCategory] = useState(null);
    // const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [showChartProp, setShowChartProp] = useState(showChart);
    // const [displaySelectCategories, setDisplaySelectCategories]= useState(false);
    // const [openSubMenu, setOpenSubMenu] = useState(false);

    // const categories = {
    //     "Candidate's Id": "candidateId",
    //     "Source Name": "sourceName",
    //     "Job Designation": "jobDesignation",
    //     "Recruiter's Name": "recruiterName",
    //     "Applying Company": "requirementCompany",
    //     "Experience" : "experienceYear"
    // };

    // const handleCategorySelect = (category) => {
    //     setSelectedCategory(category);
    //     setSelectedSubCategories([]);
    //     setOpenSubMenu(true);
    //     setShowChart(false);
    // };

    // const uniqueValues = selectedCategory ? [...new Set(filteredLineUpItems.map(item => item[categories[selectedCategory]]))] : [];

    // const handleSubCategorySelect = (subCategory) => {
    //     setSelectedSubCategories(prev => prev.includes(subCategory) 
    //         ? prev.filter(item => item !== subCategory) 
    //         : [...prev, subCategory]
    //     );
    // };

    // const generateChart = () => {
    //   setOpenSubMenu(false);
    //     setShowChart(true);
    // };

    const chartData = {
      labels: selectedSubCategories,
      datasets: [
          {
              label: `Number of Candidates by ${selectedCategory}`,
              data: selectedSubCategories.map(subCat => 
                  filteredLineUpItems.filter(item => item[categories[selectedCategory]] === subCat).length
              ),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
      ],
  };

//   const toggleSelectCategory = ()=>{
// setDisplaySelectCategories(!displaySelectCategories);
// setSelectedCategory(null);
// setShowChart(false);
//   }
  return (
  <>
  <div className='setwidthacordingtoadjustchartsclass'>
  {/* <div className="displaycenterbuttons">
<Button className='setmarginforchartbuttons' onClick={() => toggleSelectCategory()}>Generate Report Chart</Button>
                    
{displaySelectCategories && (
        <Dropdown
        
          overlay={
            <Menu>
              {Object.keys(categories).map((category) => (
                <Menu.Item key={category} onClick={() => handleCategorySelect(category)}>
                  {category}
                </Menu.Item>
              ))}
            </Menu>
          }
          trigger={["click"]}
          
        >
          <Button className='setmarginforchartbuttons'>{selectedCategory ? selectedCategory : "Select a Category"}</Button>
        </Dropdown>
      )}


{selectedCategory && (
  <>
        <Dropdown
          overlay={
            <Menu>
              {uniqueValues.map((value) => (
                <>

                 <Menu.Item key={value}>
<Checkbox value={value} onChange={() => handleSubCategorySelect(value)}>{value}</Checkbox>
                 </Menu.Item>
  
            </>
              ))
          
              }
              <div className="generatechartbuttondiv">
              <Button type="primary"
                  onClick={generateChart}>Generate Chart</Button>
              </div>
                
            </Menu>
          }
          trigger={["click"]}
          open={openSubMenu}
        >
          <Button onClick={()=>setOpenSubMenu(!openSubMenu)}>{`Select Subcategories for ${selectedCategory}:`}</Button>
        </Dropdown>
    
        </>
      )}
          
</div> */}
  
            {/* {displaySelectCategories && (
                <div>
                    <h5>Select a Category:</h5>
                    {Object.keys(categories).map(category => (
                        <button key={category} onClick={() => handleCategorySelect(category)}>{category}</button>
                    ))}
                </div>
            )}

            {selectedCategory && (
                <div>
                    <h5>Select Subcategories for {selectedCategory}:</h5>
                    {uniqueValues.map(value => (
                        <label key={value}>
                            <input type="checkbox" value={value} onChange={() => handleSubCategorySelect(value)} />
                            {value}
                        </label>
                    ))}
                    <button onClick={generateChart}>Generate Chart</button>
                </div>
            )} */}
                     {showChartProp && (
                <div>
                    <Bar data={chartData} />
                </div>
            )}
  </div>
  </>
  )
}

export default BarChartReportComponent
