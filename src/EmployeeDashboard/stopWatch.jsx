import React, { useEffect, useRef, useState } from "react";
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

  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null); // ✅ useRef instead of state
  const intervalRef = useRef(null);

  
  useEffect(() => {
  // console.log("startProp on load:", startProp);
}, [startProp]);

  /* ---------- Load saved time ---------- */
useEffect(() => {
  if (startProp) {
    const ms = timeStringToMilliseconds(startProp);

    setElapsedTime(ms);

    startTimeRef.current = Date.now() - ms;
  }
}, [startProp]);

/* ---------- Debug elapsedTime ---------- */
useEffect(() => {
  // console.log(
  //   "elapsedTime state:",
  //   elapsedTime,
  //   "=>",
  //   millisecondsToTimeString(elapsedTime)
  // );
}, [elapsedTime]);

  /* ---------- Timer logic (FIXED) ---------- */
useEffect(() => {
  if (!isRunning) {
    clearInterval(intervalRef.current);
    return;
  }

  if (startTimeRef.current === null) {
    startTimeRef.current = Date.now() - elapsedTime;
  }

  intervalRef.current = setInterval(() => {
    const newElapsedTime = Date.now() - startTimeRef.current;

    setElapsedTime(newElapsedTime);
    dispatch(updateTime(millisecondsToTimeString(newElapsedTime)));
  }, 1000);

  return () => clearInterval(intervalRef.current);
}, [isRunning]);

  useEffect(() => {
  if (!isRunning) return;

  const autoSaveInterval = setInterval(async () => {
    try {
      const payload = {
        totalHoursWork: millisecondsToTimeString(elapsedTime),
        attendanceRole: {
          ...(userType === "Recruiters" && { employee: { employeeId } }),
          ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
          ...(userType === "Manager" && { manager: { employeeId } }),
        },
      };

      await putDailyworkData(
        employeeId,
        userType,
        currentDateNewGlobal,
        payload
      );
    } catch (e) {
      console.log("autosave failed");
    }
  }, 15000); // every 15 sec

  return () => clearInterval(autoSaveInterval);
}, [isRunning]);

  /* ---------- Save on refresh ---------- */
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

        await putDailyworkData(
          employeeId,
          userType,
          currentDateNewGlobal,
          getDataForUpdate
        );
      } catch (error) {
        console.error(error);
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [elapsedTime, employeeId, userType, currentDateNewGlobal]);

  /* ---------- Actions ---------- */
  const startTimerFunc = () => {
    dispatch(startTimer());
    startTimeRef.current = Date.now() - elapsedTime;
    onStartClick(true);
  };


// useEffect(() => {
//   console.log("onResumeClick changed:", onResumeClick);

//   if (onResumeClick) {
//     dispatch(startTimer());
//     startTimeRef.current = Date.now() - elapsedTime;
//   }
// }, [onResumeClick]);

const firstResumeRender = useRef(true);

useEffect(() => {
  if (firstResumeRender.current) {
    firstResumeRender.current = false;
    return;
  }

  dispatch(startTimer());
  startTimeRef.current = Date.now() - elapsedTime;
}, [onResumeClick]);


  const stopTimerFunc = () => {
    dispatch(stopTimer());
    onStopClick(millisecondsToTimeString(elapsedTime));
  };

  /* ---------- Helpers ---------- */
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
      <button className="loging-hr newclassforhrbutton">
        Login Time: {millisecondsToTimeString(elapsedTime)}
      </button>

      <button className="timer-break-btn" onClick={stopTimerFunc}>
        Pause
      </button>
    </div>
  );
};

export default StopWatch;
