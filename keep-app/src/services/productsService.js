import { USE_MOCK, wait, apiFetch } from './config';
import { mockProducts, categories, storageOptions } from './mock/products';

let products = [...mockProducts];

export async function getProducts() {
  if (USE_MOCK) {
    await wait(300);
    return [...products];
  }
  return apiFetch('/products');
}

export async function getProductById(id) {
  if (USE_MOCK) {
    await wait(200);
    return products.find((p) => p.id === id) || null;
  }
  return apiFetch(`/products/${id}`);
}

export async function addProduct(product) {
  if (USE_MOCK) {
    await wait(400);
    const newProduct = { ...product, id: `p${Date.now()}` };
    products = [newProduct, ...products];
    return newProduct;
  }
  return apiFetch('/products', { method: 'POST', body: JSON.stringify(product) });
}

export async function updateProductQuantity(id, quantity) {
  if (USE_MOCK) {
    await wait(200);
    products = products.map((p) => (p.id === id ? { ...p, quantity } : p));
    return products.find((p) => p.id === id);
  }
  return apiFetch(`/products/${id}/quantity`, { method: 'PATCH', body: JSON.stringify({ quantity }) });
}

export async function discardProduct(id, reason = 'expired') {
  if (USE_MOCK) {
    await wait(300);
    products = products.filter((p) => p.id !== id);
    return { success: true, reason };
  }
  return apiFetch(`/products/${id}/discard`, { method: 'POST', body: JSON.stringify({ reason }) });
}

export async function lookupBarcode(barcode) {
  if (USE_MOCK) {
    await wait(600);
    const found = mockProducts.find((p) => p.barcode === barcode);
    if (found) {
      return { found: true, product: { name: found.name, brand: found.brand, category: found.category, barcode } };
    }
    return { found: false };
  }
  return apiFetch(`/products/lookup/${barcode}`);
}

export function getCategories() {
  return categories;
}

export function getStorageOptions() {
  return storageOptions;
}

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProductQuantity,
  discardProduct,
  lookupBarcode,
  getCategories,
  getStorageOptions,
};
