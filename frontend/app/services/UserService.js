import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/baseUser";

export const getUserTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/userType/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the user type!", error);
    throw error;
  }
};

export const updateUserById = async (id, updatedData) => {
  try {
    const response = await axios.post(`${API_URL}/update/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was an error updating the user!", error);
    throw error;
  }
};