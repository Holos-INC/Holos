import axios from "axios";

export const handleError = (error: unknown, message: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${message}:`, error.response?.data || error.message);
  } else {
    console.error(`${message}:`, (error as Error).message);
  }
};
