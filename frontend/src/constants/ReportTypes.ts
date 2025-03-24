
export enum ReportStatus {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
}

export interface ReportType {
    id: number;
    type: string;
}

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

export interface Artist {
    id: number;
    numSlotsOfWork: number,
    tableCommissionsPrice: string,
    baseUser: BaseUser;
    name: string;
    username: string;
    email: string;
}

export interface Work {
    id: number;
    name: string;
    description: string;
    price: number;
    artist: Artist;
}

export interface Report {
    id?: number; 
    name: string;
    description: string;
    status: ReportStatus;
    madeBy: BaseUser; 
    reportedUser?: Artist; 
    work?: Work; 
    reportType?: ReportType; 
}
