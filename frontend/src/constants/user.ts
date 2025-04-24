export interface artistUser {
    firstName: string;
    username: string;
    email: string;
    phoneNumber: string;
    description: string;
    linkToSocialMedia: string;
    tableCommissionsPrice: string;
    imageProfile: string;
  
  }

  export interface clientUser {
    firstName: string;
    username: string;
    email: string;
    phoneNumber: string ;
    description: string |  null ;
    linkToSocialMedia?: string;
    imageProfile: string | undefined;  
  }