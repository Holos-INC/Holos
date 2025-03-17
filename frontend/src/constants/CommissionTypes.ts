export interface Artist {
    id: number;
    name: string;
    username: string;
    imageProfile?: string;
    description: string;
}
  
export type Commission = {
    name: string;
    description: string;
    price: number;
    numMilestones: number;
    paymentArrangement: "INITIAL" | "FULL" | "PARTIAL";
};
  