// app/components/CartItem.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // You'll need to install react-hot-toast

interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function CartItem({
  id,
  productId,
  name,
  price,
  quantity,
  imageUrl,
}: CartItemProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const removeFromCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove from cart");
      }

      toast.success("Item removed from cart");
      router.refresh();
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-600">
          ${price.toFixed(2)} x {quantity}
        </p>
      </div>
      <button
        onClick={removeFromCart}
        disabled={loading}
        className="text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        {loading ? "Removing..." : "Remove"}
      </button>
    </div>
  );
}
