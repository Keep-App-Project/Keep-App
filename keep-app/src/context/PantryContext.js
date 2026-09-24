import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as productsService from '../services/productsService';
import { getExpiryStatus } from '../utils/date';

const PantryContext = createContext(null);

export function PantryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = useCallback(async (product) => {
    const created = await productsService.addProduct(product);
    setProducts((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateQuantity = useCallback(async (id, quantity) => {
    if (quantity <= 0) return;
    const updated = await productsService.updateProductQuantity(id, quantity);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const discardProduct = useCallback(async (id, reason) => {
    await productsService.discardProduct(id, reason);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const expired = products.filter((p) => getExpiryStatus(p.expiryDate) === 'expired').length;
    const soon = products.filter((p) => getExpiryStatus(p.expiryDate) === 'soon').length;
    return { total, expired, soon };
  }, [products]);

  const value = useMemo(
    () => ({ products, isLoading, error, stats, refreshProducts, addProduct, updateQuantity, discardProduct }),
    [products, isLoading, error, stats, refreshProducts, addProduct, updateQuantity, discardProduct]
  );

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry deve ser usado dentro de PantryProvider');
  return ctx;
}

export default PantryContext;
