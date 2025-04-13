import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { cancelSubscription } from '@/src/services/stripeApi';
import { AuthenticationContext } from '@/src/contexts/AuthContext';
import { Button, Dialog, Portal, Provider as PaperProvider } from 'react-native-paper';
import colors from '@/src/constants/colors';

export default function CancelPremiumScreen() {
    const { loggedInUser } = useContext(AuthenticationContext);
    const router = useRouter();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const handleCancelPress = () => {
        setConfirmVisible(true);
    };

    const confirmCancel = async () => {
        try {
            setLoading(true);
            await cancelSubscription(loggedInUser.token);
            setConfirmVisible(false);
            router.push('/profile/indexArtist');
        } catch (err) {
            console.error(err);
            alert("Error al cancelar suscripción.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({ title: '💔 Desactivar Holos Premium' });
    }, [navigation]);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>¿Cancelar suscripción premium?</Text>
                <Text style={styles.description}>
                    Si cancelas, perderás todos los beneficios premium y tu suscripción no se renovará.
                </Text>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelPress}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>
                        {loading ? 'Cancelando...' : 'Cancelar suscripción'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.goBack}>← Volver</Text>
                </TouchableOpacity>

                <Portal>
                    <Dialog visible={confirmVisible} onDismiss={() => setConfirmVisible(false)}>
                        <Dialog.Title>😿 ¿Estás seguro?</Dialog.Title>
                        <Dialog.Content>
                            <Text>
                                Tu suscripción premium será cancelada y perderás los beneficios.
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setConfirmVisible(false)}>No, volver</Button>
                            <Button onPress={confirmCancel} loading={loading} textColor={colors.brandPrimary}>
                                Sí, cancelar
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.brandPrimary,
      marginBottom: 12,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      color: colors.contentStrong,
      textAlign: 'center',
      marginBottom: 32,
      maxWidth: 300,
    },
    cancelButton: {
      backgroundColor: colors.brandPrimary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: colors.brandPrimary,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      marginBottom: 20,
    },
    cancelButtonText: {
      color: '#FFF',
      fontWeight: '600',
      fontSize: 16,
    },
    goBack: {
      color: colors.contentStrong,
      fontSize: 14,
    }
});
