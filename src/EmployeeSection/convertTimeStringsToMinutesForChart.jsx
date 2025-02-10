export const convertTimeStringsToMinutesForChart = (timeString) => {
    const minutesInMonth = 30 * 24 * 60; // Assuming 30 days per month
    const minutesInDay = 24 * 60;
    const minutesInHour = 60;
      let totalMinutes = 0;
      let isNegative = timeString.trim().startsWith("-"); // Check for negative sign
  
      // Extract numeric values and units
      const regex = /(-?\d+)\s*(months|days|hours|minutes|seconds)/g;
      let match;
  
      while ((match = regex.exec(timeString)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
  
        switch (unit) {
          case "months":
            totalMinutes += value * minutesInMonth;
            break;
          case "days":
            totalMinutes += value * minutesInDay;
            break;
          case "hours":
            totalMinutes += value * minutesInHour;
            break;
          case "minutes":
            totalMinutes += value;
            break;
          case "seconds":
            totalMinutes += value / 60; // Convert seconds to minutes
            break;
          default:
            break;
        }
      }
  
      return isNegative ? -Math.round(totalMinutes) : Math.round(totalMinutes);

  };