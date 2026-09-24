import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import ScreenContainer from '../../components/ScreenContainer';
import { useAuth } from '../../context/AuthContext';
import * as reportsService from '../../services/reportsService';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

function VerticalBars({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={styles.verticalChart}>
      {data.map((item) => (
        <View key={item.month} style={styles.verticalColumn}>
          <View style={styles.verticalTrack}>
            <View style={[styles.verticalBar, { height: `${Math.max(4, (item.value / max) * 100)}%` }]} />
          </View>
          <Text style={styles.axisLabel}>{item.month}</Text>
        </View>
      ))}
    </View>
  );
}

function HorizontalBars({ data, labelKey, prefix = 'R$' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View>
      {data.map((item) => (
        <View key={item[labelKey]} style={styles.hRow}>
          <Text style={styles.hLabel} numberOfLines={1}>
            {item[labelKey]}
          </Text>
          <View style={styles.hTrack}>
            <View style={[styles.hBar, { width: `${Math.max(4, (item.value / max) * 100)}%` }]} />
          </View>
          <Text style={styles.hValue}>
            {prefix}
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function StatPill({ value, label, color }) {
  return (
    <View style={styles.pill}>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

export default function ReportsScreen() {
  const { isGuest } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await reportsService.getSummary();
      setSummary(data);
    })();
  }, []);

  if (!summary) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const isImproving = summary.monthOverMonthChange < 0;

  return (
    <View style={styles.container}>
      <GradientHeader title="Relatórios" subtitle={isGuest ? 'Visitante' : summary.currentPlan} showProfile />

      <ScreenContainer scroll style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.card}>
          <VerticalBars data={summary.monthlyLosses} />
        </View>

        <View style={styles.pillsRow}>
          <StatPill value={`R$${summary.lossValueTotal}`} label="Perdas no mês" color={colors.primary} />
          <StatPill value={summary.expiredCount} label="produtos vencidos" color={colors.primary} />
          <StatPill
            value={`${summary.monthOverMonthChange}%`}
            label="em rel. mês ant."
            color={isImproving ? colors.success : colors.danger}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Perdas por Categoria</Text>
          <HorizontalBars data={summary.lossesByCategory} labelKey="category" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Histórico de perdas (Meses)</Text>
          <HorizontalBars data={summary.lossHistory} labelKey="month" />
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  body: { backgroundColor: 'transparent' },
  bodyContent: { padding: spacing.md, paddingBottom: 120 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: { ...typography.bodySemibold, color: colors.textPrimary, marginBottom: spacing.md },
  verticalChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 150 },
  verticalColumn: { alignItems: 'center', flex: 1 },
  verticalTrack: { width: 36, height: 110, justifyContent: 'flex-end' },
  verticalBar: { width: '100%', backgroundColor: colors.disabled, borderRadius: radius.sm },
  axisLabel: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  pillsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  pill: {
    flex: 1,
    backgroundColor: colors.primaryPale,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  pillValue: { ...typography.h3 },
  pillLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  hRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  hLabel: { ...typography.caption, color: colors.textSecondary, width: 68 },
  hTrack: { flex: 1, height: 12, backgroundColor: colors.primaryPale, borderRadius: radius.sm, overflow: 'hidden' },
  hBar: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.sm },
  hValue: { ...typography.caption, color: colors.textPrimary, width: 42, textAlign: 'right' },
});
