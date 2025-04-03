import { Drawer } from "expo-router/drawer";
import ProfileIcon from "@/assets/svgs/ProfileIcon";
import { useAuth } from "@/src/hooks/useAuth";
import { Suspense } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";
import { Text } from "react-native";
import SettingsIcon from "@/assets/svgs/SettingIcon";

export default function DrawerLayout() {
  const { isAuthenticated,isAdmin, isArtist, isClient, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      {loading ? ( <LoadingScreen />) : (<Drawer key={isArtist ? "artist" : "client"} initialRouteName="index" screenOptions={{ headerShown: true, drawerItemStyle: { display: 'none', height: 0 } }}>
        <Drawer.Screen name="index" options={{ drawerLabel: "Inicio", title: "🏠 Inicio", drawerIcon:() => <Text style={{ fontSize: 22 }}>🏠</Text>, drawerItemStyle: { display: 'flex', height: 'auto' } }} />
        <Drawer.Screen name="profile/index" options={{ drawerLabel: "Mi perfil", drawerIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>, drawerItemStyle: { display: !isAdmin && isAuthenticated ? 'flex':'none', height: 'auto' } }} />
        <Drawer.Screen name="login" options={{ drawerLabel: "Inicio de sesión", drawerIcon: ProfileIcon, drawerItemStyle: { display: isAuthenticated?'none':'flex', height: 'auto' } }} />
        <Drawer.Screen name="search/index" options={{ drawerLabel: "Buscar", title: "🔍 Buscar", drawerIcon: () => <Text style={{ fontSize: 22 }}>🔍</Text>, drawerItemStyle: { display: 'flex', height: 'auto' } }} />
        <Drawer.Screen name="signup" options={{ drawerLabel: "Registrar", drawerIcon: ProfileIcon, drawerItemStyle: { display: isAuthenticated?'none':'flex', height: 'auto' } }} />
        <Drawer.Screen name="explore/index" options={{ drawerLabel: "Explorar", title:"🔍 Explorar", drawerIcon: () => <Text style={{ fontSize: 22 }}>🔍</Text>, drawerItemStyle: { display: 'flex', height: 'auto' } }} />
        <Drawer.Screen name="admin/index" options={{ drawerLabel: "Panel Admin", drawerIcon: SettingsIcon, drawerItemStyle: { display: isAdmin ? 'flex' : 'none', height: isAdmin ? 'auto' : 0 } }} />
        <Drawer.Screen name="kanban" options={{ drawerLabel: "Panel de comisiones",title: "🎨 Mis encargos", drawerIcon: () => <Text style={{ fontSize: 22 }}>🎨</Text>, drawerItemStyle: { display: isArtist ? 'flex' : 'none', height: isArtist ? 'auto' : 0 } }} />
        <Drawer.Screen name="commissions/index" options={{ drawerLabel: "Pedidos", title:"📦 Mis pedidos", drawerIcon: () => <Text style={{ fontSize: 22 }}>📦</Text>, drawerItemStyle: { display: isArtist || isClient ? 'flex' : 'none', height: isArtist || isClient ? 'auto' : 0 } }} />
        <Drawer.Screen name="logout" options={{ drawerLabel: "Cerrar sesión", title:"🚪 Cerrar sesión", drawerIcon: () => <Text style={{ fontSize: 22 }}>🚪</Text>, drawerItemStyle: { display: isAuthenticated ? 'flex' : 'none', height: isAuthenticated ? 'auto' : 0 } }} />
        </Drawer>
      )}
    </Suspense>
  );
}
