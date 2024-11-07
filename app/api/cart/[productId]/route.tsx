import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

type RouteSegment = {
  params: {
    productId: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteSegment) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error("Unauthorized request: No session or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = params;
    console.log("Processing request for product:", productId);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      console.error("User not found for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the product exists in the database
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      console.error("Product not found for ID:", productId);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if cart item already exists
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Update quantity of existing cart item
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
        include: {
          product: true,
        },
      });
    } else {
      // Create a new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
          quantity: 1,
        },
        include: {
          product: true,
        },
      });
    }

    console.log("Cart item created/updated successfully:", cartItem);

    return NextResponse.json({
      success: true,
      data: {
        id: cartItem.id,
        quantity: cartItem.quantity,
        product: {
          id: cartItem.product.id,
          name: cartItem.product.name,
          price: cartItem.product.price,
          imageUrl: cartItem.product.imageUrl,
        },
      },
    });
  } catch (error) {
    console.error("Server error while adding to cart:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add item to cart",
      },
      { status: 500 }
    );
  }
}
