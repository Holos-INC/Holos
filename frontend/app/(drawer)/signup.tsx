import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { API_URL } from "@/src/constants/api";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import colors from "@/src/constants/colors";
import { base64ToFile } from "@/src/components/convertionToBase64Image";

export default function SignupScreen() {
  // Estados compartidos
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Estado para confirmar contraseña
  const [passwordError, setPasswordError] = useState(""); // Estado para mensaje de error
  const [imageProfile, setImageProfile] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [role, setRole] = useState("client");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigation = useNavigation();

  // Estados específicos para artistas
  const [numSlotsOfWork, setNumSlotsOfWork] = useState("");
  const [tableCommissionsPrice, setTableCommissionsPrice] = useState("");

  const router = useRouter();

  // Validación en tiempo real: cuando cambie password o confirmPassword
  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleSignup = async () => {
    // Validaciones
    if (!acceptTerms) {
      alert("Debes aceptar los Términos y Condiciones");
      return;
    }

    if (passwordError) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!password || !confirmPassword) {
      alert("Debes ingresar y confirmar la contraseña");
      return;
    }

    if (!selectedImage) {
      alert("Selecciona una foto de perfil");
      return;
    }

    if (
      (role === "artist" || role === "artist_premium") &&
      !tableCommissionsPrice
    ) {
      alert("Selecciona una imagen para el precio del tablero de comisiones");
      return;
    }

    const userPayload = {
      firstName,
      username,
      email,
      password,
      authority: role.toUpperCase(),
      phoneNumber: "123456789",
      numSlotsOfWork:
        role === "artist" || role === "artist_premium"
          ? numSlotsOfWork
          : undefined,
    };

    const formData = new FormData();
    formData.append("user", JSON.stringify(userPayload));

    // Foto de perfil
    // const profileUriParts = selectedImage.split("/");
    // const profileFileName = profileUriParts[profileUriParts.length - 1];
    // const profileFileExtension = profileFileName?.split(".").pop() || "jpg";
    // const profileMimeType = `image/${profileFileExtension}`;

    // formData.append("imageProfile", {
    //   uri: selectedImage,
    //   name: profileFileName,
    //   type: profileMimeType,
    // } as any);

    formData.append("imageProfile", base64ToFile(selectedImage, "image.png"));

    // Imagen del precio del tablero de comisiones
    if (role === "artist" || role === "artist_premium") {
      formData.append(
        "tableCommissionsPrice",
        base64ToFile(tableCommissionsPrice, "image.png")
      );
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error en el registro:", result);
        Alert.alert("Error", result.message || "Registro fallido");
        return;
      }

      Alert.alert("Registro exitoso", "Usuario registrado correctamente");
      router.push(`/login`);
    } catch (error) {
      console.error("Error en la petición:", error);
      Alert.alert("Error", String(error));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setImageProfile(uri);
    }
  };

  const pickTableCommissionsPrice = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setTableCommissionsPrice(uri); // Actualiza el estado con el URI de la imagen seleccionada
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: "👤 Registro de usuario" });
  }, [navigation]);

  return (
    <ScrollView style={styles.screenBackground}>
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.pageTitle}>
        Nuevo {role === "client" ? "Cliente" : "Artista"}
      </Text>

      <View style={styles.cardContainer}>
        <View style={styles.formRow}>
          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Roberto"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          {/* Apellidos */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellidos</Text>
            <TextInput style={styles.input} placeholder="Ej. Pérez López" />
          </View>
        </View>

        <View style={styles.formRow}>
          {/* Correo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          {/* Nombre de usuario */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="UsuarioEjemplo"
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>

        <View style={styles.formRow}>
          {/* Nueva contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {/* Confirmar contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirma contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.formRow}>
          {/* Foto de perfil */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Foto de perfil</Text>
            <TouchableOpacity
              onPress={pickImage}
              style={[
                styles.input,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text style={{ color: "#888" }}>
                {selectedImage ? "Imagen seleccionada" : "Seleccionar imagen"}
              </Text>
            </TouchableOpacity>

            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setSelectedImage("")}
                >
                  <Text style={styles.removeButtonText}>Quitar imagen</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {role === "artist" || role === "artist_premium" ? (
          <>
            <View style={styles.formRow}>
              {/* Slots de trabajo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Slots de trabajo (1-8)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Número entre 1 y 8"
                  value={numSlotsOfWork}
                  onChangeText={setNumSlotsOfWork}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              {/* Precio del tablero de comisiones */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Precio del tablero de comisiones
                </Text>
                <TouchableOpacity
                  onPress={pickTableCommissionsPrice}
                  style={[
                    styles.input,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text style={{ color: "#888" }}>
                    {tableCommissionsPrice
                      ? "Imagen seleccionada"
                      : "Seleccionar imagen"}
                  </Text>
                </TouchableOpacity>

                {tableCommissionsPrice && (
                  <>
                    <Image
                      source={{ uri: tableCommissionsPrice }}
                      style={styles.previewImage}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => setTableCommissionsPrice("")}
                    >
                      <Text style={styles.removeButtonText}>Quitar imagen</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.roleContainer}>
          <Text style={styles.label}>Rol actual: {role}</Text>
          <View style={styles.roleButtonsRow}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "client" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("client")}
            >
              <Text style={styles.roleButtonText}>CLIENT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "artist" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("artist")}
            >
              <Text style={styles.roleButtonText}>ARTIST</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "artist_premium" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("artist_premium")}
            >
              <Text style={styles.roleButtonText}>ARTIST PREMIUM</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View
              style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
            />
            <Text style={styles.checkboxLabel}>
              Acepto los{" "}
              <Text
                style={styles.link}
                onPress={() => {
                  // Abrir la URL de los términos y condiciones
                  Linking.openURL(
                    "https://holos-doc.vercel.app/docs/Documentacion/S2/Terminos%20y%20Condiciones"
                  );
                }}
              >
                Términos y Condiciones
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
          <Text style={styles.createButtonText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={styles.link}
        onPress={() => {
          router.push("/login");
        }}
      >
        ¿Ya tienes cuenta? ¡Inicia sesión!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenBackground: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: "5%",
    paddingBottom: "5%",
    gap: 10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    // marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: colors.contentStrong,
    alignSelf: "center",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 4,
    color: colors.contentStrong,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    color: colors.brandPrimary,
    fontSize: 12,
    marginTop: 4,
  },
  roleContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  roleButtonsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  roleButton: {
    backgroundColor: `${colors.brandSecondary}80`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  roleButtonActive: {
    backgroundColor: colors.brandSecondary,
  },
  roleButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: colors.brandSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: colors.brandPrimary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.contentStrong,
  },
  link: {
    color: colors.brandPrimary,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
    alignSelf: "center",
  },

  removeButton: {
    marginTop: 8,
    alignSelf: "center",
    backgroundColor: `${colors.brandPrimary}20`, // Color suave con transparencia
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  removeButtonText: {
    color: colors.brandPrimary,
    fontWeight: "600",
  },
});
