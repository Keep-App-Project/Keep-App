import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import RecipeCard from '../../components/RecipeCard';
import EmptyState from '../../components/EmptyState';
import * as recipesService from '../../services/recipesService';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function RecipesScreen({ navigation }) {
  const { isGuest } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await recipesService.getRecipes();
      setRecipes(data.map((r) => ({ ...r })));
      setIsLoading(false);
    })();
  }, []);

  const handleToggleFavorite = useCallback((id) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
        onToggleFavorite={() => handleToggleFavorite(item.id)}
      />
    ),
    [navigation, handleToggleFavorite]
  );

  return (
    <View style={styles.container}>
      <GradientHeader title="Receitas" subtitle={isGuest ? 'Visitante' : 'Plano Gratuito'} showProfile />
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="large" style={styles.loading} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState icon="restaurant-outline" title="Nenhuma receita" description="Volte mais tarde para novas sugestões." />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { marginTop: spacing.xxl },
  listContent: { padding: spacing.md, paddingBottom: 120 },
});
