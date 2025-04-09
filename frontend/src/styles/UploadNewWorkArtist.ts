import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
    padding: 10,
  },

  uploadTitle: {
    fontSize: 50, 
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },

  formLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
    textAlign: 'center', 
  },
  
  inputNameWork: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    width: "70%",
    fontSize: 16,
    textAlign: "left",
  },

  inputDescriptionBox:{
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    
  },

  inputDescriptionWork: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: "70%",
    fontSize: 16,
    textAlign: "left",
  },
  inputCostWork: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    width: "70%",
    marginBottom: 10,
    textAlign: "center",
  },
  previewImageContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: "40%",
    width: "50%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "contain",
  },

  errorText: {
    color: 'red',
    marginBottom: 8,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingTop:20,
  },
  placeholderText: {
    color: "#999",
  },

  sendText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  iconButton: {
    fontSize: 50, 
    backgroundColor: '#ccc',
    borderRadius: 12,
    padding: 10,
  },
  
  containerContentUnableUpload: {
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
  textContainerUnableUpload: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    },
  containerUnableUpload: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",     
    backgroundColor: "#f8f8f8",
    padding: 20,
    },

    


})