import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/commisions";

export const getAllCommisions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching commissions:", error);
    throw error;
  }
};

export const getCommisionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching commission by id:", error);
    throw error;
  }
};

export const createCommision = async (commisionData, artistId) => {
  try {
    const response = await axios.post(`${API_URL}/${artistId}`, commisionData);
    return response.data;
  } catch (error) {
    console.error("Error creating commission:", error);
    throw error;
  }
};

export const updateCommisionStatus = async (id, artistId, accept) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/status`, null, {
      params: {
        artistId: artistId,
        accept: accept,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating commission status:", error);
    throw error;
  }
};

export const cancelCommision = async (id, clientId) => {
  try {
    const response = await axios.put(`${API_URL}/cancel/${id}`, null, {
      params: {
        clientId: clientId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelling commission:", error);
    throw error;
  }
};
