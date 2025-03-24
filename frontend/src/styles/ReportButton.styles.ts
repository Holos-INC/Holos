import { StyleSheet } from "react-native";


export default StyleSheet.create({
    menuButton: {
        right:-5, 
        padding: 10,
        backgroundColor:"rgba(229, 194, 194, 0.83)",
        borderRadius: 20,
        position: "absolute",
        alignItems: "flex-end",
        zIndex: 12, 
    },
  menuButtonBigScreen: {
    right:4, 
    padding: 10,
    top:2,
    backgroundColor:"rgba(229, 194, 194, 0.83)",
    borderRadius: 20,
    position: "absolute",
    zIndex: 23, 
    marginRight:29
  },

  menu: {
    position: "absolute",
    top: 42, 
    right: 5,
    backgroundColor: "white",
    padding: 11,
    borderRadius: 5,
    zIndex: 13, 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    zIndex: 14, 
  },
  menuItemText: {
    fontSize: 14,
    color: "#333",
  
  },
});
