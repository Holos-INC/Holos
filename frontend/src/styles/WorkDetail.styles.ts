import { StyleSheet } from "react-native";

export const desktopStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    paddingBottom: 150,
    paddingLeft: 50,
  },
  imageStyle: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    paddingLeft: 100,
    paddingTop: 150,
  },
  informationContainer: {
    flex: 1,
    width: 400,
    justifyContent: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backArrow: {
    fontSize: 15,
    marginRight: 5,
    transform: [{ translateY: -3 }],
  },
  backText: {
    fontFamily: "Merriweather-Regular",
    fontSize: 15,
    marginLeft: 5,
  },
  title: {
    fontSize: 38,
    fontFamily: "Merriweather-Regular",
    marginBottom: 10,
  },
  infoText: {
    marginBottom: 8,
    fontFamily: "Merriweather-Regular",
    color: "#878582",
  },
  infoLabel: {
    fontWeight: "bold",
  },
  artistText: {
    fontFamily: "Merriweather-Regular",
    marginBottom: 45,
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#A3A19F",
    marginVertical: 20,
  },
  price: {
    fontFamily: "Merriweather-Bold",
    fontSize: 16,
    color: "#000",
    marginTop: 10,
  },

  reportContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  reportButtonText: {
    fontFamily: "Merriweather-Bold",
    fontSize: 16,
    marginTop: 10,
  },
});

export const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 5,
  },
  leftColumn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  imageStyle: {
    width: "90%",
    height: 300,
    resizeMode: "contain",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderContainer: {
    width: "90%",
    height: 300,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  informationContainer: {
    marginVertical: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backArrow: {
    fontSize: 14,
    marginRight: 5,
    transform: [{ translateY: -2 }],
  },
  backText: {
    fontFamily: "Merriweather-Regular",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontFamily: "Merriweather-Regular",
    marginBottom: 10,
  },
  artistText: {
    fontFamily: "Merriweather-Regular",
    marginBottom: 25,
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "Merriweather-Regular",
    color: "#878582",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#A3A19F",
    marginVertical: 15,
  },
  price: {
    fontFamily: "Merriweather-Bold",
    fontSize: 16,
    color: "#000",
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  reportContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  reportButtonText: {
    fontFamily: "Merriweather-Bold",
    fontSize: 16,
    marginTop: 10,
  },
});
