import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as recipesService from '../../services/recipesService';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const data = await recipesService.getRecipeById(recipeId);
      setRecipe(data);
    })();
  }, [recipeId]);

  if (!recipe) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} resizeMode="cover" />

        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + spacing.sm }]}
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.tempoPreparo} min</Text>
            <View style={styles.ratingRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons key={i} name={i < recipe.rating ? 'star' : 'star-outline'} size={12} color={colors.primary} />
              ))}
            </View>
          </View>

          <Text style={styles.description}>{recipe.description}</Text>

          <Text style={styles.sectionTitle}>Modo de preparo</Text>
          <Text style={styles.description}>{recipe.modoPreparo}</Text>
        </View>

        <View style={styles.ingredients}>
          {recipe.ingredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.ingredientRow}>
              <View style={[styles.checkBox, ingredient.have && styles.checkBoxActive]}>
                {ingredient.have ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
              </View>
              <Text style={styles.ingredientText}>{ingredient.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  content: { paddingBottom: 120 },
  image: { width: '100%', height: 220 },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginTop: -spacing.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.xs, marginBottom: spacing.md },
  metaText: { ...typography.caption, color: colors.textSecondary, marginRight: spacing.sm },
  ratingRow: { flexDirection: 'row' },
  description: { ...typography.body, color: colors.textSecondary, textAlign: 'justify', marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  ingredients: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.primaryPale,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkBoxActive: { backgroundColor: colors.success, borderColor: colors.success },
  ingredientText: { ...typography.body, color: colors.textPrimary },
});
