import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@/src/constants/api";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import colors from "@/src/constants/colors";
import { base64ToFile } from "@/src/components/convertionToBase64Image";
import TERMS_TEXT from "@/src/constants/terms";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [imageProfile, setImageProfile] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [role, setRole] = useState("client");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const navigation = useNavigation();

  const [numSlotsOfWork, setNumSlotsOfWork] = useState("");
  const [tableCommisionsPrice, settableCommisionsPrice] = useState("");

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setAcceptTerms(false);
      setReachedBottom(false);
      setTermsModalVisible(false);
      return () => {};
    }, [])
  );

  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (contentHeight && scrollViewHeight && contentHeight <= scrollViewHeight) {
      setReachedBottom(true);
    }
  }, [contentHeight, scrollViewHeight]);

  const handleSignup = async () => {
    if (!acceptTerms) {
      Alert.alert("Debes aceptar los Términos y Condiciones");
      return;
    }
    if (passwordError) {
      Alert.alert("Las contraseñas no coinciden");
      return;
    }
    if (!password || !confirmPassword) {
      Alert.alert("Debes ingresar y confirmar la contraseña");
      return;
    }
    if (!selectedImage) {
      Alert.alert("Selecciona una foto de perfil");
      return;
    }
    if (
      (role === "artist" || role === "artist_premium") &&
      !tableCommisionsPrice
    ) {
      Alert.alert("Selecciona una imagen del tablero de comisiones");
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
        role === "artist" || role === "artist_premium" ? numSlotsOfWork : undefined,
    };

    const formData = new FormData();
    formData.append("user", JSON.stringify(userPayload));
    formData.append("imageProfile", base64ToFile(selectedImage, "image.png"));

    if (role === "artist" || role === "artist_premium") {
      formData.append(
        "tableCommisionsPrice",
        base64ToFile(tableCommisionsPrice, "image.png")
      );
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        Alert.alert("Error", result.message || "Registro fallido");
        return;
      }

      Alert.alert("Registro exitoso", "Usuario registrado correctamente");
      router.push("/login");
    } catch (error) {
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

  const picktableCommisionsPrice = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      settableCommisionsPrice(uri);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: "👤 Registro de usuario" });
  }, [navigation]);


  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom) setReachedBottom(true);
  };

  const handleContentSizeChange = (_: number, h: number) => {
    setContentHeight(h);
  };

  const handleLayout = (e: any) => {
    setScrollViewHeight(e.nativeEvent.layout.height);
  };

  const renderTerms = () =>
    TERMS_TEXT.split("\n").map((line, idx) => {
      if (line.startsWith("### "))
        return (
          <Text key={idx} style={styles.heading3}>
            {line.replace("### ", "")}
          </Text>
        );
      if (line.startsWith("## "))
        return (
          <Text key={idx} style={styles.heading2}>
            {line.replace("## ", "")}
          </Text>
        );
      if (line.startsWith("# "))
        return (
          <Text key={idx} style={styles.heading1}>
            {line.replace("# ", "")}
          </Text>
        );
      return (
        <Text key={idx} style={styles.modalText}>
          {line}
        </Text>
      );
    });

  return (
    <>
      <ScrollView style={styles.screenBackground}>
        <Image source={require("@/assets/images/logo.png")} style={styles.logo} />

        <Text style={styles.pageTitle}>
          Nuevo {role === "client" ? "Cliente" : "Artista"}
        </Text>

        {/* ---------------- Tarjeta principal ---------------- */}
        <View style={styles.cardContainer}>
          {/* Nombre / Apellidos */}
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Roberto"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellidos</Text>
              <TextInput style={styles.input} placeholder="Ej. Pérez López" />
            </View>
          </View>

          {/* Correo / Usuario */}
          <View style={styles.formRow}>
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

          {/* Contraseñas */}
          <View style={styles.formRow}>
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirma contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
            </View>
          </View>

          {/* Foto de perfil */}
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto de perfil</Text>
              <TouchableOpacity
                onPress={pickImage}
                style={[styles.input, { justifyContent: "center", alignItems: "center" }]}
              >
                <Text style={{ color: "#888" }}>
                  {selectedImage ? "Imagen seleccionada" : "Seleccionar imagen"}
                </Text>
              </TouchableOpacity>

              {selectedImage !== "" && (
                <>
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} />
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

          {/* Campos de artista */}
          {role !== "client" && (
            <>
              <View style={styles.formRow}>
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
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Precio del tablero de comisiones</Text>
                  <TouchableOpacity
                    onPress={picktableCommisionsPrice}
                    style={[styles.input, { justifyContent: "center", alignItems: "center" }]}
                  >
                    <Text style={{ color: "#888" }}>
                      {tableCommisionsPrice
                        ? "Imagen seleccionada"
                        : "Seleccionar imagen"}
                    </Text>
                  </TouchableOpacity>

                  {tableCommisionsPrice !== "" && (
                    <>
                      <Image
                        source={{ uri: tableCommisionsPrice }}
                        style={styles.previewImage}
                      />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => settableCommisionsPrice("")}
                      >
                        <Text style={styles.removeButtonText}>Quitar imagen</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </>
          )}

          {/* Roles */}
          <View style={styles.roleContainer}>
            <Text style={styles.label}>Rol actual: {role}</Text>
            <View style={styles.roleButtonsRow}>
              {[
                ["client", "CLIENT"],
                ["artist", "ARTIST"],
                ["artist_premium", "ARTIST PREMIUM"],
              ].map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.roleButton,
                    role === value && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole(value as any)}
                >
                  <Text style={styles.roleButtonText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Términos */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => {
                setReachedBottom(false);
                setTermsModalVisible(true);
              }}
            >
              <Text style={styles.link}>
                {acceptTerms
                  ? "Términos y Condiciones aceptados ✓"
                  : "Leer y aceptar Términos y Condiciones"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón crear */}
          <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
            <Text style={styles.createButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.link} onPress={() => router.push("/login")}>
          ¿Ya tienes cuenta? ¡Inicia sesión!
        </Text>
      </ScrollView>

      {/* ---------------- Modal Términos ---------------- */}
      <Modal
        visible={termsModalVisible}
        animationType="slide"
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Términos y Condiciones</Text>
          <ScrollView
            style={styles.modalScroll}
            onLayout={handleLayout}
            onContentSizeChange={handleContentSizeChange}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollRef}
          >
            {renderTerms()}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                !reachedBottom && styles.acceptButtonDisabled,
              ]}
              disabled={!reachedBottom}
              onPress={() => {
                setAcceptTerms(true);
                setTermsModalVisible(false);
              }}
            >
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setTermsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    backgroundColor: `${colors.brandPrimary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: colors.brandPrimary,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.contentStrong,
  },
  modalScroll: {
    flex: 1,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.contentStrong,
    marginBottom: 2,
  },
  heading1: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.brandPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  heading2: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.brandPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
  heading3: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.brandPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: colors.brandSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  acceptButtonDisabled: {
    backgroundColor: `${colors.brandSecondary}60`,
  },
  acceptButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: `${colors.brandPrimary}20`,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.brandPrimary,
    fontWeight: "600",
  },
});
