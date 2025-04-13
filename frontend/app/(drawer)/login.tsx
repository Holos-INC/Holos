import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import * as yup from "yup";
import { Formik } from "formik";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { showMessage } from "react-native-flash-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "@/src/constants/colors";

// IMPORTA la pantalla de carga que ya creaste
// (Asegúrate de ajustar la ruta según tu estructura de archivos)
import LoadingScreen from "@/src/components/LoginLoadingScreen";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useContext(AuthenticationContext);
  const { reportId } = useLocalSearchParams();

  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // << Controlará la pantalla de carga

  const loginValidationSchema = yup.object().shape({
    username: yup.string().required("Nombre de usuario obligatorio"),
    password: yup
      .string()
      .required("Contraseña obligatoria")
      .test(
        "not-empty",
        "El nombre de usuario no puede estar vacío o ser solo espacios",
        (value) => typeof value === "string" && value.trim().length > 0
      )
      .min(
        3,
        ({ min }) => `El nombre de usuario debe ser de mínimo ${min} caracteres`
      )
      .required("Nombre de usuario obligatorio"),
  });

  const handleLogin = (data: { username: string; password: string }) => {
    setBackendErrors([]);
    setIsLoading(true); // << Activamos la pantalla de carga

    signIn(
      data,
      (loginUser: any) => {
        setIsLoading(false); // << Si hay éxito, cerramos la pantalla de carga
        showMessage({
          message: `Welcome back ${loginUser.username}`,
          type: "success",
        });

        if (!reportId) {
          router.replace("/");
        } else {
          router.push({
            pathname: "/report/[reportId]",
            params: { reportId: String(reportId) },
          });
        }
      },
      (errors: any) => {
        setIsLoading(false); // << Si hay error, cerramos la pantalla de carga
        const errorMessage =
          errors.response?.data ||
          "Credenciales incorrectas, intenta de nuevo.";

        setBackendErrors([errorMessage]);
        showMessage({
          message: "Error al iniciar sesión",
          description: errorMessage,
          type: "danger",
        });
      }
    );
  };

  // Si está cargando, mostramos la pantalla de carga
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Caso contrario, mostramos el formulario de login
  return (
    <Formik
      validationSchema={loginValidationSchema}
      initialValues={{ username: "", password: "" }}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <TextInput
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            placeholder="Nombre de usuario"
            style={styles.input}
            autoCapitalize="none"
          />
          {errors.username && touched.username && (
            <Text style={styles.errorInput}>{errors.username}</Text>
          )}

          <View>
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="Contraseña"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && touched.password && (
            <Text style={styles.errorInput}>{errors.password}</Text>
          )}

          {backendErrors.length > 0 && (
            <Text style={styles.backendError}>
              {backendErrors[backendErrors.length - 1]}
            </Text>
          )}

          <Button
            onPress={() => handleSubmit()}
            disabled={!isValid}
            style={styles.loginButton}
            labelStyle={styles.loginLabel}
          >
            Entrar
          </Button>

          <Text
            style={styles.link}
            onPress={() => {
              router.push("/signup");
            }}
          >
            ¿Aún no tienes cuenta? ¡Regístrate!
          </Text>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: "25%",
    backgroundColor: colors.surfaceMuted,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: colors.contentStrong,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.contentStrong,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderRadius: 10,
    color: colors.contentStrong,
  },
  errorInput: {
    color: colors.brandPrimary,
    marginBottom: 15,
  },
  backendError: {
    color: colors.brandPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 12,
    paddingHorizontal: 8,
  },
  eyeText: {
    color: colors.brandPrimary,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#F05A7E",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    color: "#FFF",
  },
  loginLabel: {
    fontSize: 16,
    color: "#fff",
  },
  link: {
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 10,
    color: colors.brandPrimary,
    textDecorationLine: "underline",
  },
});
