// ConversationListScreen.styles.ts
import { StyleSheet } from "react-native";


export const ConversationListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6E6E9", // Fondo general de la pantalla
    padding: 16,
  },
  list: {
    paddingBottom: 20,
  },
  conversationItem: {
    backgroundColor: "#FAE2E6", // Color secundario
    borderRadius: 8,
    marginVertical: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ECC1C9",
    // Sombra sutil
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Para Android
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333", // Texto principal
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});


export default ConversationListStyles;