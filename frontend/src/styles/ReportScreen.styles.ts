import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  artworkImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  placeholder: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignSelf: "center",
  },
  artworkTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  artistName: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    zIndex: 1000,
  },
  dropDownContainerStyle: {
    borderColor: "#ccc",
    zIndex: 1000,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  loading: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "#555",
  },

  singInButton: { 
    backgroundColor: "#E63946", 
    borderRadius: 10, 
    paddingVertical: 5, 
    width: "100%" 
},
containerContentNotRegister: {
    justifyContent: "center",
  alignItems: "center",  
  backgroundColor: "#d6d6d6",
  padding: 24,
  borderRadius: 20,
  width: "95%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 5,
},
textContainerNotRegister: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 10,
  textAlign: "center",
},
containerNotRegister: {
  flex: 1,
  justifyContent: "center", // centra verticalmente
  alignItems: "center",     // centra horizontalmente
  backgroundColor: "#f8f8f8",
  padding: 20,
},

});
  
  export default styles;