import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./performanceMeter.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Speedometer = () => {
  const [speed, setSpeed] = useState("");
  const [divisions, setDivisions] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const defaultDivisions = 5;

  const maxSpeed = 100; // Maximum value for the speedometer

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = ""; // Handle NaN values
    if (value < 0) value = 0; // Prevent negative values
    if (value > maxSpeed) value = maxSpeed; // Cap at max speed
    setSpeed(value);
    setErrorMessage(""); // Clear the error message initially
  };

  const colors = ["#4caf50", "#00bcd4", "#ff9800", "#ffeb3b", "#f44336"];
  const ranges = divisions
    ? Array(divisions).fill(maxSpeed / divisions)
    : Array(5).fill(maxSpeed / 5);

    const data = {
    labels: Array(ranges.length).fill(""),
    datasets: [
      {
        data: ranges,
        backgroundColor: colors.slice(0, ranges.length),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%", // For doughnut appearance
    rotation: -90, // Start from top
    circumference: 180, // Half-circle
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    maintainAspectRatio: false,
  };

  const calculatePointerRotation = (speed) => {
    const percentage = speed / maxSpeed; // Speed as a percentage of maxSpeed
    const degrees = percentage * 180; // Map to 180 degrees
    return degrees - 90; // Adjust for starting point
  };

  const handleDivisionChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = ""; // At least one division
    } else if (value > 20) {
      value = defaultDivisions;
      setErrorMessage("Max limit for divisions is 20");
    } else {
      setErrorMessage("");
    }
    setDivisions(value);
  };

  const pointerRotation = calculatePointerRotation(speed || 0);

  const getPerformance = (speed) => {
    if (speed > 0 && speed <= 20) {
      return { message: "Your performance is very poor", color: "red" };
    } else if (speed > 20 && speed <= 40) {
      return { message: "Your performance is average", color: "orange" };
    } else if (speed > 40 && speed <= 60) {
      return { message: "Your performance is good", color: "yellow" };
    } else if (speed > 60 && speed <= 80) {
      return { message: "Your performance is best", color: "lightgreen" };
    } else if (speed > 80 && speed <= 100) {
      return { message: "Your performance is excellent", color: "green" };
    } else {
      return {};
    }
  };
  const performance = getPerformance(speed || 0);

  return (
    <div className="main-div">

      <div className="speedometer">
        <div className="input-heading">
          <h2>Speedometer</h2>
          <input
            type="number"
            value={speed}
            onChange={handleInputChange}
            placeholder="Enter Speed (0-100)"
            className="speed-input"
            onFocus={() => setSpeed("")}
          />
          <input
            type="number"
            value={divisions}
            onChange={handleDivisionChange}
            placeholder="Enter Divisions (1-20)"
            className="division-input"
            onFocus={() => setDivisions("")}
          />
        </div>
        <div className="chart-container">
          <Doughnut data={data} options={options} />
          <div
            className="pointer"
            style={{
              transform: `rotate(${pointerRotation}deg)`,
            }}
          ></div>
          <div
            className="performance-display"
            style={{ backgroundColor: performance.color }}
          >
            {performance.message}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>

      <div className="speedometer">
        <div className="input-heading">
          <h2>Speedometer</h2>
          <input
            type="number"
            value={speed}
            onChange={handleInputChange}
            placeholder="Enter Speed (0-100)"
            className="speed-input"
            onFocus={() => setSpeed("")}
          />
          <input
            type="number"
            value={divisions}
            onChange={handleDivisionChange}
            placeholder="Enter Divisions (1-20)"
            className="division-input"
            onFocus={() => setDivisions("")}
          />
        </div>
        <div className="chart-container">
          <Doughnut data={data} options={options} />
          <div
            className="pointer"
            style={{
              transform: `rotate(${pointerRotation}deg)`,
            }}
          ></div>
          <div
            className="performance-display"
            style={{ backgroundColor: performance.color }}
          >
            {performance.message}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>

      <div className="speedometer">
        <div className="input-heading">
          <h2>Speedometer</h2>
          <input
            type="number"
            value={speed}
            onChange={handleInputChange}
            placeholder="Enter Speed (0-100)"
            className="speed-input"
            onFocus={() => setSpeed("")}
          />
          <input
            type="number"
            value={divisions}
            onChange={handleDivisionChange}
            placeholder="Enter Divisions (1-20)"
            className="division-input"
            onFocus={() => setDivisions("")}
          />
        </div>
        <div className="chart-container">
          <Doughnut data={data} options={options} />
          <div
            className="pointer"
            style={{
              transform: `rotate(${pointerRotation}deg)`,
            }}
          ></div>
          <div
            className="performance-display"
            style={{ backgroundColor: performance.color }}
          >
            {performance.message}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>

      <div className="speedometer">
        <div className="input-heading">
          <h2>Speedometer</h2>
          <input
            type="number"
            value={speed}
            onChange={handleInputChange}
            placeholder="Enter Speed (0-100)"
            className="speed-input"
            onFocus={() => setSpeed("")}
          />
          <input
            type="number"
            value={divisions}
            onChange={handleDivisionChange}
            placeholder="Enter Divisions (1-20)"
            className="division-input"
            onFocus={() => setDivisions("")}
          />
        </div>
        <div className="chart-container">
          <Doughnut className="speedometer-div" data={data} options={options} />
          <div
            className="pointer"
            style={{
              transform: `rotate(${pointerRotation}deg)`,
            }}
          ></div>
          <div
            className="performance-display"
            style={{ backgroundColor: performance.color }}
          >
            {performance.message}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
