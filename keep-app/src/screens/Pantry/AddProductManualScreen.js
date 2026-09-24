import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/GradientHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import { usePantry } from '../../context/PantryContext';
import * as productsService from '../../services/productsService';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { todayISO } from '../../utils/date';

export default function AddProductManualScreen({ route, navigation }) {
  const prefill = route.params?.prefill || {};
  const { addProduct } = usePantry();
  const categories = useMemo(() => productsService.getCategories(), []);
  const storageOptions = useMemo(() => productsService.getStorageOptions(), []);

  const [name, setName] = useState(prefill.name || '');
  const [brand, setBrand] = useState(prefill.brand || '');
  const [category, setCategory] = useState(prefill.category || categories[0]);
  const [storage, setStorage] = useState(storageOptions[0]);
  const [purchaseDate, setPurchaseDate] = useState(todayISO());
  const [expiryDate, setExpiryDate] = useState(prefill.expiryDate || '');
  const [quantity, setQuantity] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isValid = name.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(expiryDate);

  const handleSubmit = useCallback(async () => {
    if (!isValid) {
      setError('Preencha o nome e a validade no formato AAAA-MM-DD.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await addProduct({
        name: name.trim(),
        brand: brand.trim() || null,
        category,
        barcode: prefill.barcode || null,
        purchaseDate,
        expiryDate,
        quantity: Math.max(1, parseInt(quantity, 10) || 1),
        storage,
        imageUrl: null,
      });
      navigation.replace('AddProductSuccess');
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, addProduct, name, brand, category, prefill.barcode, purchaseDate, expiryDate, quantity, storage, navigation]);

  return (
    <View style={styles.container}>
      <GradientHeader title="Cadastrar Manualmente" showBack onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.photoBox}>
            <Ionicons name="camera-outline" size={26} color={colors.primary} />
            <Text style={styles.photoText}>Adicionar foto do produto</Text>
          </View>

          <Input label="Nome do produto" value={name} onChangeText={setName} placeholder="Ex: pão" />
          <Input label="Marca" value={brand} onChangeText={setBrand} placeholder="Ex: Pullman" />

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.grid}>
            {categories.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={category === option}
                onPress={() => setCategory(option)}
                style={styles.gridItem}
              />
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Input label="Data da Compra" value={purchaseDate} onChangeText={setPurchaseDate} placeholder="2026-12-05" icon="calendar-outline" />
            </View>
            <View style={styles.half}>
              <Input label="Data de Validade" value={expiryDate} onChangeText={setExpiryDate} placeholder="2027-12-05" icon="calendar-outline" error={error} />
            </View>
          </View>

          <Input label="Quantidade" value={quantity} onChangeText={setQuantity} placeholder="Ex: 20" keyboardType="numeric" />

          <Text style={styles.label}>Local de Armazenamento</Text>
          <View style={styles.grid}>
            {storageOptions.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={storage === option}
                onPress={() => setStorage(option)}
                style={styles.gridItem}
              />
            ))}
          </View>

          <Button title="Cadastrar Produto" onPress={handleSubmit} loading={isSubmitting} disabled={!isValid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  photoBox: {
    height: 84,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primarySoft,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: -spacing.lg,
  },
  photoText: { ...typography.small, color: colors.primary, marginTop: spacing.xs },
  label: { ...typography.smallSemibold, color: colors.textPrimary, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  gridItem: { width: '50%', marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
});
