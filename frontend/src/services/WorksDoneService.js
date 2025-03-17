import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/worksdone";

export const getAllWorksDone = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching works done!", error);
    throw error;
  }
};

export const getWorksDoneById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the work done!", error);
    throw error;
  }
};

export const getWorksDoneByArtist = async (artistId) => {
  try {
    const response = await axios.get(`${API_URL}/artist/${artistId}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching works done by artist!", error);
    throw error;
  }
};

export const createWorksDone = async (worksDone) => {
  try {
    const response = await axios.post(API_URL, worksDone);
    return response.data;
  } catch (error) {
    console.error("There was an error creating the work done!", error);
    throw error;
  }
};

export const updateWorksDone = async (artistId, worksDoneId, worksDone) => {
  try {
    const response = await axios.put(
      `${API_URL}/artist/${artistId}/${worksDoneId}`,
      worksDone
    );
    return response.data;
  } catch (error) {
    console.error("There was an error updating the work done!", error);
    throw error;
  }
};
