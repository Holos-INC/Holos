import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen/HomeScreen";
import UserProfileScreen from "./src/screens/UserProfile/UserProfileScreen";
import OrderHistoryScreen from "./src/screens/UserProfile/OrderHistoryScreen";
import ArtworksScreen from "./src/screens/UserProfile/ArtworksScreen";
import ProfileIcon from "@/assets/svgs/ProfileIcon";
import React from "react";
import ArtistRequestOrders from "./src/screens/ArtistRequestOrders/ArtistRequestOrders";
import RequestCommissionUserScreen from "./src/screens/RequestCommission/RequestCommissionUserScreen";
// import LoginScreen from "./src/screens/LoginScreen";
import ExploreScreen from "./src/screens/ExploreScreen/ExploreScreen";
import ArtistDetailScreen from "./src/screens/ArtistDetailScreen/ArtistDetailScreen";
import WorkDetailScreen from "./src/screens/WorkDetailScreen/WorkDetailScreen"; 
import SearchIcon from "@/assets/svgs/SearchIcon";
import PaymentScreen from "./src/screens/PaymentScreen/PaymentScreen";
import KanbanIcon from "@/assets/svgs/KanbanIconProps";
import RequestIcon from "@/assets/svgs/RequestIcon";
import KanbanScreen from "./src/screens/KanbanScreen/KanbanScreen";
import LoginScreen from "./src/screens/Authentication/LoginScreen";
import AuthenticationContextProvider from "./context/AuthContext";
import Kanban from "./src/screens/KanbanScreen/Kanban";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export type RootDrawerParamList = {
  Inicio: undefined;
  Explorar: undefined;
  WorkDetail: { workId: number };
  Payment: { workId: number; price: number };
  ArtistDetail: { artistId: number };
  RequestCommission: { artistId: number };
  Pedidos: { artistId: number };
  Panel_de_comisiones: { artistId: number };
};

export default function RootLayout() {
  return (
    <AuthenticationContextProvider>
      <Drawer.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Drawer.Screen name="Inicio" component={HomeScreen} />
        <Drawer.Screen
          name="sign-in"
          component={LoginScreen}
          options={{
            title: "Inicio de sesión",
            drawerIcon: ({ size }) => <ProfileIcon size={size} />,
          }}
        />
        <Drawer.Screen
          name="Perfil"
          component={UserProfileStack}
          options={{
            drawerIcon: ({ size }) => <ProfileIcon size={size} />,
          }}
        />
        <Drawer.Screen
          name="Explorar"
          component={ExploreStack}
          options={{
            drawerIcon: ({ size }) => <SearchIcon width={size} height={size} />,
          }}
        />
        <Drawer.Screen
          name="kanban"
          component={Kanban}
          options={{
            drawerIcon: ({ size }) => <KanbanIcon width={size} height={size} />,
          }}
        />
        <Drawer.Screen
          name="Pedidos"
          component={ArtistRequestOrders}
          // Inicializamos con un artistId dinámico (en este ejemplo se usa 25 para prueba)
          // En producción, obtén el id del artista logueado (por ejemplo, desde AuthContext)
          initialParams={{ artistId: 25 }}
          options={{
            drawerIcon: ({ size }) => (
              <RequestIcon width={size} height={size} />
            ),
          }}
        />
      </Drawer.Navigator>
    </AuthenticationContextProvider>
  );
}

function UserProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={UserProfileScreen} />
      <Stack.Screen name="Historial de Pedidos" component={OrderHistoryScreen} />
      <Stack.Screen name="Obras Subidas" component={ArtworksScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="All" component={ExploreScreen} />
      <Stack.Screen name="WorkDetail" component={WorkDetailScreen} />
      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
      <Stack.Screen
        name="RequestCommission"
        component={RequestCommissionUserScreen}
      />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}
