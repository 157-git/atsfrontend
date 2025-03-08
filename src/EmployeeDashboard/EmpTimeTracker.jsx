// import React, { useState, useEffect } from "react";
// import "./EmpTimeTracker.css";
// import { useNavigate } from "react-router-dom";

// const Stopwatch = () => {
//   const getStoredTime = () => {
//     const storedTime = localStorage.getItem("stopwatchTime");
//     return storedTime
//       ? JSON.parse(storedTime)
//       : { hours: 0, minutes: 0, seconds: 0 };
//   };

//   const [time, setTime] = useState(getStoredTime());
//   const [running, setRunning] = useState(true);

//   const navigator = useNavigate();

//   useEffect(() => {
//     let interval;

//     if (running) {
//       interval = setInterval(() => {
//         setTime((prevTime) => {
//           const newSeconds = prevTime.seconds + 1;
//           const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
//           const newHours = prevTime.hours + Math.floor(newMinutes / 60);

//           localStorage.setItem(
//             "stopwatchTime",
//             JSON.stringify({
//               hours: newHours % 24,
//               minutes: newMinutes % 60,
//               seconds: newSeconds % 60,
//             })
//           );

//           return {
//             hours: newHours % 24,
//             minutes: newMinutes % 60,
//             seconds: newSeconds % 60,
//           };
//         });
//       }, 1000);
//     } else {
//       clearInterval(interval);
//     }

//     return () => clearInterval(interval);
//   }, [running]);

//   const handleBreak = () => {
//     setRunning(false); // Pause the stopwatch
//   };

//   const handleResume = () => {
//     setRunning(true); // Resume the stopwatch
//   };

//   const handleLogout = async () => {
//     try {
//       localStorage.removeItem("stopwatchTime");

//       setTime({ hours: 0, minutes: 0, seconds: 0 });

//       console.log("Logged out successfully.");
//       navigator("/employee-login");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <div style={{ marginRight: "20px", marginTop: "5px" }}>
//         <h3 style={{ color: "black" }}>
//           Time: {time.hours.toString().padStart(2, "0")}:
//           {time.minutes.toString().padStart(2, "0")}:
//           {time.seconds.toString().padStart(2, "0")}
//         </h3>
//       </div>
//       <div
//         style={{
//           marginLeft: "20px",
//           position: "fixed",
//           top: "5px",
//           right: "1px",
//         }}
//       >
//         {running ? (
//           <button className="timer-break-btn" onClick={handleBreak}>
//             Take Break
//           </button>
//         ) : (
//           <button className="timer-break-btn" onClick={handleResume}>
//             End Breake
//           </button>

         
//         )}
//       </div>
//     </div>
//   );
// };

// export default Stopwatch;
