import axios from "axios";
import { API_BASE_URL } from "../api/api";


export const updatePerformanceForAfterSelectionapi = async(requestBody, performanceId)=>{
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update-performance/${performanceId}`,
      requestBody
    );
    console.log("Second API Response:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    
  }
   
}