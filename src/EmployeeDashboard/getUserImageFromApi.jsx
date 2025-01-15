import axios from "axios";
import { API_BASE_URL } from "../api/api";

export const getUserImageFromApi = async (employeeId, userType) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`
      );
      const byteCharacters = atob(response.data.profileImage);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("Error fetching user image:", error);
      return null;
    }
  };