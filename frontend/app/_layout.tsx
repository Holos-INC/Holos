import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AuthenticationContextProvider from './context/AuthContext';

const Drawer = createDrawerNavigator()

export default function RootLayout() {
  return (
    <AuthenticationContextProvider>
      <Drawer.Navigator 
        initialRouteName="home"
        screenOptions={{
          headerShown: true, // para poder incluir el botón burger en la cabecera
        }}
      >
        <Drawer.Screen name="home" component={HomeScreen} options={{title: 'Inicio'}}/>
        <Drawer.Screen name="sign-in" component={LoginScreen} options={{title: 'Iniciar sesión'}}/>
      </Drawer.Navigator>
    </AuthenticationContextProvider>
);
}
