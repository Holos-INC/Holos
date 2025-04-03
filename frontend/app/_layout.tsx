import { Drawer } from "expo-router/drawer";
import AuthenticationContextProvider from "@/src/contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import { Suspense } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PaperProvider>
        <AuthenticationContextProvider>
          <Drawer screenOptions={{ headerShown: false }} />
        </AuthenticationContextProvider>
      </PaperProvider>
    </Suspense>
  );
}
