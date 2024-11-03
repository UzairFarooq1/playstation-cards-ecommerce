"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const addToCart = async () => {
    setIsAdding(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        alert("Product added to cart!");
        router.refresh(); // This will trigger a re-render of the Navigation component
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button onClick={addToCart} disabled={isAdding}>
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
