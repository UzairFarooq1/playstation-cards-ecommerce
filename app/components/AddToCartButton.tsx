"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

export default function AddToCartButton({
  productId,
  className,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addToCart = async () => {
    if (
      !productId ||
      typeof productId !== "string" ||
      productId.trim() === ""
    ) {
      toast.error("Invalid product ID");
      return;
    }

    try {
      setLoading(true);
      console.log("Adding product to cart with ID:", productId);

      const response = await fetch(
        `/api/cart/${encodeURIComponent(productId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const result = await response.json();
      console.log("Server response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to add to cart");
      }

      if (result.success) {
        toast.success("Item added to cart");
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={addToCart}
      disabled={loading || !productId}
      className={className}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
