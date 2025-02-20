import { Button, Checkbox, Dropdown, Menu } from 'antd';
import React, { useState } from 'react'

const ChartFilterComponent = ({filteredLineUpItems, setShowChartPropFromFilterComp, setSelectedSubCategoriesProp}) => {
    console.log(filteredLineUpItems);
    
     const [showChart, setShowChart] = useState(false);
    const [displaySelectCategories, setDisplaySelectCategories]= useState(false);
     const [selectedCategory, setSelectedCategory] = useState(null);
      const [selectedSubCategories, setSelectedSubCategories] = useState([]);
        const [openSubMenu, setOpenSubMenu] = useState(false);

     const categories = {
        "Candidate's Id": "candidateId",
        "Source Name": "sourceName",
        "Job Designation": "jobDesignation",
        "Recruiter's Name": "recruiterName",
        "Applying Company": "requirementCompany",
        "Experience" : "experienceYear"
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedSubCategories([]);
        setOpenSubMenu(true);
        setShowChart(false);
    };


    const uniqueValues = selectedCategory ? [...new Set(filteredLineUpItems.map(item => item[categories[selectedCategory]]))] : [];
    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategories(prev => prev.includes(subCategory) 
            ? prev.filter(item => item !== subCategory) 
            : [...prev, subCategory]
        );
        setSelectedSubCategoriesProp(prev => prev.includes(subCategory) 
        ? prev.filter(item => item !== subCategory) 
        : [...prev, subCategory]
    );
    };

    const generateChart = () => {
        setOpenSubMenu(false);
          setShowChart(true);
          setShowChartPropFromFilterComp(true);
      };
    const toggleSelectCategory = ()=>{
        setDisplaySelectCategories(!displaySelectCategories);
        setSelectedCategory(null);
        setShowChart(false);
          }
  return (
<>
<div>
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
                {/* <Menu.Item key={value} onClick={() => handleCategorySelect(value)}>
                  {value}
                </Menu.Item>
                 */}
                 <Menu.Item key={value}>
<Checkbox value={value} onChange={() => handleSubCategorySelect(value)}>{value}</Checkbox>
                 </Menu.Item>
                {/* <label key={value}>
                <input type="checkbox" value={value} onChange={() => handleSubCategorySelect(value)} />
                {value}
            </label> */}
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
</div>
</>
  )
}

export default ChartFilterComponent
