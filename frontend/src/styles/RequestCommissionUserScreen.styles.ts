import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  dateButton: {
    padding: 12,
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#333",
  },  
  errorText: {
    color: 'red',
    marginBottom: 8,
  },  
  scrollContainer: {
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  commissionContainer: {
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  commissionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  formContainer: {
    width: "90%",
    alignSelf: "center",
    gap: 10,
  },
  title: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlignVertical: "top",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 100,
    textAlignVertical: "top",
  },
  previewContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  placeholderText: {
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  imageButton: {
    backgroundColor: "#FECEF1",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: "#173C75",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});