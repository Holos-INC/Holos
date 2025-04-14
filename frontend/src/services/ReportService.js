import axios from "axios";
import { API_URL } from "../constants/api";

const API_URL = API_URL + "/reports";


export const getReportTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/types`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the different report types!", error);
    throw error;
  }
};


export const postReportWork = async (report, token) => {
  try {
    const response = await axios.post(API_URL, report, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el reporte:", error);
    throw error;
  }
};

