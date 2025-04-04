import { format } from "date-fns";


export const convertNewDateToFormattedDateTime = (newDateObjectFormat) => {
  
  try {
    if (newDateObjectFormat === null) {
      return null;
    } else{
      const date = new Date(newDateObjectFormat);
      return format(date, "dd-MM-yyyy hh:mm:ss a");
    }
  } catch (error) {
    console.log(error);
    
  }
 
  };