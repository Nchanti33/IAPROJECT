import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useParams, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PaymentForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to initialize');

        // Get client secret
        const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ orderId })
        });

        if (!response.ok) throw new Error('Payment initialization failed');

        const { clientSecret } = await response.json();

        // Confirm payment
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement('card'),
            billing_details: {
              name: 'Customer Name', // You should get this from your form
            },
          },
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        // Payment successful
        navigate(`/order-confirmation/${orderId}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      initializePayment();
    }
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-600 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>
      <div id="card-element" className="mb-6">
        {/* Stripe Card Element will be inserted here */}
      </div>
      <button
        className="w-full bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700"
        onClick={handleSubmit}
      >
        Payer
      </button>
    </div>
  );
}