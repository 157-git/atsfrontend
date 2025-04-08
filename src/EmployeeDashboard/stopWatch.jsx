// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { startTimer, stopTimer, updateTime } from "../sclices/stopwatchSlice";
// import { getFormattedDateISOYMDformat } from "../EmployeeSection/getFormattedDateTime";
// import { putDailyworkData } from "../HandlerFunctions/getDailyWorkDataByIdTypeDateReusable";

// const StopWatch = ({ startTimer: startProp, onStopClick, onStartClick, onResumeClick }) => {
//   const { employeeId, userType } = useParams();
//   const currentDateNewGlobal = getFormattedDateISOYMDformat();
//   const dispatch = useDispatch();
//   const timeString = useSelector((state) => state.stopwatch.timeString);
//   const isRunning = useSelector((state) => state.stopwatch.isRunning);
//   const [time, setTime] = useState(0);

//   useEffect(() => {
//     setTime(timeStringToMilliseconds(startProp));
//   }, [startProp]);

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => {
//           const newTime = prevTime + 1000;
//           dispatch(updateTime(millisecondsToTimeString(newTime)));
//           return newTime;
//         });
//       }, 1000);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning, dispatch]);

//   useEffect(() => {
//     const handleBeforeUnload = async (event) => {
//       try {
//         const getDataForUpdate = {
//           totalHoursWork: millisecondsToTimeString(time),
//           attendanceRole: {
//             ...(userType === "Recruiters" && { employee: { employeeId } }),
//             ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
//             ...(userType === "Manager" && { manager: { employeeId } }),
//           },
//         };

//         console.log(getDataForUpdate);
//         const refreshPutReq = await putDailyworkData(
//           employeeId,
//           userType,
//           currentDateNewGlobal,
//           getDataForUpdate
//         );
//         console.log(refreshPutReq);
//       } catch (error) {
//         console.log(error);
//       }
//       event.preventDefault();
//       event.returnValue = "Are you sure you want to refresh?";
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [time]);

//   // Automatically resume the timer if onResumeClick is triggered
//   useEffect(() => {
//       startTimerFunc();
//   }, [onResumeClick]);

//   const startTimerFunc = () => {
//     dispatch(startTimer());
//     onStartClick(true);
//   };

//   const stopTimerFunc = () => {
//     dispatch(stopTimer());
//     onStopClick(millisecondsToTimeString(time));
//   };

//   const timeStringToMilliseconds = (timeString) => {
//     const [h, m, s] = timeString.split(":").map(Number);
//     return h * 3600000 + m * 60000 + s * 1000;
//   };

//   const millisecondsToTimeString = (ms) => {
//     const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
//     const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
//     const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
//     return `${hours}:${minutes}:${seconds}`;
//   };

//   return (
//     <div className="setDisplayFlexForLoginhrandbreak">
//       <button className="loging-hr newclassforhrbutton">Login Time: {timeString}</button>
//       {!isRunning ? (
//         <button className="timer-break-btn" onClick={startTimerFunc}>Resume</button>
//       ) : (
//         <button className="timer-break-btn" onClick={stopTimerFunc}>Pause</button>
//       )}
//     </div>
//   );
// };

// export default StopWatch;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startTimer, stopTimer, updateTime } from "../sclices/stopwatchSlice";
import { getFormattedDateISOYMDformat } from "../EmployeeSection/getFormattedDateTime";
import { putDailyworkData } from "../HandlerFunctions/getDailyWorkDataByIdTypeDateReusable";

const StopWatch = ({ startTimer: startProp, onStopClick, onStartClick, onResumeClick }) => {
  const { employeeId, userType } = useParams();
  const currentDateNewGlobal = getFormattedDateISOYMDformat();
  const dispatch = useDispatch();
  const isRunning = useSelector((state) => state.stopwatch.isRunning);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startProp) {
      setElapsedTime(timeStringToMilliseconds(startProp));
    }
  }, [startProp]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      setStartTime(Date.now() - elapsedTime);
      interval = setInterval(() => {
        const newElapsedTime = Date.now() - startTime;
        setElapsedTime(newElapsedTime);
        dispatch(updateTime(millisecondsToTimeString(newElapsedTime)));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedTime, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      try {
        const getDataForUpdate = {
          totalHoursWork: millisecondsToTimeString(elapsedTime),
          attendanceRole: {
            ...(userType === "Recruiters" && { employee: { employeeId } }),
            ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
            ...(userType === "Manager" && { manager: { employeeId } }),
          },
        };

        console.log(getDataForUpdate);
        const refreshPutReq = await putDailyworkData(
          employeeId,
          userType,
          currentDateNewGlobal,
          getDataForUpdate
        );
        console.log(refreshPutReq);
      } catch (error) {
        console.log(error);
      }
      event.preventDefault();
      event.returnValue = "Are you sure you want to refresh?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [elapsedTime]);

  const startTimerFunc = () => {
    dispatch(startTimer());
    setStartTime(Date.now() - elapsedTime);
    onStartClick(true);
  };
  useEffect(() => {
      startTimerFunc();
  }, [onResumeClick]);
  const stopTimerFunc = () => {
    dispatch(stopTimer());
    onStopClick(millisecondsToTimeString(elapsedTime));
  };

  const timeStringToMilliseconds = (timeString) => {
    const [h, m, s] = timeString.split(":").map(Number);
    return h * 3600000 + m * 60000 + s * 1000;
  };

  const millisecondsToTimeString = (ms) => {
    const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="setDisplayFlexForLoginhrandbreak">
      <button className="loging-hr newclassforhrbutton">Login Time: {millisecondsToTimeString(elapsedTime)}</button>

      <button className="timer-break-btn" onClick={stopTimerFunc}>Pause</button>
  
    </div>
  );
};

export default StopWatch;
