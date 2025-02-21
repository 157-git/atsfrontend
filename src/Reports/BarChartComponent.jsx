import React from 'react';
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = ({ selectedCategory, selectedSubCategories, filteredLineUpItems, selectedStatusCategory }) => {
  const categories = {
    "Source Name": "sourceName",
    "Job Designation": "jobDesignation",
    "Recruiter's Name": "recruiterName",
    "Applying Company": "requirementCompany",
    "Experience": "experienceYear",
    "Gender" : "gender",
    "Holding Any Offer":"holdingAnyOffer",
    "Notice Period" : "noticePeriod",
    "Qualification": "qualification",
    "Relevant Experience" : "relevantExperience",
    "Job Id" : "requirementId",
    "Status Type" : "selectYesOrNo",
    "Year Of Passing" : "yearOfPassing",
    "Availability For Interview" : "availabilityForInterview",
    "Calling Feedback" : "callingFeedback"
  };


  
 // Function to generate a random color
const getRandomColor = () => {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
  };
  
  // Generate unique colors for each subcategory
  const barColors = selectedSubCategories.map(() => getRandomColor());
  
//   const chartData = {
//     labels: selectedSubCategories,
//     datasets: [
//       {
//         label: `Number of Candidates by ${selectedCategory}`,
//         data: selectedSubCategories.map(subCat =>
//           filteredLineUpItems.filter(item => item[categories[selectedCategory]] === subCat).length
//         ),
//         backgroundColor: barColors, // Assign unique colors
//       },
//     ],
//   };

const truncateLabel = (label) => label.length > 10 ? label.substring(0, 10) + "..." : label;

const chartData = {
    labels: selectedSubCategories.map(truncateLabel), // Truncate labels if longer than 10 characters
    datasets: [
      {
        label: `Number of Candidates ${selectedStatusCategory} by ${selectedCategory}`,
        data: selectedSubCategories.map(subCat =>
          filteredLineUpItems.filter(item => item[categories[selectedCategory]] === subCat).length
        ),
        backgroundColor: barColors, // Assign unique colors
      },
    ],
  };

  return (
    <div className='setwidthacordingtoadjustchartsclass newclassforalignitemscenter'>
      {selectedCategory && selectedSubCategories.length > 0 && (
        <Bar data={chartData} />
      )}
    </div>
  );
};

export default BarChartComponent;
