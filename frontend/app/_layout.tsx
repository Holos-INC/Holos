// app/_layout.tsx
import { Stack } from "expo-router";
import AuthenticationContextProvider from "@/src/contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import { Suspense } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";


export type RootDrawerParamList = {
  Inicio: undefined;
  Explorar: undefined;
  Signup: undefined; 
  WorkDetail: { workId: number };
  Payment: { workId: number; price: number };
  ArtistDetail: { artistId: number };
  RequestCommission: { artistId: number };
  Pedidos: { artistId: number };
};

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PaperProvider>
        <AuthenticationContextProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthenticationContextProvider>
      </PaperProvider>
    </Suspense>
  );
}
