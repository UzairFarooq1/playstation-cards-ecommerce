import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    // In a real application, you'd associate this with a user session
    // For now, we'll just return a success message
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

export async function GET() {
  try {
    // In a real application, you'd fetch the cart items for the current user
    // For now, we'll just return a mock cart
    const mockCart = [
      {
        id: "1",
        name: "PlayStation Store $20 Gift Card",
        price: 20,
        quantity: 1,
      },
      {
        id: "2",
        name: "PlayStation Plus 3-Month Membership",
        price: 24.99,
        quantity: 1,
      },
    ];

    return NextResponse.json(mockCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
