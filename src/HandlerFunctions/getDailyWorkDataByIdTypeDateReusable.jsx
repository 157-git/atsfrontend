import axios, { API_BASE_URL } from "../api/api";

export const getDailyworkData = async (
  employeeId,
  userType,
  currentDateNew
) => {
  // console.log("running get reusable");

  try {
    const getResp = await axios.get(
      `${API_BASE_URL}/daily-work-data/${employeeId}/${userType}/${currentDateNew}`
    );
    return getResp.data;
  } catch (error) {
    console.log(error);
  }
};

export const putDailyworkData = async (
  employeeId,
  userType,
  currentDateNew,
  putDataReqBody
) => {
  // console.log("running put reusable");
  try {
    const putResp = await axios.put(
      `${API_BASE_URL}/update-daily-work/${employeeId}/${userType}/${currentDateNew}`,
      putDataReqBody
    );
    return putResp.data;
  } catch (error) {
    console.log(error);
  }
};
