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
import LoadingScreen from "@/src/components/LoginLoadingScreen";

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useContext(AuthenticationContext);
  const { reportId } = useLocalSearchParams();

  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      ),
  });

  const handleLogin = (data: { username: string; password: string }) => {
    setBackendErrors([]);
    setIsLoading(true);

    signIn(
      data,
      (loginUser: any) => {
        setIsLoading(false);
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
        setIsLoading(false);
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

  if (isLoading) {
    return <LoadingScreen />;
  }

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
        <View style={styles.cardContainer}>
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
    backgroundColor: colors.surfaceBase,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    color: colors.brandSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    backgroundColor: "white",
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
  }
});
