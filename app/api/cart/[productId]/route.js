import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function POST(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error("Unauthorized request: No session or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = context.params.productId;
    console.log("Processing request for product:", productId);

    // ... rest of the function remains the same
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
