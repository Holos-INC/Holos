import { Text } from "react-native";
import { Drawer } from "expo-router/drawer";
import { useAuth } from "@/src/hooks/useAuth";
import { Suspense, useEffect, useState } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";
import CustomDrawer from "@/src/components/menu/CustomDrawer";
import { getUser } from "@/src/services/userApi";
import { BaseUser } from "@/src/constants/CommissionTypes";
import ProfileIcon from "@/assets/svgs/ProfileIcon";
import { MaterialIcons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const { loggedInUser, isAuthenticated,isAdmin, isArtist, isClient, loading } = useAuth();
  const [user, setUser] = useState<BaseUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!loggedInUser?.token) {
        setUser(null);
        return;
      }
  
      try {
        const user = await getUser(loggedInUser.token);
        setUser(user?.baseUser ?? null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
  
    fetchUser()
  }, [loggedInUser?.token])

  const renderCustomDrawer = (drawerProps: any) => (
    <CustomDrawer
      {...drawerProps}
      user={user}
      isAuthenticated={isAuthenticated}
    />
  )  

  if (loading) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      {loading ? ( <LoadingScreen />): (
      <Drawer 
        drawerContent={renderCustomDrawer}
        key={isArtist ? "artist" : "client"}
        initialRouteName="index"
        screenOptions={{ drawerHideStatusBarOnOpen:true, headerShown: true, drawerItemStyle: { display: 'none', height: 0 }}}>
        <Drawer.Screen name="index" options={{ drawerLabel: "Inicio", title: "🏠 Inicio", drawerIcon:() => <Text style={{ fontSize: 22 }}>🏠</Text>, drawerItemStyle: { display: 'flex', height: 'auto' } }} />
        {/* <Drawer.Screen name="profile/indexArtist" options={{ drawerLabel: "Mi perfil", title: "Perfil", drawerIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>, drawerItemStyle: { display: isArtist ? 'flex' : 'none', height: isArtist ? 'auto' : 0 } }} />
        <Drawer.Screen name="profile/indexClient" options={{ drawerLabel: "Mi perfil", title: "Perfil", drawerIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>, drawerItemStyle:{ display: isClient ? 'flex' : 'none', height: isClient ? 'auto' : 0 }  }} /> */}
        <Drawer.Screen name="login" options={{ drawerLabel: "Inicio de sesión", drawerIcon: ProfileIcon, drawerItemStyle: { display: isAuthenticated?'none':'flex', height: 'auto' } }} />
        <Drawer.Screen name="kanban/index" options={{ drawerLabel: "Encargos",title: "🎨 Mis encargos", drawerIcon: () => <Text style={{ fontSize: 22 }}>🎨</Text>, drawerItemStyle: { display: isArtist ? 'flex' : 'none', height: isArtist ? 'auto' : 0 } }} />
        
        <Drawer.Screen name="admin/index" options={{ drawerLabel: "Panel Admin", drawerIcon: () => <Text style={{ fontSize: 22 }}>⚙️</Text>, drawerItemStyle: { display: isAdmin ? 'flex' : 'none', height: isAdmin ? 'auto' : 0 } }} />
        <Drawer.Screen name="commissions/index" options={{ drawerLabel: "Pedidos", title:"📦 Mis pedidos", drawerIcon: () => <Text style={{ fontSize: 22 }}>📦</Text>, drawerItemStyle: { display: isArtist || isClient ? 'flex' : 'none', height: isArtist || isClient ? 'auto' : 0 } }} />
        <Drawer.Screen name="work/uploadNewWorkArtist" options={{ drawerLabel: "Subir obra", title:"  Subir obra", drawerIcon: () => <Text style={{ fontSize: 22 }}>⬆️</Text>, drawerItemStyle: { display: isArtist ? 'flex' : 'none', height: isArtist ? 'auto' : 0 } }} />
        <Drawer.Screen name="contactUs" options={{ drawerLabel: "Contáctanos", title: "📨 Contáctanos", drawerIcon:() => <Text style={{ fontSize: 22 }}>📨</Text>, drawerItemStyle: { display: 'flex', height: 'auto' } }} />

      </Drawer>
      )}
    </Suspense>
  );
}
