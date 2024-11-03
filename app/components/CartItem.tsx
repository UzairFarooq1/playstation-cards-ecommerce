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

// app/api/cart/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // First check if the cart item exists
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.productId,
        },
      },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // If the item exists, delete it
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.productId,
        },
      },
    });

    return NextResponse.json({
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error removing from cart:", error);

    // Check if it's a Prisma error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to remove item: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
