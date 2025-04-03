import { Alert, Platform } from "react-native";



const popUpMovilWindows =  (title: string, message:string) => {
    if (Platform.OS === "web") {
        window.alert(`${title}: ${message}`);
      } else {
        Alert.alert(title, message);
      }
}

export default popUpMovilWindows;