import api from "./axiosInstance";
import { API_URL } from "../constants/api";
const ARTIST_URL = `${API_URL}/artists`;
export const getArtistById = async (id:number) => {
  try {
    console.log(id);
    const response = await api.get(`/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the artist!", error);
    throw error;
  }
};

export const deleteArtist = async (id: number): Promise<void> => {
  await api.delete(`${ARTIST_URL}/administrator/artists/${id}`);
};

