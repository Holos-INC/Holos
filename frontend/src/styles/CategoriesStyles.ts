import { StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";

const { width } = useWindowDimensions();
const isBigScreen = width >= 1024;

const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },categoriesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16,
    },
    categoryImageContainer: {
      width: 80,
      height: 80,
      borderRadius: 10,
      overflow: "hidden",
    },
    container: {
      flex: 1,
      backgroundColor: "#F0F0F0",
      padding: isBigScreen ? 40 : 0,
    },
    banner: {
      backgroundColor: "#183771",
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    bannerText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 20,
    },
    content: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
    },
    noCategoriesText: {
      textAlign: "center",
      fontSize: 14,
      color: "#777",
      marginTop: 20,
    },
    card: {
      flexDirection: "row",
      backgroundColor: "#FFF",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
    },
    text: {
      fontSize: 14,
      color: "#333",
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    editButton: {
      padding: 5,
      borderRadius: 5,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#183771",
      padding: 15,
      borderRadius: 10,
      position: "absolute",
      bottom: 20,
      right: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    addButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "80%",
      backgroundColor: "#FFF",
      padding: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: "#CCC",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    saveButton: {
      backgroundColor: "#183771",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginBottom: 10,
    },
    saveButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    cancelButton: {
      backgroundColor: "#BBB",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    cancelButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
});

export default styles;
