import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BrandLogo from '../../components/BrandLogo';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BrandLogo size={110} />
      <Text style={styles.title}>keep</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  title: { ...typography.h1, color: colors.white, marginTop: spacing.md },
});
