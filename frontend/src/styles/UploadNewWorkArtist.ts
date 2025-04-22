import { StyleSheet } from 'react-native';
import colors from "@/src/constants/colors";

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
      button: {
        backgroundColor: colors.brandPrimary,
        padding: 10,
        borderRadius: 5,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
      },
      buttonText: {
        color: "white",
        fontSize: 16,
      },
      sides: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        padding: "10%",
        gap: 33,
      },
      dropdownOptions: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 5,
        padding: 10,
        borderColor: colors.brandPrimary,
        borderWidth: 1,
      },
      option: {
        paddingVertical: 8,
        fontSize: 16,
        color: colors.brandPrimary,
      },
      totalPrice: {
        fontSize: 16,
        color: colors.contentStrong,
        marginBottom: 10,
      },
      label: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.brandPrimary,
      },
      card: {
        padding: 25,
        backgroundColor: "white",
        width: "100%",
        borderRadius: 20,
        shadowColor: colors.brandPrimary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 6,
      },
      description: {
        fontSize: 14,
        color: colors.contentStrong,
        marginTop: 10,
        fontStyle: "italic",
        marginBottom: 10,
      }



    


})