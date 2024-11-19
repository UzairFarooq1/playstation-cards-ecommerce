import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, price, imageUrl, category, stockQuantity, sku } =
      await request.json();

    // Check if SKU is being changed and if it's already in use
    if (sku) {
      const existingProduct = await prisma.product.findUnique({
        where: {
          sku: sku,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingProduct) {
        return NextResponse.json(
          { error: "SKU already in use" },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        stockQuantity: parseInt(stockQuantity),
        sku,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
