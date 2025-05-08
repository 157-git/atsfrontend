import axios from "axios";
import { API_BASE_URL } from "../api/api";


export const fetchCompleteProfileData = async(employeeId, userType) => {
     try {
            const response = await axios.get(
              `${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`);
            const employeeData = response.data;
      return employeeData;
         
          } catch (error) {
            console.error("Error fetching user image:", error);
            return null;
          }
}