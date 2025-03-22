import axios from "axios";
import { API_URL } from "@/src/constants/api";
import { WorksDone } from "@/src/constants/CommissionTypes";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";

const WORKS_DONE_URL = `${API_URL}/worksdone`;


export const getAllWorksDone = async (): Promise<WorksDone[]> => {
  try {
    const response = await api.get(WORKS_DONE_URL);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching works done");
    throw error;
  }
};

export const getWorksDoneById = async (id: number): Promise<WorksDone> => {
  try {
    const response = await api.get(`${WORKS_DONE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching the work done");
    throw error;
  }
};

export const getWorksDoneByArtist = async (artistId: number): Promise<WorksDone[]> => {
  try {
    const response = await api.get(`${WORKS_DONE_URL}/artist/${artistId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching works done by artist");
    throw error;
  }
};

export const createWorksDone = async (worksDone: Partial<WorksDone>): Promise<WorksDone> => {
  try {
    const response = await api.post(WORKS_DONE_URL, worksDone);
    return response.data;
  } catch (error) {
    handleError(error, "Error creating the work done");
    throw error;
  }
};

export const updateWorksDone = async (artistId: number, worksDoneId: number, worksDone: Partial<WorksDone>): Promise<WorksDone> => {
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