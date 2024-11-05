import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        total,
        shippingAddress: address,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    // Generate WhatsApp message
    const message = generateWhatsAppMessage(order, name, phone, address);
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(
      message
    )}`;

    return NextResponse.json({ success: true, whatsappUrl, orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

function generateWhatsAppMessage(
  order,
  name: string,
  phone: string,
  address: string
): string {
  let message = `New Order:\n\nCustomer: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nOrder Details:\n`;

  order.items.forEach((item) => {
    message += `${item.product.name} x${item.quantity} - $${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  message += `\nTotal: $${order.total.toFixed(2)}`;
  return message;
}
