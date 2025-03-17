import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as yup from "yup";
import { Formik } from "formik";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { showMessage } from 'react-native-flash-message';
import { useRouter } from 'expo-router';

export default function LoginScreen ({ navigation }:any) {
    const router = useRouter();
    const { signIn } = useContext(AuthenticationContext)
    const [backendErrors, setBackendErrors] = useState([])

    const loginValidationSchema = yup.object().shape({
        username: yup
            .string()
            .required('Nombre de usuario obligatorio')
            .min(5, ({ min }) => `El nombre de usuario debe ser de mínimo ${min} caracteres`),
        password: yup
            .string()
            .required('Contraseña obligatoria')
            // .matches(RegExp('[A-Z]'), 'La contraseña debe incluir al menos una mayúscula')
            // .matches(RegExp('[a-z]'), 'La contraseña debe incluir al menos una minúscula')
            // .matches(RegExp('[0-9]'), 'La contraseña debe incluir al menos un número')
            // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[¡!¿?@#$%^&*()_+-])[A-Za-zñÑ\d¡!¿?@#$%^&*()_+-]+$/,
            //     'La contraseña no debe incluir otro caracter que no sea número, letra o ¡!¿?@#$%^&*()_+-')
            // .min(8, ({ min }) => `La contraseña debe tener al menos ${min} caracteres`)
    });

    const handleLogin = (data:any) => {
        setBackendErrors([])
        signIn(data,
            (loginUser:any) => {
                showMessage({
                    message: `Welcome back ${loginUser.username}`,
                    type: 'success'
                })
                router.replace('/')
            },
            (errors:any) => {
                setBackendErrors(errors)
            })
    };

    return (
        <Formik
            validationSchema={loginValidationSchema}
            initialValues={{username: '', password: ''}}
            onSubmit={handleLogin}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, }) => (
                    <View style={styles.container}>
                        <Text style={styles.title}>Iniciar Sesión</Text>
                        <TextInput
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            placeholder="Nombre de usuario"
                            style={styles.input}
                        />
                        {errors.username && touched.username &&
                            <Text style={styles.errorInput}>{errors.username}</Text>}
                        <TextInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            placeholder="Contraseña"
                            style={styles.input}
                            secureTextEntry
                        />
                        {errors.password && touched.password &&
                            <Text style={styles.errorInput}>{errors.password}</Text>}
                        <Button onPress={() => handleSubmit()} title='Entrar' disabled={!isValid}/>
                    </View>
                )}
        </Formik>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, alignSelf: 'center', maxWidth: 1600, minWidth: '60%' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  errorInput: { color: 'red', marginBottom: 15 },
});