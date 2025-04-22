
import { Commission } from "./CommissionTypes";

export interface Message {
    text: string,
    createdAt: string,
    image: string | undefined,
    commision: string | undefined,
    creator_id: string 
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