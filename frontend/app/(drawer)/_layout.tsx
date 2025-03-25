import { Drawer } from "expo-router/drawer";
import ProfileIcon from "@/assets/svgs/ProfileIcon";
import SearchIcon from "@/assets/svgs/SearchIcon";
import KanbanIcon from "@/assets/svgs/KanbanIconProps";
import RequestIcon from "@/assets/svgs/RequestIcon";
import { useAuth } from "@/src/hooks/useAuth";
import { Suspense } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";
import SettingsIcon from "@/assets/svgs/SettingIcon";

export default function DrawerLayout() {
  const { isAuthenticated, isAdmin, isArtist } = useAuth();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Drawer key={isArtist ? "artist" : "client"} initialRouteName="index" screenOptions={{ headerShown: true, drawerItemStyle: { display: 'none', height: 0 } }}>
        <Drawer.Screen name="index" options={{ drawerLabel: "Inicio", title: "🏠 Inicio", drawerIcon:() => <Text style={{ fontSize: 22 }}>🏠</Text>, drawerItemStyle: { display: 'flex', height: 'auto' } }} />
        <Drawer.Screen name="profile/index" options={{ drawerLabel: "Mi perfil", drawerIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>, drawerItemStyle: { display: isAuthenticated? 'flex':'none', height: 'auto' } }} />
        <Drawer.Screen name="login" options={{ drawerLabel: "Inicio de sesión", drawerIcon: ProfileIcon, drawerItemStyle: { display: isAuthenticated?'none':'flex', height: 'auto' } }} />
        <Drawer.Screen name="explore/index" options={{ drawerLabel: "Explorar", drawerIcon: SearchIcon, drawerItemStyle: { display: 'flex', height: 'auto' } }} />
        <Drawer.Screen name="commission/kanban" options={{ drawerLabel: "Panel de comisiones",title: "🎨 Mis encargos", drawerIcon: KanbanIcon, drawerItemStyle: { display: isArtist ? 'flex' : 'none', height: isArtist ? 'auto' : 0 } }} />
        <Drawer.Screen name="commission/index" options={{ drawerLabel: "Pedidos", drawerIcon: RequestIcon, drawerItemStyle: { display: isArtist ? 'flex' : 'none', height: isArtist ? 'auto' : 0 } }} />
        <Drawer.Screen name="admin/index" options={{ drawerLabel: "Panel Admin", drawerIcon: SettingsIcon, drawerItemStyle: { display: isAdmin ? 'flex' : 'none', height: isAdmin ? 'auto' : 0 } }} />
        <Drawer.Screen name="logout" options={{ drawerLabel: "Cerrar sesión", drawerIcon: ProfileIcon, drawerItemStyle: { display: isAuthenticated ? 'flex' : 'none', height: isAuthenticated ? 'auto' : 0 } }} />
      </Drawer>
    </Suspense>
  );
}
