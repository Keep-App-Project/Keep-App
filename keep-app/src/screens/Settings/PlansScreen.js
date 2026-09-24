import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/GradientHeader';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import * as plansService from '../../services/plansService';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

function ComparisonValue({ value }) {
  if (value === true) return <Ionicons name="checkmark" size={14} color={colors.textPrimary} />;
  if (value === false) return <Ionicons name="close" size={14} color={colors.danger} />;
  return <Text style={styles.tableValueText}>{value}</Text>;
}

export default function PlansScreen({ navigation }) {
  const [plans, setPlans] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await plansService.getPlans();
      setPlans(data);
      setActiveId(data[0]?.id ?? null);
      setIsLoading(false);
    })();
  }, []);

  const activePlan = useMemo(() => plans.find((p) => p.id === activeId) || null, [plans, activeId]);

  const handleSubscribe = useCallback(async (planId) => {
    setSubscribingId(planId);
    try {
      await plansService.subscribeToPlan(planId);
      Alert.alert('Assinatura confirmada', 'Seu plano foi atualizado com sucesso!');
    } finally {
      setSubscribingId(null);
    }
  }, []);

  return (
    <View style={styles.container}>
      <GradientHeader title="Escolha seu plano" showBack onBack={() => navigation.goBack()} showProfile />
      <ScreenContainer scroll style={styles.body} contentContainerStyle={styles.bodyContent}>
        {isLoading || !activePlan ? (
          <ActivityIndicator color={colors.primary} size="large" style={styles.loading} />
        ) : (
          <>
            <View style={styles.tabs}>
              {plans.map((plan) => {
                const isActive = plan.id === activeId;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[styles.tab, isActive && styles.tabActive]}
                    onPress={() => setActiveId(plan.id)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={plan.icon}
                      size={14}
                      color={isActive ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{plan.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name={activePlan.icon} size={22} color={colors.primary} />
                <Text style={styles.planName}>{activePlan.name}</Text>
              </View>
              <Text style={styles.planDescription}>{activePlan.description}</Text>
              <Text style={styles.price}>{activePlan.priceLabel}</Text>
              <Text style={styles.annual}>{activePlan.annualLabel}</Text>

              <Button
                title={activePlan.ctaLabel}
                onPress={() => handleSubscribe(activePlan.id)}
                loading={subscribingId === activePlan.id}
                style={styles.cta}
              />

              {activePlan.features.map((feature) => (
                <View key={feature} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.tableTitle}>Comparativo</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableCellFeature, styles.tableHeaderText]}>Recurso</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Free</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>
                  {activePlan.id === 'home' ? 'Casa' : 'Business'}
                </Text>
              </View>
              {activePlan.comparison.map((row) => (
                <View key={row.feature} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellFeature]} numberOfLines={1}>
                    {row.feature}
                  </Text>
                  <View style={styles.tableCell}>
                    <ComparisonValue value={row.free} />
                  </View>
                  <View style={styles.tableCell}>
                    <ComparisonValue value={row.plan} />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { backgroundColor: 'transparent' },
  bodyContent: { padding: spacing.md, marginTop: -spacing.lg, paddingBottom: 120 },
  loading: { marginTop: spacing.xxl },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  tabActive: { borderColor: colors.primary, backgroundColor: colors.primaryPale },
  tabText: { ...typography.caption, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontFamily: typography.smallSemibold.fontFamily },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  planName: { ...typography.h3, color: colors.textPrimary },
  planDescription: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  price: { ...typography.h2, color: colors.primary, marginTop: spacing.sm },
  annual: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.md },
  cta: { marginBottom: spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  featureText: { ...typography.small, color: colors.textPrimary, flex: 1 },
  tableTitle: { ...typography.bodySemibold, color: colors.textPrimary, marginBottom: spacing.sm },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primaryPale,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tableCellFeature: { flex: 2.2, alignItems: 'flex-start', ...typography.caption, color: colors.textPrimary },
  tableHeaderText: { ...typography.caption, color: colors.textSecondary },
  tableValueText: { ...typography.caption, color: colors.textPrimary },
});
