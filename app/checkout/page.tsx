"use client";

import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useSession } from "next-auth/react";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!session) {
      alert("Please log in to place an order");
      return;
    }

    const orderDetails = cart
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");
    const message = `New order: ${orderDetails}. Total: $${total.toFixed(2)}`;

    try {
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setOrderPlaced(true);
        clearCart();
      } else {
        throw new Error("Failed to send WhatsApp message");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="text-center mt-8">
        Thank you for your order! We'll contact you via WhatsApp shortly.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map((item) => (
              <li key={item.id} className="mb-2">
                {item.name} - Quantity: {item.quantity} - $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="font-bold mb-4">Total: ${total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white p-2 rounded"
          >
            Place Order via WhatsApp
          </button>
        </>
      )}
    </div>
  );
}
