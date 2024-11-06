import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    console.log("Incoming request params:", params);

    if (!params || !params.productId) {
      console.error("ProductId missing from params:", params);
      return NextResponse.json(
        { success: false, error: "Missing product ID" },
        { status: 400 }
      );
    }

    const { productId } = params;
    console.log("Extracted productId:", productId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error("Product not found:", productId);
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.$transaction(async (tx) => {
      const existing = await tx.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId,
          },
        },
      });

      if (existing) {
        return await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + 1 },
          include: { product: true },
        });
      }

      return await tx.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
          quantity: 1,
        },
        include: { product: true },
      });
    });

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
    console.error("Cart operation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to add item to cart",
      },
      { status: 500 }
    );
  }
}
