import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    header: {
      flexDirection: "row",
      marginBottom: 20,
    },
    artistImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginRight: 20,
    },
    artistDetails: {
      flex: 1,
      justifyContent: "center",
    },
    artistName: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    artistDescription: {
      fontSize: 16,
      color: "#555",
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    button: {
      backgroundColor: "#007BFF",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: "48%",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    artworksContainer: {
      marginTop: 20,
    },
    artworksTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    artworksList: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    artworkItem: {
      width: "48%",
      marginBottom: 20,
      
    },
    artworkImage: {
      width: "100%",
      height: 120,
      borderRadius: 8,
   
    },
    artworkTitle: {
      textAlign: "center",
      marginTop: 8,
      fontSize: 14,
    },

    reportDropDownContainer: {
      paddingRight: 25,
      right:-20,
      position:"absolute"
    }
  });
  