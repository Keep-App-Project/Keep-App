import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = '@keep:user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        if (__DEV__) {
          console.warn('Falha ao carregar usuário salvo:', e);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistUser = useCallback(async (nextUser) => {
    setUser(nextUser);
    if (nextUser && nextUser.isGuest) {
      return; // sessão de visitante nunca vai pro AsyncStorage
    }
    if (nextUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      setError(null);
      try {
        const { user: loggedUser } = await authService.login(email, password);
        await persistUser(loggedUser);
        return loggedUser;
      } catch (e) {
        setError(e.message);
        throw e;
      }
    },
    [persistUser]
  );

  const signUp = useCallback(
    async (payload) => {
      setError(null);
      try {
        const { user: newUser } = await authService.signUp(payload);
        await persistUser(newUser);
        return newUser;
      } catch (e) {
        setError(e.message);
        throw e;
      }
    },
    [persistUser]
  );

  const logout = useCallback(async () => {
    // Modo visitante não passa pelo authService (nunca fez login de verdade).
    if (!user?.isGuest) {
      await authService.logout();
    }
    await persistUser(null);
  }, [persistUser, user]);

  const requestPasswordReset = useCallback(async (email) => authService.requestPasswordReset(email), []);

  const continueAsGuest = useCallback(() => {
    // Sessão de visitante: fica só em memória, não grava no AsyncStorage.
    // Ao reabrir o app, o visitante volta pra tela de boas-vindas.
    setError(null);
    setUser({
      id: 'guest',
      firstName: 'Visitante',
      lastName: '',
      email: null,
      phone: null,
      plan: 'guest',
      isGuest: true,
      notificationsEnabled: false,
      createdAt: null,
    });
  }, []);

  const updateUser = useCallback(
    async (patch) => {
      const nextUser = { ...user, ...patch };
      await persistUser(nextUser);
    },
    [user, persistUser]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isGuest: !!user?.isGuest,
      isLoading,
      error,
      login,
      signUp,
      logout,
      requestPasswordReset,
      updateUser,
      continueAsGuest,
    }),
    [user, isLoading, error, login, signUp, logout, requestPasswordReset, updateUser, continueAsGuest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

export default AuthContext;
