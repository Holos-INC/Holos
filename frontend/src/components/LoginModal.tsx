import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Portal, Dialog, TextInput, Button, Text } from "react-native-paper";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Formik } from "formik";
import * as yup from "yup";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import styles from "../styles/LoginModal.styles";
        

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onLoginSuccess?: () => void;
};

/* ─────── Validación ─────── */
const loginSchema = yup.object({
  username: yup.string().required("Nombre de usuario obligatorio"),
  password: yup.string().required("Contraseña obligatoria"),
});

const LoginModal: React.FC<Props> = ({ visible, onDismiss, onLoginSuccess }) => {
  const { signIn } = useContext(AuthenticationContext);
  const router = useRouter();
  const [backendError, setBackendError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /* ─────── Reanimated ─────── */
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: (e, ctx: any) => {
      translateX.value = ctx.x + e.translationX;
      translateY.value = ctx.y + e.translationY;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  /* ─────── Submit ─────── */
  const handleSubmit = (values: { username: string; password: string }) => {
    setBackendError(null);
    signIn(
      values,
      () => {
        onDismiss();
        onLoginSuccess?.();
      },
      (err: any) =>
        setBackendError(
          err.response?.data || "Credenciales incorrectas, intenta de nuevo."
        )
    );
  };

  /* ─────── Render ─────── */
  return (
    <Portal>
      {visible && (
        <View style={styles.overlay}>
          <Animated.View style={animatedStyle}>
            {/* Barra para arrastrar */}
            <PanGestureHandler onGestureEvent={gesture}>
              <Animated.View>
                <View style={styles.handle} />
              </Animated.View>
            </PanGestureHandler>

            {/* Dialog principal */}
            <Dialog visible onDismiss={onDismiss} style={styles.dialog}>
              <Dialog.Title style={styles.title}>Inicia sesión</Dialog.Title>

              <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={handleSubmit}
                validationSchema={loginSchema}
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
                  <>
                    <Dialog.Content>
                      <TextInput
                        label="Usuario"
                        mode="outlined"
                        value={values.username}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        error={!!(touched.username && errors.username)}
                        style={styles.input}
                        autoCapitalize="none"
                      />
                      {touched.username && errors.username && (
                        <Text style={styles.error}>{errors.username}</Text>
                      )}

                      <TextInput
                        label="Contraseña"
                        mode="outlined"
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        secureTextEntry={!showPassword}
                        error={!!(touched.password && errors.password)}
                        style={styles.input}
                        autoCapitalize="none"
                        right={
                          <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword((prev) => !prev)}
                          />
                        }
                      />
                      {touched.password && errors.password && (
                        <Text style={styles.error}>{errors.password}</Text>
                      )}

                      {backendError && (
                        <Text style={styles.error}>{backendError}</Text>
                      )}
                    </Dialog.Content>

                    <Dialog.Actions style={styles.actions}>
                      <Button onPress={onDismiss}>Cancelar</Button>
                      <Button
                        mode="contained"
                        disabled={!isValid}
                        onPress={() => handleSubmit()}
                      >
                        Entrar
                      </Button>
                    </Dialog.Actions>

                    <View style={styles.divider} />

                    <Button
                      mode="text"
                      onPress={() => {
                        onDismiss();
                        router.push("/signup");
                      }}
                    >
                      ¿Aún no tienes cuenta? ¡Regístrate!
                    </Button>
                  </>
                )}
              </Formik>
            </Dialog>
          </Animated.View>
        </View>
      )}
    </Portal>
  );
};

export default LoginModal;
