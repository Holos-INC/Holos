import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, StyleSheet, Image
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { API_URL } from "@/src/constants/api";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../_layout';
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker'
import { Platform } from 'react-native';

type SignupScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, "Signup">;
type SignupScreenRouteProp = RouteProp<RootDrawerParamList, "Signup">;

type SignupScreenProps = {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
};

export default function SignupScreen() {
  // Estados compartidos
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para confirmar contraseña
  const [passwordError, setPasswordError] = useState('');     // Estado para mensaje de error
  const [imageProfile, setImageProfile] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [role, setRole] = useState('client');

  // Estados específicos para artistas
  const [numSlotsOfWork, setNumSlotsOfWork] = useState('');
  const [tableCommisionsPrice, setTableCommisionsPrice] = useState('');

  const router = useRouter();
  const navigation = useNavigation<SignupScreenNavigationProp>();

  // Validación en tiempo real: cuando cambie password o confirmPassword
  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);


  const handleSignup = async () => {
    if (passwordError) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert("Error", "Debes ingresar y confirmar la contraseña");
      return;
    }

    if (!selectedImage) {
      Alert.alert("Falta imagen", "Selecciona una foto de perfil");
      return;
    }

    const userPayload = {
      firstName,
      username,
      email,
      password,
      authority: role.toUpperCase(),
      phoneNumber: "123456789"
    };

    const formData = new FormData();
    formData.append("user", JSON.stringify(userPayload));

    const uriParts = selectedImage.split("/");
    const fileName = uriParts[uriParts.length - 1];
    const fileExtension = fileName?.split(".").pop() || "jpg";
    const mimeType = `image/${fileExtension}`;

    if (Platform.OS === "web") {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: mimeType });
      formData.append("imageProfile", file);
    } else {
      formData.append("imageProfile", {
        uri: selectedImage,
        name: fileName,
        type: mimeType,
      } as any);
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error en el registro:", result);
        Alert.alert("Error", result.message || "Registro fallido");
        return;
      }

      Alert.alert("Registro exitoso", "Usuario registrado correctamente");
      router.push(`/(drawer)/explore`);
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


  return (
    <ScrollView style={styles.screenBackground}>
      <Image
        source={require('../(drawer)/logo/logo.png')} // Ajusta la ruta según tu estructura
        style={styles.logo}
      />

      <Text style={styles.pageTitle}>Nuevo {role}</Text>

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
            <TextInput
              style={styles.input}
              placeholder="Ej. Pérez López"
            />
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
              style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}
            >
              <Text style={{ color: '#888' }}>
                {selectedImage ? "Imagen seleccionada" : "Seleccionar imagen"}
              </Text>
            </TouchableOpacity>

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
              />
            )}
          </View>

        </View>

        {role === 'artist' && (
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
              {/* Precio del tablero */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Precio del tablero de comisiones</Text>
                <TextInput
                  style={styles.input}
                  value={tableCommisionsPrice}
                  onChangeText={setTableCommisionsPrice}
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.roleContainer}>
          <Text style={styles.label}>Rol actual: {role}</Text>
          <View style={styles.roleButtonsRow}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'client' && styles.roleButtonActive
              ]}
              onPress={() => setRole('client')}
            >
              <Text style={styles.roleButtonText}>CLIENT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'artist' && styles.roleButtonActive
              ]}
              onPress={() => setRole('artist')}
            >
              <Text style={styles.roleButtonText}>ARTIST</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
          <Text style={styles.createButtonText}>Crear cuenta</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenBackground: {
    flex: 1,
    backgroundColor: '#FAE8F0',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#403568',
    alignSelf: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#C68FA2',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
    color: '#403568',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9C2CF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  roleContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  roleButton: {
    backgroundColor: '#E9C2CF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  roleButtonActive: {
    backgroundColor: '#C68FA2',
  },
  roleButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#C68FA2',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
