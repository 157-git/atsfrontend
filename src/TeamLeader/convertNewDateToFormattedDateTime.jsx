import { format } from "date-fns";


export const convertNewDateToFormattedDateTime = (newDateObjectFormat) => {
    const date = new Date(newDateObjectFormat);
    return format(date, "dd-MM-yyyy hh:mm:ss a");
  };