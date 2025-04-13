// src/services/chatService.ts
import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";

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
  image?: { uri: string; type: string; name: string },
  token?: string
): Promise<ChatMessage> => {
  try {
    const formData = new FormData();
    const chatMessage = {
      text,
      commision: { id: commisionId },
    };

    formData.append("chatMessage", JSON.stringify(chatMessage));

    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: image.type,
        name: image.name,
      } as any);
    } else {
      // Usamos un dummy de 1x1 píxel transparente en formato PNG (base64)
      const dummyBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/8vNPmEAAAAASUVORK5CYII=";
      const dummyBlob = base64ToBlob(dummyBase64, "image/png");
      // En entornos web, podemos crear un objeto File a partir del Blob
      const dummyFile = new File([dummyBlob], "dummy.png", { type: "image/png" });
      formData.append("image", dummyFile);
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
