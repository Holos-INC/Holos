import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/artists";

export const getArtistById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the artist!", error);
    throw error;
  }
};
