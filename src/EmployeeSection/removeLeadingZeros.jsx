export const removeLeadingZeros = (timeString) => {
    let parts = timeString.split(", ").map(part => part.trim());
    while (parts.length > 0 && parts[0].startsWith("0 ")) {
      parts.shift();
    }
    return parts.join(", ");
  };

  export const cleanTimeStringSpaces = (timeString) => {
    try {
      let isNegative = timeString.startsWith("-"); // Check if the time is negative
      let parts = timeString.replace("-", "").trim().split(" ").map(part => part.trim());
    
      let filteredParts = [];
      for (let i = 0; i < parts.length; i += 2) {
        if (parts[i] !== "0") {
          filteredParts.push(parts[i] + " " + parts[i + 1]);
        }
      }
    
      let result = filteredParts.length > 0 ? filteredParts.join(", ") : "";
      
      return isNegative ? `- ${result}` : result;
    } catch (error) {
      console.log(error);
      
    }

  };

  export const cleanTimeStringPlusMinus = (timeString) => {
    let isNegative = timeString.startsWith("-"); // Check if the time is negative
    let parts = timeString.replace("-", "").trim().split(" ").map(part => part.trim());
  
    let filteredParts = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] !== "0") {
        filteredParts.push(parts[i] + " " + parts[i + 1]);
      }
    }
  
    let result = filteredParts.length > 0 ? filteredParts.join(", ") : "";
    
    return isNegative ? `- ${result}` : result; // Add '-' back if originally negative
  };