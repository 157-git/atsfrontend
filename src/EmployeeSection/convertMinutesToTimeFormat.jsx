export const convertMinutesToTimeFormat = (totalMinutes) => {
    let seconds = totalMinutes * 60;
    
    const months = Math.floor(seconds / (30 * 24 * 60 * 60)); // Assuming 30 days per month
    seconds %= (30 * 24 * 60 * 60);
    
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
  
    return `${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  };