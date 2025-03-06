// RootLayout.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./src/screens/HomeScreen";
import ExploreScreen from "./src/screens/ExploreScreen/ExploreScreen";
import WorkDetailScreen from "./src/screens/WorkDetailScreen";

import SearchIcon from "@/assets/svgs/SearchIcon";
import PaymentScreen from "./src/screens/PaymentScreen";

const Drawer = createDrawerNavigator();

export type RootDrawerParamList = {
  Inicio: undefined;
  Explorar: undefined;
  WorkDetail: { workId: number };
  Payment: { workId: number; price: number }; 
};

export default function RootLayout() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* Pantalla visible en el Drawer */}
      <Drawer.Screen name="Inicio" component={HomeScreen} />

      {/* Pantalla visible en el Drawer */}
      <Drawer.Screen
        name="Explorar"
        component={ExploreScreen}
        options={{
          drawerIcon: ({ size }) => <SearchIcon width={size} height={size} />,
        }}
      />

      {/* Pantalla de detalle, oculta en el Drawer */}
      <Drawer.Screen
        name="WorkDetail"
        component={WorkDetailScreen}
        options={{
          // Que no aparezca en el menú
          drawerLabel: () => null,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          drawerLabel: () => null,
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
}
