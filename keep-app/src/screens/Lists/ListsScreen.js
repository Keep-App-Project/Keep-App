import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/GradientHeader';
import EmptyState from '../../components/EmptyState';
import * as listsService from '../../services/listsService';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function ListsScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadLists = useCallback(async () => {
    setIsLoading(true);
    const data = await listsService.getLists();
    setLists(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleCreate = useCallback(async () => {
    if (!newListName.trim()) return;
    setIsCreating(true);
    try {
      const created = await listsService.createList(newListName.trim());
      setLists((prev) => [...prev, created]);
      setNewListName('');
    } finally {
      setIsCreating(false);
    }
  }, [newListName]);

  const renderItem = useCallback(
    ({ item }) => {
      const doneCount = item.items.filter((i) => i.comprado).length;
      return (
        <TouchableOpacity
          style={styles.listCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ListDetail', { listId: item.id, listName: item.name })}
        >
          <View style={styles.listIcon}>
            <Ionicons name="list" size={20} color={colors.primary} />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>{item.name}</Text>
            <Text style={styles.listCount}>
              {doneCount}/{item.items.length} itens concluídos
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      );
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <GradientHeader title="Minhas listas" subtitle="Organize suas compras" />

      <View style={styles.createRow}>
        <TextInput
          style={styles.createInput}
          placeholder="Nova lista..."
          placeholderTextColor={colors.textMuted}
          value={newListName}
          onChangeText={setNewListName}
          onSubmitEditing={handleCreate}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={isCreating || !newListName.trim()}>
          {isCreating ? <ActivityIndicator color={colors.white} size="small" /> : <Ionicons name="add" size={22} color={colors.white} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading && (
            <EmptyState icon="list-outline" title="Nenhuma lista ainda" description="Crie sua primeira lista de compras acima." />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: -spacing.lg,
    gap: spacing.sm,
  },
  createInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    ...typography.body,
    color: colors.textPrimary,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  createButton: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { padding: spacing.md, paddingBottom: 120 },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  listIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  listInfo: { flex: 1 },
  listName: { ...typography.bodySemibold, color: colors.textPrimary },
  listCount: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
