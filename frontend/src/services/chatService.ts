// src/services/chatService.ts
import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { base64ToFile } from "@/src/components/convertionToBase64Image";
import { MessageChat, MessageRecieved } from "@/src/constants/message";


/**
 * Obtiene la conversación (lista de mensajes) para una comisión dada.
 * Se envía el token en el header Authorization.
 */
export const getConversation = async (
  commisionId: number,
  token: string
): Promise<MessageRecieved[]> => {
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
 * El token se envía en el header Authorization.
 */
export const sendMessage = async (
  message: MessageChat,
  loggedUser: string
): Promise<MessageRecieved> => {
  try {
    const formData = new FormData();
    const { image, ...restOfmessage } = message;
    formData.append("chatMessage", JSON.stringify(restOfmessage));


    if (image && image.length > 0) {
      const imageProfileData = base64ToFile(image, "image.png");
      formData.append("imageProfile", imageProfileData);
    }
    

    const response = await api.post(`${API_URL}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${loggedUser}`,
      },
    });
   
    return response.data;
  } catch (error) {
    handleError(error, "Error sending message");
    throw error;
  }
};



function formatDateForBackend(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split(".")[0];
}

export const getNewMessages = async (
  commisionId: number,
  token: string,
  lastMessageDate: string
): Promise<MessageRecieved[]> => {
  try {
    const formattedDate = formatDateForBackend(lastMessageDate);
    const response = await api.get( `${API_URL}/messages/chat/${commisionId}/since?lastMessageDate=${encodeURIComponent(formattedDate)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        
      },
    }
  );
  return response.data;
  } catch (error) {
    handleError(error, "Error sending message");
    throw error;
  }
};