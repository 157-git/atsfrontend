import axios from "axios";
import { API_BASE_URL } from "../api/api";

export const getUserImageFromApiForReport = async (employeeId, userType) => {
  if (!employeeId || !userType) {
    return null
  }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`
      );
      if (!response.data || !response.data.profileImage) {
        return null
      }

      try {
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
        console.log(error);
        
      }
    
    } catch (error) {
      console.error("Error fetching user image:", error);
      return null;
    }
  };

// export const getUserImageFromApiForReport = async (employeeId, userType) => {
//   if (!employeeId || !userType) {
//     return null
//   }
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 100))

//     const response = await axios.get(`${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`, {
//       timeout: 5000,
//       headers: {
//         "Cache-Control": "no-cache",
//         Pragma: "no-cache",
//         Expires: "0",
//       },
//     })

//     if (!response.data || !response.data.profileImage) {
//       return null
//     }

//     try {
//       const byteCharacters = atob(response.data.profileImage)
//       const byteNumbers = new Array(byteCharacters.length)
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i)
//       }
//       const byteArray = new Uint8Array(byteNumbers)
//       const blob = new Blob([byteArray], { type: "image/jpeg" })
//       const url = URL.createObjectURL(blob)

//       return url
//     } catch (decodeError) {
//       console.log("Error decoding image data:", decodeError)
//       return null
//     }
//   } catch (error) {
//     console.log(`Image fetch failed for ID ${employeeId}. Will use fallback image.`)
//     return null
//   }
// }