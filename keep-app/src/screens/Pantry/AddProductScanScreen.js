import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/GradientHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { usePantry } from '../../context/PantryContext';
import * as productsService from '../../services/productsService';
import colors from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { todayISO } from '../../utils/date';

// expo-camera não existe em todos os ambientes (ex.: preview web do Snack).
// Carregamos de forma tolerante para não derrubar o app.
let cameraModule = null;
try {
  cameraModule = require('expo-camera');
} catch (e) {
  cameraModule = null;
}
const isCameraAvailable = !!(cameraModule && cameraModule.CameraView && cameraModule.useCameraPermissions);

function PhotoBox({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.photoBox} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.photoText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function AddProductScanScreen({ navigation }) {
  const { addProduct } = usePantry();
  const [barcode, setBarcode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isValid = barcode.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(expiryDate);

  const handleOpenScanner = useCallback(() => {
    if (!isCameraAvailable) {
      setError('A câmera não está disponível neste ambiente. Digite o código manualmente.');
      return;
    }
    setIsScanning(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isValid) {
      setError('Informe o código de barras e a validade no formato AAAA-MM-DD.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await productsService.lookupBarcode(barcode.trim());
      if (result.found) {
        await addProduct({
          ...result.product,
          purchaseDate: todayISO(),
          expiryDate,
          quantity: 1,
          storage: 'Geladeira',
          imageUrl: null,
        });
        navigation.replace('AddProductSuccess');
      } else {
        navigation.replace('AddProductManual', { prefill: { barcode: barcode.trim(), expiryDate } });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, barcode, expiryDate, addProduct, navigation]);

  if (isScanning && isCameraAvailable) {
    const { CameraView } = cameraModule;
    return (
      <View style={styles.container}>
        <GradientHeader title="Escanear Produto" showBack onBack={() => setIsScanning(false)} />
        <View style={styles.cameraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
            onBarcodeScanned={({ data }) => {
              setBarcode(data);
              setIsScanning(false);
            }}
          />
          <View style={styles.frame} />
          <Text style={styles.hint}>Posicione o código de barras dentro da área destacada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientHeader title="Escanear Produto" showBack onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Ionicons name="barcode-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Código de barras</Text>
          </View>
          <PhotoBox icon="camera-outline" label="Adicionar foto do código de barras" onPress={handleOpenScanner} />
          <Text style={styles.orText}>Ou digite manualmente</Text>
          <Input value={barcode} onChangeText={setBarcode} placeholder="7891234567890" keyboardType="numeric" />

          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Data de validade</Text>
          </View>
          <PhotoBox icon="camera-outline" label="Adicionar foto da data de validade" onPress={handleOpenScanner} />
          <Text style={styles.orText}>Ou digite manualmente</Text>
          <Input value={expiryDate} onChangeText={setExpiryDate} placeholder="2026-12-05" error={error} />

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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  sectionTitle: { ...typography.bodySemibold, color: colors.textPrimary },
  photoBox: {
    height: 90,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primarySoft,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  photoText: { ...typography.small, color: colors.primary, marginTop: spacing.xs },
  orText: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  cameraWrapper: { flex: 1, margin: spacing.md, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.black },
  frame: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    right: '10%',
    height: 100,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
  },
  hint: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    ...typography.small,
    color: colors.white,
    textAlign: 'center',
  },
});
