import axios from "axios";
import { API_URL } from "../constants/api";
const REPORT_URL = API_URL + "/reports";

export const getReportTypes = async () => {
  try {
    const response = await axios.get(`${REPORT_URL}/types`);
    return response.data;
  } catch (error) {
    console.error(
      "There was an error fetching the different report types!",
      error
    );
    throw error;
  }
};

export const postReportWork = async (report, token) => {
  try {
    const response = await axios.post(REPORT_URL, report, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el reporte:", error);
    throw error;
  }
};
