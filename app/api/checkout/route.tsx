import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    console.log("Checkout process started");

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("Unauthorized: No valid session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, customerInfo } = await request.json();
    console.log("Received checkout data:", { cartItems, customerInfo });

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error("User not found:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.id);

    // Fetch full product details for each cart item
    const productsWithDetails = await Promise.all(
      cartItems.map(async (item: { productId: string; quantity: number }) => {
        console.log(item.productId);
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          console.error(`Product not found: ${item.productId}`);
          throw new Error(`Product not found: ${item.productId}`);
        }
        return { ...product, quantity: item.quantity };
      })
    );

    console.log("Products fetched:", productsWithDetails);

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        total: productsWithDetails.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        shippingAddress: customerInfo.address,
        items: {
          create: productsWithDetails.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log("Order created:", order);

    // Prepare the message for WhatsApp
    const message =
      `New Order #${order.id}:\n\n` +
      order.items
        .map(
          (item) =>
            `${item.product.name} x${item.quantity} - $${
              item.price * item.quantity
            }`
        )
        .join("\n") +
      `\n\nTotal: $${order.total}\n` +
      `Shipping Address: ${order.shippingAddress}\n` +
      `Customer: ${customerInfo.name} (${customerInfo.email})`;

    console.log("WhatsApp message:", message);

    // Generate WhatsApp Click to Chat link
    const whatsappLink = generateWhatsAppLink("254791495274", message);

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    console.log("Cart cleared for user:", user.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      whatsappLink,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
