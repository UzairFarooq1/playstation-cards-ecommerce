import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received product data:", body);

    const { name, description, price, imageUrl, category, stockQuantity, sku } =
      body;

    // Validate the input
    if (!name || !price || typeof price !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        category,
        stockQuantity: parseInt(stockQuantity),
        sku,
      },
    });

    console.log("Product created:", product);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
