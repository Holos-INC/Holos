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
  numSlotsOfWork: number;
  tableCommissionsPrice: string;
  baseUser: BaseUser;
  name: string;
  username: string;
  email: string;
  description: string;
  location: string;
  subscriptionId: string|null;
}

export type User = Client | Artist;

// COMMISSIONS

export enum StatusCommission {
  REQUESTED = "REQUESTED",
  WAITING_CLIENT = "WAITING_CLIENT",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  WAITING_ARTIST = "WAITING_ARTIST",
  NOT_PAID_YET = "NOT_PAID_YET",
  IN_WAIT_LIST = "IN_WAIT_LIST",
  ENDED = "Finalizado",
}

export enum PaymentArrangement {
  INITIAL = "INITIAL",
  FINAL = "FINAL",
  FIFTYFIFTY = "FIFTYFIFTY",
  MODERATOR = "MODERATOR",
}

export interface Work {
  id: number;
  name: string;
  description: string;
  price: number;
  artist: Artist;
  image: string;
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
  milestoneDate: String;
  acceptedDateByArtist: string; // Stored as ISO date string
  paymentArrangement: PaymentArrangement;
  statusKanbanOrder: StatusKanbanOrder;
  client: Client;
}

export interface WorksDone extends Work {}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

export interface HistoryCommisionsDTO {
  requested: CommissionProtected[];

  accepted: CommissionDTO[];

  history: CommissionProtected[];

  error: string;
}

export interface CommissionProtected {
  image?: string;

  imageProfile?: string;

  id: number;

  name: string;

  description: string;

  price: number;

  status: StatusCommission;

  paymentArrangement: PaymentArrangement;

  milestoneDate: Date;

  artistUsername: string;

  clientUsername: string;
}

export interface CommissionInProgress {
  image?: string;
  id: number;
  imageProfile?: string;
  name: string;
  artistUsername: string;
  currentStep: number;
  totalSteps: number;
}

export interface BaseUserDTO {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  imageProfile: string;
  tableCommissionsPrice: string;
}

export interface CommissionDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  status: StatusCommission;
  paymentArrangement: PaymentArrangement;
  milestoneDate: Date;
  artistUsername: string;
  clientUsername: string;
  image: string;
  imageProfileA: string;
  imageProfileC: string;
}

export interface ClientCommissionDTO {
    id: number;
    image: string | null;
    imageProfile: string | null;
    name: string;
    artistUsername: string;
    clientUsername: string;   
    currentStep: number;
    totalSteps: number;
  }