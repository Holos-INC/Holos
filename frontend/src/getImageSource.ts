import { BASE_URL } from "@/src/constants/api";

/**
 * Comprueba si la cadena base64 decodificada es una ruta de imagen.
 * @param base64 Cadena codificada en base64.
 * @returns boolean
 */
const isBase64Path = (base64: string): boolean => {
  try {
    const decoded = atob(base64);
    return decoded.startsWith("/images/");
  } catch {
    return false;
  }
};

/**
 * Devuelve el objeto adecuado para el atributo `source` de <Image>.
 * @param imageString Cadena de imagen en base64 o ruta codificada.
 * @returns Objeto con la propiedad uri.
 */
export function getImageSource(imageString: string) {
  if (isBase64Path(imageString)) {
    return { uri: `${BASE_URL}${atob(imageString)}` };
  } else {
    return { uri: `data:image/jpeg;base64,${imageString}` };
  }
}
