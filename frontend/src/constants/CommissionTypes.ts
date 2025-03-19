export interface BaseUser {
    id: number;
    name: string;
    username: string;
    password: string;
    email: string;
    phoneNumber?: string;
    imageProfile?: string;
    createdUser: string;
    authority: {
      id: number;
      authority: string;
    };
}

export interface Client {
    id: number;
    baseUser: BaseUser;
}

export interface Artist {
    id: number;
    numSlotsOfWork: number,
    tableCommissionsPrice: string,
    baseUser: BaseUser;
    name: string;
    username: string;
    email: string;
}

export type User = Client | Artist;

// COMMISSIONS

export enum StatusCommission {
    REQUESTED = "REQUESTED",
    IN_WAIT_LIST = "IN_WAIT_LIST",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED",
    ENDED = "ENDED"
}

export enum PaymentArrangement {
    INITIAL = "INITIAL",
    FINAL = "FINAL",
    FIFTYFIFTY = "FIFTYFIFTY",
    MODERATOR = "MODERATOR"
}

export interface Work {
    id: number;
    name: string;
    description: string;
    price: number;
    artist: Artist;
}

export interface StatusKanbanOrder {
    id: number;
    name: string;
    order: number;
    description?: string;
    color: string;
    artist: Artist;
}

export interface Commission extends Work {
    status: StatusCommission;
    numMilestones: number;
    acceptedDateByArtist: string; // Stored as ISO date string
    paymentArrangement: PaymentArrangement;
    statusKanbanOrder: StatusKanbanOrder;
    client: Client;
}

export interface WorksDone extends Work {
    image: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
}
  