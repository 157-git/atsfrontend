import axios, { API_BASE_URL } from "../api/api";

export const getDailyworkData = async(employeeId, userType, currentDateNew)=>{
    try {
        const getResp = await axios.get(`${API_BASE_URL}/daily-work-data/${employeeId}/${userType}/${currentDateNew}`);
       return getResp.data;
    } catch (error) {
        console.log(error);
    }
}