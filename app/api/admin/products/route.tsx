import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, price, category, stockQuantity } = await request.json();

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        stockQuantity: parseInt(stockQuantity),
        sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error adding new product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
