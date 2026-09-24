import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AuthHeader from '../../components/AuthHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import GoogleButton from '../../components/GoogleButton';
import Checkbox from '../../components/Checkbox';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipoUso, setTipoUso] = useState('domestico');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password.length >= 8 &&
    password === confirmPassword &&
    acceptedTerms;

  const handleSignUp = useCallback(async () => {
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signUp({ firstName, lastName, email, phone, tipoUso });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, phone, tipoUso, password, confirmPassword, signUp]);

  return (
    <View style={styles.container}>
      <AuthHeader title="Crie sua conta" subtitle="Antes de ir, cadastre-se e reduza o desperdício" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="Nome" value={firstName} onChangeText={setFirstName} placeholder="Ex: Maria" autoCapitalize="words" />
              </View>
              <View style={styles.half}>
                <Input label="Sobrenome" value={lastName} onChangeText={setLastName} placeholder="Ex: Silva" autoCapitalize="words" />
              </View>
            </View>

            <Input label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email" keyboardType="email-address" />
            <Input label="Celular" value={phone} onChangeText={setPhone} placeholder="(11) 9 0000-0000" keyboardType="phone-pad" />
            <Input label="Senha" value={password} onChangeText={setPassword} placeholder="Mín. 8 caracteres" secureTextEntry />
            <Input
              label="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita a senha"
              secureTextEntry
              error={error}
            />

            <Text style={styles.label}>Tipo de uso</Text>
            <View style={styles.row}>
              <Checkbox
                label="Doméstico"
                checked={tipoUso === 'domestico'}
                onPress={() => setTipoUso('domestico')}
                style={styles.half}
              />
              <Checkbox
                label="Restaurante"
                checked={tipoUso === 'restaurante'}
                onPress={() => setTipoUso('restaurante')}
                style={styles.half}
              />
            </View>

            <Checkbox
              label="Li e aceito os Termos de Uso e a Política de Privacidade"
              checked={acceptedTerms}
              onPress={() => setAcceptedTerms((prev) => !prev)}
              style={styles.terms}
            />

            <Button title="Criar Conta" onPress={handleSignUp} loading={loading} disabled={!isValid} style={styles.mainButton} />
            <GoogleButton />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={styles.loginText}>
              Já tem conta? <Text style={styles.loginTextBold}>Entre</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  label: { ...typography.smallSemibold, color: colors.textPrimary, marginBottom: spacing.xs },
  terms: { marginTop: spacing.md, marginBottom: spacing.lg },
  mainButton: { marginBottom: spacing.sm },
  loginLink: { alignItems: 'center', marginTop: spacing.md },
  loginText: { ...typography.small, color: colors.textSecondary },
  loginTextBold: { color: colors.primary, fontFamily: typography.smallSemibold.fontFamily },
});
