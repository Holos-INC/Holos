import { useState, useContext, useEffect } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
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
        <>
            <Button mode="contained" onPress={showModal} style={styles.logoutButton}>
                Cerrar Sesión
            </Button>

            <Portal>
                <Dialog visible={visible} onDismiss={hideModal}>
                    <Dialog.Title>¿Salir de Holos?</Dialog.Title>
                    <Dialog.Content>
                        <Text style={styles.dialogText}>
                            ¿Estás seguro de que quieres cerrar sesión? Todos tus datos estarán seguros.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideModal} style={styles.cancelButton}>Cancelar</Button>
                        <Button onPress={handleLogout} mode="contained" style={styles.confirmButton}>
                            Sí, salir
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    logoutButton: { 
        backgroundColor: "#E63946", 
        borderRadius: 10, 
        paddingVertical: 5, 
        width: "100%" 
    },
    dialogText: { 
        fontSize: 16, 
        color: "#333" 
    },
    cancelButton: { 
        marginRight: 10 
    },
    confirmButton: { 
        backgroundColor: "#E63946" 
    }
});
