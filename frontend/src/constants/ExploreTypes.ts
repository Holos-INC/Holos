export interface BaseUser {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  imageProfile?: string;
}

export interface Artist {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  imageProfile?: string;
  tableCommisionsPrice?: string;
  numSlotsOfWork: number;
  baseUser?: BaseUser;
}

export interface Work {
  id: number;
  name: string;
  description: string;
  price: number;
  artist: Artist;
  image: string;
}

export interface WorksDoneDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}