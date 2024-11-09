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
        // Check specifically for unauthorized error
        if (
          response.status === 401 ||
          result.error?.toLowerCase().includes("unauthorized") ||
          result.error?.toLowerCase().includes("unauthorised")
        ) {
          toast.error("Please log in to add items to cart");
          router.push("/login");
          return;
        }
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
      // Don't show error toast if we're redirecting to login
      if (
        !(
          error instanceof Error &&
          error.message.toLowerCase().includes("unauthorized")
        )
      ) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add to cart"
        );
      }
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
