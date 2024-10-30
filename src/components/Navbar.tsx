import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-green-600 text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/logo.svg" 
                alt="E-Jardin Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">E-Jardin</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/products" className="hover:text-green-200">Produits</a>
            <a href="/categories" className="hover:text-green-200">Catégories</a>
            <a href="/about" className="hover:text-green-200">À propos</a>
            <a href="/contact" className="hover:text-green-200">Contact</a>
            <div className="flex items-center space-x-4">
              <button onClick={onCartClick} className="hover:text-green-200 relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              {user ? (
                <div className="relative group">
                  <button className="hover:text-green-200 flex items-center space-x-2">
                    <User className="h-6 w-6" />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </a>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <a href="/login" className="hover:text-green-200">
                  <User className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-green-200 hover:bg-green-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/products" className="block px-3 py-2 hover:bg-green-700 rounded-md">Produits</a>
            <a href="/categories" className="block px-3 py-2 hover:bg-green-700 rounded-md">Catégories</a>
            <a href="/about" className="block px-3 py-2 hover:bg-green-700 rounded-md">À propos</a>
            <a href="/contact" className="block px-3 py-2 hover:bg-green-700 rounded-md">Contact</a>
            <button onClick={onCartClick} className="block w-full text-left px-3 py-2 hover:bg-green-700 rounded-md">
              Panier ({cartItemsCount})
            </button>
            {user ? (
              <>
                <a href="/profile" className="block px-3 py-2 hover:bg-green-700 rounded-md">Profile</a>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 hover:bg-green-700 rounded-md"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <a href="/login" className="block px-3 py-2 hover:bg-green-700 rounded-md">Connexion</a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}