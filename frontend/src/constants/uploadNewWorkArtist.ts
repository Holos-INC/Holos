export interface newWorkArtist {
    name: string;
    description: string;
    price: number;
  }

  export interface newWorkUploadArtist {
    newWorkArtist: newWorkArtist;
    image: number[];
  }