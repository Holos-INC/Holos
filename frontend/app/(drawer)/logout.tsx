import { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Portal, Dialog } from "react-native-paper";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function LogoutModal() {
    const { signOut } = useContext(AuthenticationContext);
    const [visible, setVisible] = useState(false);
    const router = useRouter();
  
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
  
    const handleLogout = () => {
      signOut(() => console.log("Logged out!"));
      hideModal();
      router.replace("/login");
    };
  
    return (
      <View style={styles.screen}>
        <Text style={styles.heading}>¿Vas a salir ya?</Text>
        <Text style={styles.subtext}>Te vamos a extrañar...</Text>
  
        <Button
          mode="contained"
          onPress={showModal}
          icon="logout"
          style={styles.logoutButton}
          labelStyle={styles.logoutLabel}
        >
          Cerrar sesión
        </Button>
  
        <Portal>
          <Dialog visible={visible} onDismiss={hideModal}>
            <Dialog.Title>¿Salir de Holos?</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>
                ¿Estás seguro de que quieres cerrar sesión? 😿
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideModal}>Cancelar</Button>
              <Button onPress={handleLogout} mode="contained" buttonColor="#F05A7E">
                Sí, salir 🖕
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#f6f6f6",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    heading: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 4,
      color: "#444",
    },
    subtext: {
      fontSize: 14,
      color: "#777",
      marginBottom: 24,
    },
    logoutButton: {
      backgroundColor: "#F05A7E",
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    logoutLabel: {
      fontSize: 16,
      color: "#fff",
    },
    dialogText: {
      fontSize: 16,
      color: "#333",
    },
  });
  