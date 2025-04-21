
import { Commission } from "./CommissionTypes";

export interface Message {
    text: string,
    createdAt: string,
    image: string | undefined,
    commision: Commission 
  }

  export interface ReceiveChatMessage {
    id: number;
    creationDate: string;
    text: string;
    image: string;
    commision: {
      id: number;
    };
  }