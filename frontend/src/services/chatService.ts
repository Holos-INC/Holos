// src/services/chatService.ts
import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { base64ToFile } from "@/src/components/convertionToBase64Image";
import { Message, ReceiveChatMessage } from "@/src/constants/message";


/**
 * Obtiene la conversación (lista de mensajes) para una comisión dada.
 * Se envía el token en el header Authorization.
 */
export const getConversation = async (
  commisionId: number,
  token: string
): Promise<ReceiveChatMessage[]> => {
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
  message: Message,
  loggedUser: string
): Promise<ReceiveChatMessage> => {
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
