import { StyleSheet } from "react-native";

export  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF5F7",
    },
    contentWrapper: {
      paddingHorizontal: 50, 
      paddingVertical: 60,
      alignItems: "center",
    },
    title: {
      fontSize: 40,
      fontFamily: 'Montserrat-Bold',
      fontWeight: "700",
      color: "#333",
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 20,
      fontFamily: 'Montserrat-Regular',
      color: "#555",
      marginBottom: 20,
      lineHeight: 28,
      textAlign: "center",
    },
    infoSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
      flexWrap: "wrap",
      width: "100%",
      marginTop: 30,
    },
    infoBlock: {
      flex: 1,
      minWidth: 300,
      padding: 10,
    },
    sectionHeader: {
      fontSize: 22,
      fontFamily: 'Montserrat-Bold',
      color: "#333",
      marginBottom: 10,
      textAlign: "center",
    },
    mapWrapper: {
      flex: 1,
      borderWidth: 2,
      borderColor: "#ddd",
      borderRadius: 8,
      overflow: "hidden",
    },
    formWrapper: {
      rowGap: 10,
      flex: 1,
      justifyContent: "center",
    },
    messageInput: {
      height: 100,
      fontFamily: 'Montserrat-Regular',
      textAlignVertical: "top",
    },
    button: {
      backgroundColor: "#16366E",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: "#F3B7D0",
      fontFamily: 'Montserrat-Regular',
      fontSize: 18,
      fontWeight: "600",
    },
    additionalInfoWrapper: {
      marginTop: 30,
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      flexWrap: "wrap",
    },
    socialMediaWrapper: {
      marginTop: 30,
      alignItems: "center",
      width: "100%",
    },
    socialIconsRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      marginTop: 10,
    },
    socialIconButton: {
      marginHorizontal: 10,
    },
    textemail: {
      fontSize: 18,
      fontFamily: 'Montserrat-Regular',
      color: "black",
      textAlign: "center"
    },
    email: {
      fontSize: 18,
      fontFamily: 'Montserrat-Bold',
      color: "black",
    },
  });