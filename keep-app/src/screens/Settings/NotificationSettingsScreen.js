import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import ScreenContainer from '../../components/ScreenContainer';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function NotificationSettingsScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [enabled, setEnabled] = useState(user?.notificationsEnabled ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = useCallback(
    async (value) => {
      setEnabled(value);
      setIsSaving(true);
      try {
        await updateUser({ notificationsEnabled: value });
      } finally {
        setIsSaving(false);
      }
    },
    [updateUser]
  );

  return (
    <View style={styles.container}>
      <GradientHeader title="Notificações" showBack onBack={() => navigation.goBack()} />
      <ScreenContainer style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Alertas de validade</Text>
            <Text style={styles.rowDescription}>Receba um aviso quando um produto estiver perto de vencer.</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            disabled={isSaving}
            trackColor={{ false: colors.disabled, true: colors.primarySoft }}
            thumbColor={enabled ? colors.primary : colors.white}
          />
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { backgroundColor: 'transparent' },
  bodyContent: { padding: spacing.md, marginTop: -spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  rowText: { flex: 1, marginRight: spacing.md },
  rowTitle: { ...typography.bodySemibold, color: colors.textPrimary },
  rowDescription: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
