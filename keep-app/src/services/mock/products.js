export const mockProducts = [
  {
    id: 'p1',
    name: 'Leite integral',
    brand: 'Piracanjuba',
    category: 'Laticínios',
    barcode: '21471298468',
    purchaseDate: '2026-05-10',
    expiryDate: '2026-06-07',
    quantity: 1,
    storage: 'Geladeira',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
  },
  {
    id: 'p2',
    name: 'Queijo Parmesão',
    brand: 'Tirolez',
    category: 'Laticínios',
    barcode: '7896183701234',
    purchaseDate: '2026-06-01',
    expiryDate: '2026-06-21',
    quantity: 1,
    storage: 'Geladeira',
    imageUrl: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=300',
  },
  {
    id: 'p5',
    name: 'Pão de forma',
    brand: 'Pullman',
    category: 'Panificados',
    barcode: '7891234567890',
    purchaseDate: '2026-06-10',
    expiryDate: '2026-07-05',
    quantity: 1,
    storage: 'Despensa',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
  },
  {
    id: 'p6',
    name: 'Tomate',
    brand: null,
    category: 'Hortifruti',
    barcode: null,
    purchaseDate: '2026-06-15',
    expiryDate: '2026-06-25',
    quantity: 6,
    storage: 'Geladeira',
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300',
  },
];

export const categories = ['Panificados', 'Carnes', 'Laticínios', 'Enlatados', 'Bebidas', 'Hortifruti'];
export const storageOptions = ['Geladeira', 'Freezer', 'Despensa', 'Cozinha'];

export default mockProducts;
