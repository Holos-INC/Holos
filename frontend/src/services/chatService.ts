// src/services/chatService.ts
import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { base64ToFile } from "@/src/components/convertionToBase64Image";

// Definición del tipo para el mensaje de chat.
export interface ChatMessage {
  id: number;
  creationDate: string;
  text: string;
  image?: string; // Se espera base64 o URL
  commision: {
    id: number;
  };
}

/**
 * Función auxiliar que convierte un string base64 en un Blob.
 */
function base64ToBlob(base64: string, contentType = "", sliceSize = 512): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

/**
 * Obtiene la conversación (lista de mensajes) para una comisión dada.
 * Se envía el token en el header Authorization.
 */
export const getConversation = async (
  commisionId: number,
  token: string
): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`${API_URL}/messages/chat/${commisionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Esto proviene de la llamada a la API:" + response.data.length);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching conversation");
    throw error;
  }
};

/**
 * Envía un mensaje para una comisión dada.
 * Se utiliza FormData para enviar el mensaje y, opcionalmente, una imagen.
 * Si no se selecciona imagen, se envía una imagen dummy (1x1 píxel transparente)
 * convertida a un File para asegurar que la parte "image" siempre esté presente.
 * El token se envía en el header Authorization.
 */
export const sendMessage = async (
  commisionId: number,
  text: string,
  image?:string,
  loggedUser: string
): Promise<ChatMessage> => {
  try {
    const formData = new FormData();
    const chatMessage = {
      text,
      commision: { id: commisionId },
    };

    formData.append("chatMessage", JSON.stringify(chatMessage));

 
      if (image.length && image.length > 0) {
         const imageProfileData = base64ToFile(image, "image.png");
         formData.append("imageProfile", imageProfileData);
       }
    

    const response = await api.post(`${API_URL}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Error sending message");
    throw error;
  }
};
