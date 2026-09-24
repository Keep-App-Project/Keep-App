import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useAuth } from '../context/AuthContext';
import { PantryProvider } from '../context/PantryContext';
import colors from '../theme/colors';

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <PantryProvider>
          <MainTabs />
        </PantryProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
