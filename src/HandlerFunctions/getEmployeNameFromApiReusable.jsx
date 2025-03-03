import axios from "axios";
import { API_BASE_URL } from "../api/api";

export const getEmployeNameFromApiReusable = async(employeeId, userType)=>{
    try {
        const response = await axios.get(
          `${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`
        );
        const employeeLoginName = response.data.name;
        console.log(employeeLoginName);
        
  return employeeLoginName;
     
      } catch (error) {
        console.error("Error fetching user image:", error);
        return null;
      }
}