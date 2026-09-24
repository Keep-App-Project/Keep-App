import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandLogo from '../../components/BrandLogo';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { continueAsGuest } = useAuth();

  return (
    <View style={styles.container}>
      <View style={[styles.top, { paddingTop: insets.top + spacing.xxl }]}>
        <BrandLogo size={64} />
        <Text style={styles.title}>keep</Text>
        <Text style={styles.tagline}>keep it safe</Text>
      </View>

      <View style={[styles.card, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.welcomeText}>Bem-vindo(a) ao keep</Text>

        <Button title="Entrar" onPress={() => navigation.navigate('Login')} style={styles.button} />
        <Button
          title="Cadastre-se"
          variant="outline"
          textColor={colors.primary}
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}
        />

        <TouchableOpacity onPress={continueAsGuest} style={styles.guestLink} hitSlop={8}>
          <Text style={styles.guestText}>Continuar sem cadastro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  top: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  title: { ...typography.h1, color: colors.white, marginTop: spacing.sm },
  tagline: { ...typography.bodySemibold, color: colors.white, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  welcomeText: { ...typography.h3, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.lg },
  button: { marginBottom: spacing.sm },
  guestLink: { alignItems: 'center', marginTop: spacing.sm },
  guestText: { ...typography.smallSemibold, color: colors.textSecondary, textDecorationLine: 'underline' },
});

