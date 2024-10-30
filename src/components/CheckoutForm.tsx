import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item.product.id,
            quantity: item.quantity
          })),
          shippingAddress: address,
          paymentMethod
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      clearCart();
      // Redirect to order confirmation page
      window.location.href = '/order-confirmation';
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to checkout</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Street</label>
            <input
              type="text"
              required
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              required
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="ml-2">Credit Card</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="ml-2">PayPal</span>
          </label>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Total:</span>
          <span>{total.toFixed(2)} €</span>
        </div>
        <button
          type="submit"
          disabled={isLoading || items.length === 0}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  );
}