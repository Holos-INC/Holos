import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: "hidden",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  client: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    backgroundColor: "#e8e8e8",
    padding: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 80,
  },
  content: {
    padding: 12,
    paddingBlockStart: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingBlock: 2,
    borderRadius: 6,
    backgroundColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  price: {
    fontSize: 14,
    textAlign: "center",
    color: "#00",
  },
  username: {
    fontWeight: "600",
  },
});

export const dialogStyles = StyleSheet.create({
  dialogContainer: {
    width: "33%",
    alignSelf: "center",
  },
  icon: {
    margin: 0,
    padding: 0,
    alignSelf: "center",
  },
  previewImage: {
    width: "100%",
    maxWidth: "100%",
    maxHeight: 300,
    aspectRatio: 1,
    resizeMode: "contain",
    marginBlock: 24,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  selectButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 0,
    padding: 0,
    gap: 0,
  },
});
