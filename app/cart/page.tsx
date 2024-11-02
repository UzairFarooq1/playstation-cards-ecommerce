"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          throw new Error("Failed to fetch cart");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading cart...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
            <Button asChild className="mt-4">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
