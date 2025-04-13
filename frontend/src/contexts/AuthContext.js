import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from 'react';
import { login } from "@/src/services/AuthEndpoints";
import { Platform } from 'react-native';
import api, { setAuthToken } from '../services/axiosInstance';

const AuthenticationContext = createContext();

export default function AuthenticationContextProvider(props) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signOut = async (onSuccess = null, onError = null) => {
        try {
            setLoggedInUser(null);
            setAuthToken(null);
            console.log("Auth header after signOut:", api.defaults.headers.common['Authorization']);

            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                await SecureStore.deleteItemAsync('user');
            } else {
                await AsyncStorage.removeItem('user');
                const stillStored = await SecureStore.getItemAsync('user');
                console.log("Storage after delete:", stillStored); // should be null
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            if (onError) onError();
        }
    };

    const signIn = async (data, onSuccess = null, onError = null) => {
        try {
            await signOut(); 

            const user = await login(data);
            setAuthToken(user.token);
            setLoggedInUser(user);

            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                await SecureStore.setItemAsync('user', JSON.stringify(user));
            } else {
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }

            if (onSuccess) onSuccess(user);
        } catch (error) {
            if (onError) onError(error);
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = Platform.OS === 'web'
                    ? await AsyncStorage.getItem('user')
                    : await SecureStore.getItemAsync('user');

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setLoggedInUser(parsedUser);
                    setAuthToken(parsedUser.token);
                }
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthenticationContext.Provider value={{
            loggedInUser,
            isAuthenticated: !!loggedInUser,
            loading,
            signIn,
            signOut
        }}>
            {props.children}
        </AuthenticationContext.Provider>
    );
};

export { AuthenticationContext };
