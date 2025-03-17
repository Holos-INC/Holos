import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/users";

export const getClientById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};
