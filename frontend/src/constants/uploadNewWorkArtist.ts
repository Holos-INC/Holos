import { PaymentArrangement } from "./CommissionTypes";

export interface newWorkArtist {
    name: string;
    description: string;
    price: number;
    paymentArrangement: PaymentArrangement;
    totalPayments: number;
  }

  export interface newWorkUploadArtist {
    newWorkArtist: newWorkArtist;
    image: number[];
  }

  export interface globalNewWorkUploadArtist {
    name: string;
    description: string;
    price: number;
    image: number[];
  }