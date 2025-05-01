// src/services/ExploreWorkHelpers.ts
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { BASE_URL } from "@/src/constants/api";
import { getMostPublicationsArtists } from "@/src/services/WorksDoneApi"; // Nuevo import
import api from "./axiosInstance";

/**
 * Llama a la API y devuelve el array de WorksDoneDTO.
 */
export async function fetchWorksAndTransform(
  token: string
): Promise<WorksDoneDTO[]> {
  try {
    const data = await api.get(`${BASE_URL}/api/v1/search/works`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data.content;
  } catch (error) {
    console.error("Error fetching works done:", error);
    throw error;
  }
}

/**
 * Decodifica la cadena en base64 que representa la ruta de la imagen y construye la URL completa.
 * Si la cadena decodificada es algo como "/images/miImagen.jpg", se concatenará con BASE_URL.
 */
export function decodeImagePath(encodedPath: string): string {
  let decodedPath: string;
  if (typeof atob === "function") {
    decodedPath = atob(encodedPath);
  } else {
    // Fallback para entornos donde atob no está definido (por ejemplo, Node.js)
    decodedPath = Buffer.from(encodedPath, "base64").toString("utf-8");
  }
  return `${BASE_URL}${decodedPath}`;
}

/**
 * Interfaz mínima para representar a un artista en la sección de artistas.
 * Se ha añadido imageProfile para almacenar la imagen del artista.
 */
export interface ArtistMin {
  id: number;
  name: string;
  username: string;
  baseUserid?: number;
  location?: string;
  imageProfile?: string;
  isPremium?: boolean;
}

/**
 * Obtiene los tres artistas con más publicaciones usando la nueva API.
 */
export async function getTopThreeArtists(): Promise<ArtistMin[]> {
  try {
    const artists: ArtistMin[] = (await getMostPublicationsArtists()).map(
      (artist) => ({
        id: artist.id,
        baseUserid: artist?.baseUser.id,
        description: artist?.description,
        imageProfile: artist?.baseUser?.imageProfile,
        name: artist.baseUser?.name,
        username: artist.baseUser?.username,
        isPremium: artist.baseUser.authority == "ARTIST_PREMIUM" ? true : false,
      })
    );
    return artists;
  } catch (error) {
    console.error("Error fetching top three artists:", error);
    throw error;
  }
}
