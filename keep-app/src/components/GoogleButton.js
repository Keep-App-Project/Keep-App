import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

export default function GoogleButton({ title = 'Continuar com o google', onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconCircle}>
        <Ionicons name="logo-google" size={14} color={colors.primary} />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: { marginRight: spacing.sm },
  text: { ...typography.smallSemibold, color: colors.textSecondary },
});
