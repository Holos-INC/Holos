import { useContext } from 'react';
import { AuthenticationContext } from '@/src/contexts/AuthContext';

export const useAuth = () => {
  const { loggedInUser, isAuthenticated } = useContext(AuthenticationContext);
  const isArtist = loggedInUser?.roles.includes('ARTIST') ?? false;
  const isAdmin = loggedInUser?.roles.includes('ADMIN') ?? false;

  return { loggedInUser, isAuthenticated, isArtist, isAdmin };
};
