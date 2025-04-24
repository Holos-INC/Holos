import axios from "axios";
import { API_URL, BASE_URL } from "@/src/constants/api";
import { WorksDone, Artist } from "@/src/constants/CommissionTypes";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";

const WORKS_DONE_URL = `${API_URL}/worksdone`;

export const getAllWorksDone = async (): Promise<WorksDoneDTO[]> => {
  try {
    const response = await api.get(`${BASE_URL}/api/v1/search/works`);
    return response.data; // Aquí será un array de WorksDoneDTO
  } catch (error) {
    handleError(error, "Error fetching works done");
    throw error;
  }
};

export const fetchWorksDone = async (): Promise<WorksDoneDTO[]> => {
  try {
    const response = await api.get(WORKS_DONE_URL);
    return response.data; // Aquí será un array de WorksDoneDTO
  } catch (error) {
    handleError(error, "Error fetching works done");
    throw error;
  }
};

export const getWorksDoneById = async (id: number): Promise<WorksDoneDTO> => {
  try {
    const response = await api.get(`${WORKS_DONE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching the work done");
    throw error;
  }
};

export const getAllWorksDoneDTO = async (): Promise<WorksDoneDTO[]> => {
  try {
    const response = await api.get(WORKS_DONE_URL);
    return response.data; // Aquí será un array de WorksDoneDTO
  } catch (error) {
    handleError(error, "Error fetching works done");
    throw error;
  }
};

export const getWorksDoneByArtist = async (
  username: string
): Promise<WorksDone[]> => {
  try {
    const response = await api.get(`${WORKS_DONE_URL}/artist/${username}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching works done by artist");
    throw error;
  }
};

export const deleteWorksDone = async (
  worksDoneId: number
): Promise<void> => {
  try {
    await api.delete(`${WORKS_DONE_URL}/${worksDoneId}`);
  } catch (error) {
    handleError(error, "Error deleting the work done");
    throw error;
  }
}

export const createWorksDone = async (
  worksDone: Partial<WorksDone>
): Promise<WorksDone> => {
  try {
    const response = await api.post(WORKS_DONE_URL, worksDone);
    return response.data;
  } catch (error) {
    handleError(error, "Error creating the work done");
    throw error;
  }
};

export const updateWorksDone = async (
  artistId: number,
  worksDoneId: number,
  worksDone: Partial<WorksDone>
): Promise<WorksDone> => {
  try {
    const response = await api.put(
      `${WORKS_DONE_URL}/artist/${artistId}/${worksDoneId}`,
      worksDone
    );
    return response.data;
  } catch (error) {
    handleError(error, "Error updating the work done");
    throw error;
  }
};

export const getWorksDoneByIdDTO = async (
  id: number
): Promise<WorksDoneDTO> => {
  try {
    const response = await api.get(`${WORKS_DONE_URL}/${id}`);
    return response.data; // Aquí se espera un objeto de tipo WorksDoneDTO
  } catch (error) {
    handleError(error, "Error fetching the work done (DTO)");
    throw error;
  }
};

export const getMostPublicationsArtists = async (): Promise<Artist[]> => {
  try {
    const response = await api.get(`${WORKS_DONE_URL}/mostPublicationsArtists`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching most publications artists");
    throw error;
  }
};
