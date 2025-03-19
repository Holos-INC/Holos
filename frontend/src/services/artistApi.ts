import api from "./axiosInstance";

export const getArtistById = async (id:number) => {
  try {
    const response = await api.get(`/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the artist!", error);
    throw error;
  }
};
