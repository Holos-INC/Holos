import axios from "axios";
import api from "@/src/services/axiosInstance";
import { API_URL } from "@/src/constants/api";
import { ChatMessage } from "@/src/services/chatMessage";
import { Conversation } from "@/src/services/Conversation";

const CHAT_URL = `${API_URL}/messages`;

export const getConversation = async (
  toUserId: number,
  token: string
): Promise<ChatMessage[]> => {
  try {
    const response = await api.get<ChatMessage[]>(`${CHAT_URL}/chat/${toUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching conversation:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};

export const sendMessage = async (
  messageData: Partial<ChatMessage>,
  token: string
): Promise<ChatMessage> => {
  try {
    const response = await api.post<ChatMessage>(
      CHAT_URL,
      messageData,
      {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    );
    
    const sentMessage = response.data;
    
    if (typeof sentMessage.creationDate === "string") {
      sentMessage.creationDate = new Date(sentMessage.creationDate);
    }
    
    return sentMessage;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error sending message:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};

export const getChatMessage = async (
  id: number,
  token: string
): Promise<ChatMessage> => {
  try {
    const response = await api.get<ChatMessage>(`${CHAT_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching chat message:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};

export const deleteMessage = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await api.delete(`${CHAT_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error deleting message:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};

export const getAllUserConversations = async (
  userId: number,
  token: string
): Promise<Conversation[]> => {
  try {
    const response = await api.get<Conversation[]>(`${CHAT_URL}/conversations/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching conversations:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};
export const getAllUserMessages = async (
  userId: number,
  token: string
): Promise<ChatMessage[]> => {
  try {
    const response = await api.get<ChatMessage[]>(`${CHAT_URL}/allByUser/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los mensajes del usuario:", error);
    throw error;
  }
};
