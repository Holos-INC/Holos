import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet, Platform, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { User } from "@/src/constants/CommissionTypes";
import { API_URL } from "@/src/constants/api";
import LoadingScreen from "@/src/components/LoadingScreen";

const isWeb = Platform.OS === "web";

const UserProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { loggedInUser } = useContext(AuthenticationContext);
  
  useEffect(() => {
      navigation.setOptions({ title: `${loggedInUser?.baseUser.username}'s profile` });
    }, [navigation, loggedInUser]);

  if (!loggedInUser) {
    return <LoadingScreen />;
  }

  // Determinamos si el usuario es artista verificando si tiene tableCommisionsPrice
  const isArtist = "tableCommisionsPrice" in loggedInUser && loggedInUser.tableCommisionsPrice;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{isArtist ? "ARTISTA" : "CLIENTE"}</Text>
        <Image
          source={{ uri: `${API_URL}${loggedInUser.baseUser.imageProfile}` }} // TODO Conseguir static image
          style={styles.image}
        />
        <Text style={styles.label}>
          DATOS {isArtist ? "ARTISTA" : "CLIENTE"}
        </Text>
        <Text style={styles.fieldLabel}>Nombre:</Text>
        <TextInput style={styles.input} value={loggedInUser.baseUser.username} editable={false} />
        <Text style={styles.fieldLabel}>Usuario:</Text>
        <TextInput
          style={styles.input}
          value={loggedInUser.baseUser.username}
          editable={false}
        />
        <Text style={styles.fieldLabel}>Correo Electrónico:</Text>
        <TextInput style={styles.input} value={loggedInUser.baseUser.email} editable={false} />
        <Text style={styles.fieldLabel}>Teléfono:</Text>
        <TextInput
          style={styles.input}
          value={loggedInUser.baseUser.phoneNumber}
          editable={false}
        />
        {/* <View style={styles.buttonsContainer}>
          <Button title="EDITAR" onPress={handleEdit} color="#1E3A8A" />
        </View> */}
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
    paddingTop: 10,
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
});

export default UserProfileScreen;
