
import { StatusCommission } from "./CommissionTypes";

export interface MessageChat {
    text: string,
    createdAt: string,
    image: string | undefined,
    commision: string | undefined
  }


  export interface MessageRecieved {
    id: number, 
    text: string,
    creationDate: string,
    image: string | undefined,
    commisionId: number,
    senderId: number,
    senderName: string,
    statusCommision: StatusCommission
 
  }