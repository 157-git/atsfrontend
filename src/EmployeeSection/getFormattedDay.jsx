export const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are 0-based in JavaScript
    const day = now.getDate();
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    const formattedDate = `${day}-${month}-${year}`;
    return `Date: ${formattedDate}, Time: ${formattedHours}:${formattedMinutes} ${period}`;
  };