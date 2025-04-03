
import api from "./axiosInstance"; 
import {newWorkArtist, globalNewWorkUploadArtist } from "@/src/constants/uploadNewWorkArtist";
import { API_URL } from "@/src/constants/api";
const worksdone_URL = `${API_URL}/worksdone`;



const base64ToFile = (base64Data: string, filename: string): File => {
  const arr = base64Data.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error("Formato de base64 inválido");
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};


export const postWorkdone = async (
  work: newWorkArtist,
  imageBase64: string,
  token: string

): Promise<globalNewWorkUploadArtist> => {
  const formData = new FormData();
  formData.append("work", JSON.stringify(work));

  const imageFile = base64ToFile(imageBase64, "image.png");
  formData.append("image", imageFile);

  const response = await api.post(worksdone_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`,
    },
  });

  return response.data;

};

export const updateWorkdone = async (
  work: newWorkArtist,
  imageBase64: string | null, 
  artistId: number,
  worksDoneId: number,
  token: string
): Promise<globalNewWorkUploadArtist> => {
  const formData = new FormData();
  formData.append("work", JSON.stringify(work));

  if (imageBase64) {
    const imageFile = base64ToFile(imageBase64, "image.png");
    formData.append("image", imageFile);
  }

  const response = await api.put(`${worksdone_URL}/artist/${artistId}/${worksDoneId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`,
    },
  });

  return response.data;
};


