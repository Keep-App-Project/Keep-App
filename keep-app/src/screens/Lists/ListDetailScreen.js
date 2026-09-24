import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/GradientHeader';
import EmptyState from '../../components/EmptyState';
import * as listsService from '../../services/listsService';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function ListDetailScreen({ route, navigation }) {
  const { listId, listName } = route.params;
  const [list, setList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [isAdding, setIsAdding] = useState(false);

  const loadList = useCallback(async () => {
    setIsLoading(true);
    const data = await listsService.getListById(listId);
    setList(data);
    setIsLoading(false);
  }, [listId]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleAddItem = useCallback(async () => {
    if (!itemName.trim()) return;
    setIsAdding(true);
    try {
      const updated = await listsService.addItemToList(listId, {
        name: itemName.trim(),
        quantity: Math.max(1, parseInt(itemQuantity, 10) || 1),
      });
      setList(updated);
      setItemName('');
      setItemQuantity('1');
    } finally {
      setIsAdding(false);
    }
  }, [listId, itemName, itemQuantity]);

  const handleToggle = useCallback(
    async (itemId) => {
      const updated = await listsService.toggleItemComprado(listId, itemId);
      setList(updated);
    },
    [listId]
  );

  const handleRemove = useCallback(
    async (itemId) => {
      const updated = await listsService.removeItem(listId, itemId);
      setList(updated);
    },
    [listId]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemRow}>
        <TouchableOpacity style={styles.checkbox} onPress={() => handleToggle(item.id)} hitSlop={8}>
          <Ionicons
            name={item.comprado ? 'checkbox' : 'square-outline'}
            size={22}
            color={item.comprado ? colors.primary : colors.textMuted}
          />
        </TouchableOpacity>
        <Text style={[styles.itemName, item.comprado && styles.itemNameDone]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleRemove(item.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    ),
    [handleToggle, handleRemove]
  );

  return (
    <View style={styles.container}>
      <GradientHeader title={listName} showBack onBack={() => navigation.goBack()} />

      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="Nome do item"
          placeholderTextColor={colors.textMuted}
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={styles.qtyInput}
          placeholder="1"
          placeholderTextColor={colors.textMuted}
          value={itemQuantity}
          onChangeText={setItemQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem} disabled={isAdding || !itemName.trim()}>
          {isAdding ? <ActivityIndicator color={colors.white} size="small" /> : <Ionicons name="add" size={20} color={colors.white} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={list?.items || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading && <EmptyState icon="checkmark-done-outline" title="Lista vazia" description="Adicione itens acima." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  addRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md, marginTop: -spacing.lg, gap: spacing.xs },
  addInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    ...typography.body,
    color: colors.textPrimary,
  },
  qtyInput: {
    width: 50,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 46,
    textAlign: 'center',
    ...typography.body,
    color: colors.textPrimary,
  },
  addButton: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: spacing.md, paddingBottom: 120 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  checkbox: { marginRight: spacing.xs },
  itemName: { flex: 1, ...typography.body, color: colors.textPrimary },
  itemNameDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  itemQuantity: { ...typography.smallSemibold, color: colors.textSecondary, marginRight: spacing.sm },
});
