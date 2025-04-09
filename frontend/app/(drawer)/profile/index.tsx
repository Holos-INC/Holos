import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet, Platform, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { User } from "@/src/constants/CommissionTypes";
import { API_URL, BASE_URL } from "@/src/constants/api";
import LoadingScreen from "@/src/components/LoadingScreen";
import { getUser } from "@/src/services/userApi";
import colors from "@/src/constants/colors";
import { useAuth } from "@/src/hooks/useAuth";

const isWeb = Platform.OS === "web";

const UserProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { loggedInUser } = useContext(AuthenticationContext);
  const [user, setUser] = useState<User | null>(null);
  const { isArtist } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usuario = await getUser(loggedInUser.token);
        setUser(usuario);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [user?.id]);

  useEffect(() => {
    navigation.setOptions({ title: `Mi perfil` });
  }, [navigation, user]);

  if (!user) {
    return <LoadingScreen />;
  }

  // Determinamos si el usuario es artista verificando si tiene tableCommisionsPrice
  const isPremium = user && 'subscriptionId' in user && user.subscriptionId !== null;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{isArtist ? "ARTISTA" : "CLIENTE"}</Text>
        <Image
          source={
            user?.baseUser?.imageProfile
              ? { uri: `${BASE_URL}${atob(user.baseUser.imageProfile)}` }
              : undefined
          }
          // TODO Conseguir de imagenes estáticas
          style={styles.image}
        />
        { isArtist ? <View style={[styles.premiumBadge, !isPremium && styles.freeBadge]}>
          <Text style={[styles.premiumBadgeText, !isPremium && styles.freeBadgeText]}>
            { isPremium ? '🌟 Premium' : 'Gratis'}
          </Text>
        </View>:<></>}
        <Text style={styles.label}>
          DATOS {isArtist ? "ARTISTA" : "CLIENTE"}
        </Text>
        <Text style={styles.fieldLabel}>Nombre:</Text>
        <TextInput style={styles.input} value={user.baseUser.username} editable={false} />
        <Text style={styles.fieldLabel}>Usuario:</Text>
        <TextInput
          style={styles.input}
          value={user.baseUser.username}
          editable={false}
        />
        <Text style={styles.fieldLabel}>Correo Electrónico:</Text>
        <TextInput style={styles.input} value={user.baseUser.email} editable={false} />
        <Text style={styles.fieldLabel}>Teléfono:</Text>
        <TextInput style={styles.input} value={user.baseUser.phoneNumber} editable={false}/>

        {isArtist ? <TouchableOpacity onPress={() => navigation.navigate("profile/stripe-setup")} style={styles.stripeButton}>
            <Text style={styles.stripeButtonText}>Conectar Stripe</Text>
          </TouchableOpacity>:<></>}
        {isArtist && (
          isPremium ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("profile/premium/cancel")}
              style={styles.stripeButton}
            >
              <Text style={styles.stripeButtonText}>Cancelar Holos Premium</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("profile/premium/index")}
              style={styles.stripeButton}
            >
              <Text style={styles.stripeButtonText}>Holos Premium</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F9FAFB",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 5,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 5,
  },
  input: {
    width: "80%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonsContainer: {
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
    width: isWeb ? "20%" : "80%",
  },
  commissionContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  commissionImage: {
    width: "90%",
    height: 150,
    resizeMode: "contain",
    marginTop: 5,
    borderRadius: 5,
  },
  stripeButton: {
    backgroundColor: colors.brandPrimary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    padding:12,
  },
  stripeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  premiumBadge: {
    backgroundColor: '#ffe3f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fbc0d9',
    shadowColor: '#f45b82',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  premiumBadgeText: {
    color: '#f45b82',
    fontWeight: '600',
    fontSize: 14,
  },
  freeBadge: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  freeBadgeText: {
    color: '#999',
  }
});

export default UserProfileScreen;
