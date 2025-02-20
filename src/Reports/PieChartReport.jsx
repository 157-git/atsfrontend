/* Name:-Prachi Parab Component:-PieChart report
         End LineNo:-1 to 105 Date:-10/07 */

import React, { useEffect, useState } from "react";
import "../Reports/PieChartReport.css";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDateTime";

Chart.register(Tooltip);
Chart.register(ArcElement);

const PieChart = ({
  data,
  userName,
  finalStartDatePropState,
  finalEndDatePropState,
}) => {
  console.log(data);
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    setCurrentDate(getFormattedDateTime());
  }, []);
  const categories = data.map((item) => item.category);
  const counts = data.map((item) => item.count);

  const predefinedColors = [
    "rgba(160, 82, 45, 0.7)",
    "#ffc3ba",
    "#B4B4B8",
    "rgba(127,101,77,0.8)",
    "#004c4c",
    "#ff8080",
    "rgba(117,118,118)",
    "#bf4545",
    "#ffded9",
    "rgba(127,108,84,0.5)",
    "#982828",
    "#f8cec8",
    "#008080",
    "rgba(168,118,118, 0.9)",
    "#EF9C66",
    "rgba(255,213,175,0.7)",
    "#6b0b0b",
  ];

  const backgroundColor = categories.map(
    (_, index) => predefinedColors[index % predefinedColors.length]
  );

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Counts",
        data: counts,
        backgroundColor,
        borderWidth: 2,
        hoverOffset: 5,
      },
    ],
  };
  return (
    <>
      <div className="mainChartContainer setwidthacordingtoadjustchartsclass" >
      

        <div className="subdivforcharts">
          <div className="piecontainer">
            <Pie className="newsahilcanvas" data={chartData} />
          </div>

          {/* <div className="newIndexDiv">
            <ul className="newUlListDisplayGrid">
              {categories.map((category, index) => (
                <li key={index} className="listOfIndex">
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor:
                        predefinedColors[index % predefinedColors.length],
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>{category}</span>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>
    </>
  );
};
export default PieChart;
