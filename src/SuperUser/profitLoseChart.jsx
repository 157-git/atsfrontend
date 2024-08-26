import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import "../SuperUser/profitLoseChart.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement
);

const LineGraph = () => {
  // State for line chart data
  const [lineChartData, setLineChartData] = useState({
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Profit",
        data: [
          5000, 4000, 3000, 7000, 6000, 8000, 9000, 8500, 7500, 9500, 10000,
          11000,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Loss",
        data: [
          2000, 3000, 4000, 1000, 2000, 500, 1500, 2500, 3500, 1500, 500, 1000,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  });

  const sum = (arr) => arr.reduce((total, num) => total + num, 0);

  const [barChartData, setBarChartData] = useState({
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Profit",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: lineChartData.datasets[0].data, // Initial profit data from line chart
      },
      {
        label: "Loss",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        data: lineChartData.datasets[1].data, // Initial loss data from line chart
      },
    ],
  });

  useEffect(() => {
    setBarChartData({
      ...barChartData,
      datasets: [
        {
          ...barChartData.datasets[0],
          data: lineChartData.datasets[0].data, // Update profit data
        },
        {
          ...barChartData.datasets[1],
          data: lineChartData.datasets[1].data, // Update loss data
        },
      ],
    });
  }, [lineChartData]);

  return (
    <div className="wrapper">
      <div className="container">
        <h2>Profit and Loss Graphs</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="chart-container left">
            <h3>Line Chart</h3>
            <div className="chart">
              <Line data={lineChartData} />
            </div>
          </div>
          <div className="chart-container right">
            <h3>Bar Chart</h3>
            <div className="chart">
              <Bar
                data={barChartData}
                options={{
                  indexAxis: "x", // Horizontal bar chart
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineGraph;
