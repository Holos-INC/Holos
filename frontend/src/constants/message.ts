
// Atención esta en proceso de construcción!!!!!

export interface message {
    id: number;
    name: string;
    username: string;
    password: string;
    email: string;
    phoneNumber?: string;
    imageProfile?: string;


    text: string,
    createdAt: data,
    user: {
        name: message.user.name,
        avatar: message.user.avatar || artistAvatar,
    },
    image: selectedImage || undefined, 
  }