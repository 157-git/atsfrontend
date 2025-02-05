const convertTimeToSeconds = (timeString) => {
    const timeParts = timeString.match(/(\d+)\s\w+/g);
    if (!timeParts) return 0;
  
    let totalSeconds = 0;
    const timeUnits = { month: 30 * 24 * 60 * 60, day: 24 * 60 * 60, hour: 60 * 60, minute: 60, second: 1 };
  
    timeParts.forEach((part) => {
      const [value, unit] = part.split(" ");
      const key = unit.replace(/s$/, ""); // Remove plural 's'
      totalSeconds += parseInt(value) * (timeUnits[key] || 0);
    });
  
    return totalSeconds;
  };
  
  const convertSecondsToTimeFormat = (seconds) => {
    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds %= (30 * 24 * 60 * 60);
  
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
  
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
  
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
  
    return `${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  };
  
export  const subtractTimeDurations = (time1, time2) => {
    const seconds1 = convertTimeToSeconds(time1);
    const seconds2 = convertTimeToSeconds(time2);
  
    const difference = seconds1 - seconds2;
    
    // Check if difference is negative and convert accordingly
    const isNegative = difference < 0;
    const absoluteDifference = Math.abs(difference);
  
    const formattedTime = convertSecondsToTimeFormat(absoluteDifference);
  
    return isNegative ? `- ${formattedTime}` : formattedTime; // Add negative sign if needed
  };
  