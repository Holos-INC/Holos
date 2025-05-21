import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "@/src/constants/api";
import { base64ToFile } from "@/src/components/convertionToBase64Image";
import colors from "@/src/constants/colors";
import TERMS_TEXT from "@/src/constants/terms";

export default function SignupForm({ onSignupSuccess }: { onSignupSuccess: () => void }) {
  const scrollRef = useRef<ScrollView>(null);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const SignupSchema = yup.object().shape({
    firstName: yup.string().min(2, "Mínimo 2 caracteres").required("Nombre requerido"),
    username: yup
      .string()
      .min(3, "Mínimo 3 caracteres")
      .matches(/^\S+$/, "No se permiten espacios")
      .required("Usuario requerido"),
    email: yup.string().email("Correo no válido").required("Correo requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
      .required("Confirmación requerida"),
    acceptTerms: yup.bool().oneOf([true], "Debes aceptar los términos"),
    selectedImage: yup
      .string()
      .required("La imagen de perfil es obligatoria"),
    role: yup.string().required("Rol requerido"),
    tableCommisionsPrice: yup.string().when("role", (role, schema) => {
      const roleValue = Array.isArray(role) ? role[0] : role;
      return roleValue !== "client"
        ? schema.required("Imagen del tablero requerida")
        : schema.notRequired();
    }),

  });

  const pickImage = async (setFieldValue: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setFieldValue("selectedImage", result.assets[0].uri);
    }
  };

  const pickCommisionsImage = async (setFieldValue: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setFieldValue("tableCommisionsPrice", result.assets[0].uri);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) setReachedBottom(true);
  };
  const handleContentSizeChange = (_: number, h: number) => setContentHeight(h);
  const handleLayout = (e: any) => setScrollViewHeight(e.nativeEvent.layout.height);

  const renderTerms = () => TERMS_TEXT.split("\n").map((line, idx) => {
    if (line.startsWith("### ")) return <Text key={idx} style={styles.heading3}>{line.replace("### ", "")}</Text>;
    if (line.startsWith("## ")) return <Text key={idx} style={styles.heading2}>{line.replace("## ", "")}</Text>;
    if (line.startsWith("# ")) return <Text key={idx} style={styles.heading1}>{line.replace("# ", "")}</Text>;
    return <Text key={idx} style={styles.modalText}>{line}</Text>;
  });

  return (
    <Formik
      validationSchema={SignupSchema}
      initialValues={{
        firstName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        selectedImage: "",
        role: "client",
        tableCommisionsPrice: "",
      }}
      onSubmit={async (values, { setErrors }) => {
        if (!values.selectedImage) {
          setErrors({ selectedImage: "Imagen de perfil requerida" });
          return;
        }
        if ((values.role === "artist" || values.role === "artist_premium") && !values.tableCommisionsPrice) {
          setErrors({ tableCommisionsPrice: "Imagen del tablero requerida" });
          return;
        }

        const userPayload = {
          firstName: values.firstName,
          username: values.username,
          email: values.email,
          password: values.password,
          authority: values.role.toUpperCase(),
          phoneNumber: "123456789",
        };

        const formData = new FormData();
        formData.append("user", JSON.stringify(userPayload));
        formData.append("imageProfile", base64ToFile(values.selectedImage, "image.png"));

        if (values.role === "artist" || values.role === "artist_premium") {
          formData.append("tableCommisionsPrice", base64ToFile(values.tableCommisionsPrice, "image.png"));
        }

        try {
          const response = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          if (!response.ok) {
            if (result.message.includes("Username")) setErrors({ username: result.message });
            else if (result.message.includes("Email")) setErrors({ email: result.message });
            else Alert.alert("Error", result.message || "Registro fallido");
            return;
          }
          Alert.alert("Cuenta creada", "Tu cuenta se ha creado correctamente. Inicia sesión.");
          onSignupSuccess();
        } catch (error) {
          Alert.alert("Error", String(error));
        }
      }}
    >
      {({ handleChange, handleSubmit, values, setFieldValue, errors, touched, setFieldTouched }) => (
        <>
          <ScrollView style={styles.screenBackground}>
            <Text style={styles.pageTitle}>Nuevo {values.role === "client" ? "Cliente" : "Artista"}</Text>
            <View style={styles.cardContainer}>
              {/* Nombre */}
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Roberto"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
              />
              {errors.firstName && touched.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

              {/* Usuario */}
              <Text style={styles.label}>Nombre de usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="UsuarioEjemplo"
                value={values.username}
                onChangeText={handleChange("username")}
              />
              {errors.username && touched.username && <Text style={styles.errorText}>{errors.username}</Text>}

              {/* Correo */}
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
              />
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Contraseñas */}
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
              />
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              {/* Imagen de perfil */}
              <Text style={styles.label}>Selecciona una foto de perfil</Text>
              <TouchableOpacity
                style={[styles.input, { alignItems: "center", justifyContent: "center" }]}
                onPress={() => pickImage(setFieldValue)}
              >
                <Text style={{ color: "#888" }}>
                  {values.selectedImage ? "Imagen seleccionada" : "Seleccionar imagen de perfil"}
                </Text>
              </TouchableOpacity>
              {errors.selectedImage && <Text style={styles.errorText}>{errors.selectedImage}</Text>}

              {values.selectedImage !== "" && (
                <Image source={{ uri: values.selectedImage }} style={styles.previewImage} />
              )}

              {/* Rol */}
              <Text style={styles.label}>Rol</Text>
              <View style={styles.roleButtonsRow}>
                {["client", "artist"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setFieldValue("role", option)}
                    style={[styles.roleButton, values.role === option && styles.roleButtonActive]}
                  >
                    <Text style={styles.roleButtonText}>{option.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tabla de comisiones */}
              {values.role !== "client" && (
                <>
                  <Text style={styles.label}>Selecciona una tabla de precios</Text>
                  <TouchableOpacity
                    style={[styles.input, { alignItems: "center", justifyContent: "center" }]}
                    onPress={() => pickCommisionsImage(setFieldValue)}
                  >
                    <Text style={{ color: "#888" }}>
                      {values.tableCommisionsPrice ? "Imagen seleccionada" : "Seleccionar imagen del tablero"}
                    </Text>
                  </TouchableOpacity>
                  {errors.tableCommisionsPrice && <Text style={styles.errorText}>{errors.tableCommisionsPrice}</Text>}
                </>
              )}

              {/* Términos */}
              <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                <Text style={styles.link}>
                  {values.acceptTerms
                    ? "Términos y Condiciones aceptados ✓"
                    : "Leer y aceptar Términos y Condiciones"}
                </Text>
              </TouchableOpacity>
              {errors.acceptTerms && <Text style={styles.errorText}>{errors.acceptTerms}</Text>}

              {/* Crear cuenta */}
              <TouchableOpacity style={styles.createButton} onPress={() => handleSubmit()}>
                <Text style={styles.createButtonText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Modal visible={termsModalVisible} animationType="slide" onRequestClose={() => setTermsModalVisible(false)}>
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
                  style={[styles.acceptButton, !reachedBottom && styles.acceptButtonDisabled]}
                  disabled={!reachedBottom}
                  onPress={() => {
                    setFieldValue("acceptTerms", true);
                    setTermsModalVisible(false);
                  }}
                >
                  <Text style={styles.acceptButtonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setTermsModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  screenBackground: {
    flex: 1,
    backgroundColor: colors.surfaceBase,
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
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 20,
    color: colors.brandSecondary,
    alignSelf: "center",
  },
  cardContainer: {
    backgroundColor: colors.surfaceMuted,
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
    fontSize: 18,
    lineHeight: 22,
    color: colors.contentStrong,
    marginBottom: 2,
  },
  heading1: {
    fontSize: 42,
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
    fontSize: 19,
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
