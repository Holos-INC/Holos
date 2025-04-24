import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6", 
    padding: 10,
  },
  
  backgroundLogo: {
    position: "absolute",
    width: 250,
    height: 250,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -125 }, { translateY: -125 }],
    zIndex: -1,
  },
  messageRow: {
    width: "100%",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
  },
  messageBubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  messageBubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  messageText: {
    fontSize: 16,
    fontFamily: "DancingScript-Regular",
    color: "#333",
  },
  messageImage: {
    width: 200,
    height: 200,
    marginTop: 5,
    borderRadius: 5,
  },
  messageDate: {
    fontSize: 10,
    color: "#555",
    marginTop: 3,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontFamily: "DancingScript-Regular",
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 5,
  },
  imageButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 5,
  },
  imageButtonText: {
    color: "#fff",
    fontFamily: "DancingScript-Regular",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontFamily: "DancingScript-Regular",
    fontSize: 16,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
