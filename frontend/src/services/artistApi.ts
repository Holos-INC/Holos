import axios from "axios";
import api from "./axiosInstance";

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

export const getArtistByBaseId = async (baseUserId: number) => {
  try {
    const response = await axios.get(`/artists/byBaseUser/${baseUserId}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo artista con baseUserId ${baseUserId}:`, error);
    throw error;
  }
};

export const getArtistByUsername = async (username:string) => {
  try {
    const response = await api.get(`/artists/username/${username}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the artist!", error);
    throw error;
  }
};
