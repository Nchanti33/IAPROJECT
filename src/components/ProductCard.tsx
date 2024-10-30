import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">{product.price} €</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-green-700 transition-colors"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{product.stock > 0 ? 'Ajouter' : 'Rupture'}</span>
          </button>
        </div>
        <div className="mt-2">
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
          </span>
        </div>
      </div>
    </div>
  );
}