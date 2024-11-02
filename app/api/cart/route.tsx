import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Mock cart data (replace with actual database operations in a real application)
let cart: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}[] = [];

export async function GET() {
  try {
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl || "",
      });
    }

    return NextResponse.json(
      { message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, quantity } = await request.json();
    const itemIndex = cart.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart[itemIndex].quantity = quantity;

    return NextResponse.json(
      { message: "Cart updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    cart = cart.filter((item) => item.id !== id);

    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
