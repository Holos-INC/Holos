export interface artistUser {
    firstName: string;
    username: string;
    email: string;
    phoneNumber: string;
    description: string;
    linkToSocialMedia: string |  null ;
    tableCommissionsPrice: string;
    imageProfile: string;
  
  }

  export interface clientUser {
    firstName: string;
    username: string;
    email: string;
    phoneNumber: string ;
    description: string |  null ;
    linkToSocialMedia: string |  null ;
    tableCommissionsPrice: null;
    imageProfile: string | undefined;  
  }