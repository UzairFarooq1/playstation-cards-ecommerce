import { notFound } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default async function OrderConfirmationPage(props: {
  params: Promise<{ orderId: string }>;
}) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Order Confirmation</h1>

      <Alert variant="default">
        <AlertTitle>Thank you for your order!</AlertTitle>
        <AlertDescription>
          Your order has been successfully placed and is being processed.
        </AlertDescription>
      </Alert>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Order Details</h2>
        <p>Order ID: {order.id}</p>
        <p>Total: Ksh.{order.total.toFixed(2)}</p>
        <p>Status: {order.status}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Items</h2>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product.name} x {item.quantity} - Ksh.
              {(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Shipping Address</h2>
        <p>{order.shippingAddress}</p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Price Fluctuations</AlertTitle>
        <AlertDescription>
          Please note that prices for our products may change due to
          fluctuations in the exchange market. The final price will be confirmed
          at the time of purchase.
        </AlertDescription>
      </Alert>

      <Button asChild>
        <Link href="/contact">Send Enquiry</Link>
      </Button>
    </div>
  );
}
