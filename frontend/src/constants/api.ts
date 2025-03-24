import { Platform } from "react-native";

let BASE_URL: string = "";

if (__DEV__) {
  if (Platform.OS === "web") {
    BASE_URL = "http://localhost:8080";
  } else {
    BASE_URL = "http://10.0.2.2:8080";
  }
} else {
  BASE_URL = "https://holos-s2.onrender.com";
}

export const API_URL: string = `${BASE_URL}/api/v1`;
export { BASE_URL };
