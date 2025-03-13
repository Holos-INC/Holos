export type StatusCommision = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type EnumPaymentArrangement = "UPFRONT" | "HALF_HALF" | "FINAL_PAYMENT";

export interface BaseEntity {
    id: number;
}

export interface Artist {
    id: number;
    name: string;
}

export interface Work extends BaseEntity {
    name: string;
    description: string;
    price: number;
    artist: Artist;
}

export interface StatusKanbanOrder {
    id: number;
    name: string;
    order: number;
    description: string;
    color: string;
    artist: Artist;
}

export interface Client {
    id: number;
    name: string;
    email: string;
}

export interface Commision extends Work {
    status: StatusCommision;
    numMilestones: number;
    acceptedDateByArtist: string | null;
    paymentArrangement: EnumPaymentArrangement | null;
    statusKanbanOrder: StatusKanbanOrder | null;
    client: Client | null;
    artist: Artist;
}

export const emptyCommision = (): Commision => ({
    id: 0,
    name: "",
    description: "",
    price: 0,
    artist: { id: 0, name: "" },
    status: "PENDING",
    numMilestones: 0,
    acceptedDateByArtist: null,
    paymentArrangement: null,
    statusKanbanOrder: null,
    client: null,
});
