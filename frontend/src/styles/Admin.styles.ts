import { StyleSheet, Platform } from "react-native";

const isWeb = Platform.OS === "web";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
      width: isWeb ? "50%" : "80%",
      alignSelf: "center",
    },
    title: {
      fontSize: 30,
      fontWeight: "700",
      marginBottom: 20,
      textAlign: "center",
    },
    searchInput: {
      backgroundColor: "white",
      padding: 12,
      borderRadius: 10,
      fontSize: 18,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    reportItem: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    reportTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    reportDescription: {
      fontSize: 14,
      marginBottom: 5,
    },
    reportStatus: {
      fontSize: 12,
      color: "gray",
    },
    categoryItem: {
      flexDirection: "row",
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    categoryImage: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginRight: 15,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    categoryDescription: {
      fontSize: 14,
      color: "#6c757d",
    },
    button: {
      backgroundColor: "#4CAF50",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "500",
    },
    editButton: {
      backgroundColor: "#28a745",
      padding: 8,
      borderRadius: 5,
    },
    deleteButton: {
      backgroundColor: "#E53935",
      padding: 8,
      borderRadius: 8,
      marginLeft: 10,
      alignItems: "center",
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "80%",
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 25,
      borderRadius: 15,
      width: "85%",
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    modalText: {
      fontSize: 14,
      marginBottom: 5,
    },
    input: {
      backgroundColor: "#f0f0f0",
      padding: 12,
      borderRadius: 10,
      fontSize: 18,
      marginBottom: 15,
      width: "100%",
      borderWidth: 1,
      borderColor: "#ced4da",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    smallButton: {
      backgroundColor: "#007bff",
      padding: 10,
      borderRadius: 5,
      flex: 0.8,
      alignItems: "center",
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: "#dc3545",
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    paginationButton: {
      backgroundColor: "#007bff",
      padding: 10,
      borderRadius: 5,
      margin: 5,
    },
    paginationButtonText: {
      color: "#fff",
    },
    paginationText: {
      fontSize: 16,
      marginHorizontal: 10,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 20,
      color: "#666",
      marginTop: 20,
    },
    userCard: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 15,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    userImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
    },
    userEmail: {
      fontSize: 16,
      color: "gray",
    },
    userPhone: {
      fontSize: 16,
      color: "#555",
    },
    userDate: {
      fontSize: 14,
      color: "#888",
    },
    picker: {
        height: 50,
        width: "100%",
        marginBottom: 10,
        textAlign: "center",
    },
    buttons: { 
        flexDirection: "row", 
        justifyContent: "flex-end", 
        marginTop: 10 
    }, 
      filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
      },
      filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#007BFF",
        borderRadius: 8,
      },
      filterButtonText: {
        color: "#FFF",
        fontWeight: "bold",
      },
      errorText: {
        color: "red",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 10,
      },
      errorContainer: {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: "center",
      },
  });

export default styles;
  