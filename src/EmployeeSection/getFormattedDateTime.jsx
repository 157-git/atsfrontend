// use this for getting current date time or dateTime

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


  export const getFormattedTimeOnly = () => {
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
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  export const getFormattedDateOnly = () => {
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
    return `${formattedDate}`;
  };

  export const getFormattedDateISOYMDformat = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure two-digit format
    const day = String(now.getDate()).padStart(2, '0'); // Ensure two-digit format
  
    return `${year}-${month}-${day}`;
};
