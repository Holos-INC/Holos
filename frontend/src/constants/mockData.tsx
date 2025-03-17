export interface Artwork {
    id: number;
    title: string;
    image: string;
}

export interface Artist {
    id: number;
    name: string;
    username: string;
    image: string;
    description: string;
    artworks: Artwork[];
}

export const ALL_ARTISTS: Artist[] = [
    { id: 10, name: "John Doe", username:"johnDoe", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063", description: "John Doe es un artista conocido por su estilo abstracto único.", artworks: [{ id: 1, title: "Obra 1", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063" }] },
    { id: 11, name: "Alice", username:"aliceCat", image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb", description: "Alice es una artista paisajista que se especializa en la captura de la serenidad de la naturaleza.", artworks: [{ id: 2, title: "Obra 2", image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb" }] },
    { id: 12, name: "Bob", username:"bobEsponja", image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b", description: "Bob es un artista de arte moderno que utiliza medios mixtos.", artworks: [{ id: 3, title: "Obra 3", image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b" }] },
    { id: 13, name: "Charlie", username:"charlieChocolate", image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42", description: "Charlie es un pintor clásico conocido por sus retratos detallados.", artworks: [{ id: 4, title: "Obra 4", image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42" }] },
    { id: 14, name: "Diana", username:"dianaNguyen", image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664", description: "Diana es una artista experta en la pintura al óleo.", artworks: [{ id: 5, title: "Obra 5", image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664" }] },
    { id: 15, name: "Eve", username:"adamNEve", image: "https://images.unsplash.com/photo-1513682121497-80211f36a7d3", description: "Eve es una artista contemporánea que mezcla el arte abstracto.", artworks: [{ id: 6, title: "Obra 6", image: "https://images.unsplash.com/photo-1513682121497-80211f36a7d3" }] },
    { id: 16, name: "Frank", username:"freakyFrank", image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93", description: "Frank es conocido por su vibrante y colorida pintura.", artworks: [{ id: 7, title: "Obra 7", image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93" }] },
    { id: 17, name: "Georgia", username:"georgia", image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0", description: "Georgia es una artista minimalista.", artworks: [{ id: 8, title: "Obra 8", image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0" }] },
];