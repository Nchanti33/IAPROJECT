import { useState, useEffect } from 'react';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sécateur Professionnel',
    price: 49.99,
    description: 'Sécateur ergonomique pour une coupe précise',
    category: 'Outils',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 15
  },
  {
    id: '2',
    name: 'Arrosoir 10L',
    price: 29.99,
    description: 'Arrosoir en acier galvanisé avec pomme d\'arrosage',
    category: 'Arrosage',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 8
  },
  {
    id: '3',
    name: 'Kit de Jardinage',
    price: 79.99,
    description: 'Kit complet avec pelle, râteau et transplantoir',
    category: 'Outils',
    image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 5
  },
  {
    id: '4',
    name: 'Gants de Jardinage',
    price: 19.99,
    description: 'Gants résistants en cuir synthétique',
    category: 'Protection',
    image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 20
  }
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    setCategories(uniqueCategories);
  }, [products]);

  return {
    products,
    categories,
    // Later we'll add methods to fetch from API
    // fetchProducts: () => {},
    // searchProducts: (term: string) => {},
  };
}