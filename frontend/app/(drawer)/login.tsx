import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import { AuthenticationContext } from '@/src/contexts/AuthContext';
import { showMessage } from 'react-native-flash-message';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useContext(AuthenticationContext);
  const { reportId } = useLocalSearchParams();

  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const loginValidationSchema = yup.object().shape({
    username: yup
      .string()
      .required('Nombre de usuario obligatorio')
      .min(5, ({ min }) => `El nombre de usuario debe ser de mínimo ${min} caracteres`),
    password: yup
      .string()
      .required('Contraseña obligatoria'),
  });

  const handleLogin = (data: { username: string; password: string }) => {
    setBackendErrors([]);

    signIn(
      data,
      (loginUser: any) => {
        showMessage({
          message: `Welcome back ${loginUser.username}`,
          type: 'success',
        });

        if (!reportId) {
          router.replace('/');
        } else {
          router.push({
            pathname: '/report/[reportId]',
            params: { reportId: String(reportId) },
          });
        }
      },
      (errors: any) => {
        const errorMessage =
          errors.response?.data || 'Credenciales incorrectas, intenta de nuevo.';

        setBackendErrors([errorMessage]);

        showMessage({
          message: 'Error al iniciar sesión',
          description: errorMessage,
          type: 'danger',
        });
      }
    );
  };

  return (
    <Formik
      validationSchema={loginValidationSchema}
      initialValues={{ username: '', password: '' }}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <TextInput
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
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
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="Contraseña"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
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

          <Button onPress={() => handleSubmit()} title="Entrar" disabled={!isValid} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    maxWidth: 1600,
    minWidth: '60%',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  errorInput: {
    color: 'red',
    marginBottom: 15,
  },
  backendError: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 12,
    paddingHorizontal: 8,
  },
  eyeText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
