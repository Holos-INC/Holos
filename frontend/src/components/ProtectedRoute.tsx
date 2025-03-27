import { useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

type UserRole = "ADMIN" | "ARTIST" | "CLIENT";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: Href;
}

export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/" }: ProtectedRouteProps) {
  const { isAuthenticated, isArtist, isAdmin, loading } = useAuth();
  const router = useRouter();

  const userRole: UserRole = useMemo(() => {
    return isAdmin ? "ADMIN" : isArtist ? "ARTIST" : "CLIENT";
  }, [isAdmin, isArtist]);

  const notAllowed = !isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(userRole));

  useEffect(() => {
    if (!loading && notAllowed) {
      router.replace(redirectTo);
    }
  }, [loading, notAllowed]);

  if (loading || notAllowed) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
