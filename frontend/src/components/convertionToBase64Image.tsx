export const base64ToFile = (
  base64Data: string,
  filename: string,
  defaultMime = "image/png"
): File => {
  if (!base64Data || typeof base64Data !== "string") {
    throw new Error("El dato base64 está vacío o no es una cadena.");
  }

  const hasHeader = base64Data.includes("base64,");

  let mime = defaultMime;
  let base64String = base64Data;

  if (hasHeader) {
    const [header, data] = base64Data.split(",");
    const mimeMatch = header.match(/data:(.*?);base64/);
    if (mimeMatch) mime = mimeMatch[1];
    base64String = data;
  }

  try {
    const binary = atob(base64String);
    const u8arr = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      u8arr[i] = binary.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  } catch {
    throw new Error("El contenido base64 no es válido.");
  }
};
